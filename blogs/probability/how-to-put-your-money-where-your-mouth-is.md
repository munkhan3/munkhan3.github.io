---
title: "How To: Put Your Money Where Your Mouth Is"
date: 2026-03-16
tags: [probability, prediction markets, expected value]
description: "Duke is winning it all this year. I wouldn't bet on it though."
keywords: [kalshi, duke basketball, march madness, betting odds]
draft: false
published: true
---

<h3>The Big Dance</h3>

If you're a college basketball fan and have strong opinions on whether Duke will win the championship this year, you can go to Kalshi and speculate on those opinions. You basically have three options:

1. If you think Duke has an incredible team and has a good chance of winning, you might bet on `DUKE: YES`
2. If you think Duke has a tendency to choke in the big games and are quite confident that they will not win, you might bet on `DUKE: NO`
3. If you're just a fan of the game and don't have strong opinions either way, it doesn't make too much sense to put your money on the line

That's some pretty handwavy logic though. Where do you draw the line at being "quite confident"? What exactly is a "good chance"? Some might suggest anything over $$50\%$$, but what if the bet is super expensive? You'd want to be more certain that your investment will pay off, so shouldn't it be higher? Similarly if the bet is super cheap, shouldn't the bar be lower? The intuition here is that the threshold you use to make your decision should depend on what the bet **_costs_**.

<h3>Well... What Should We Expect?</h3>

Right now, a `DUKE: YES` contract costs ~$$20\textrm{¢}$$ on Kalshi and pays out $$\$1$$ if Duke wins but $$\$0$$ if they don't. In other words, you'd make $$80\textrm{¢}$$ if Duke wins but lose $$20\textrm{¢}$$ if they don't. Let's try to set our threshold based on this. We just need to be confident enough to _expect_ a profit from our investment. If we believe that we'll win $$80\textrm{¢}$$ with probability $$p$$ and lose $$20\textrm{¢}$$ with probability $$1-p$$, then our expected profit would be...[^3]

$$
p \cdot \$0.80 - (1-p) \cdot \$0.20
$$

In mathematical terms, we write this as $$\mathbb{E}[X]$$, where $$X$$ is our profit at the end of the tournament. Obviously, we would like to have a positive expected profit, so we can write...

$$
\mathbb{E}[X] = p \cdot \$0.80 - (1-p) \cdot \$0.20 > 0
$$

We find that $$p > 0.20$$, which means we should only bet if we believe there's more than a $$20\%$$ chance Duke wins it all. If not, there's no point because the contract is **_too expensive for what we expect it to return_**.[^2] Hopefully that's a more satisfactory answer.

<h3>Coincidence? I Think Not</h3>

If you've been paying attention (you've gotten this far so I assume you are), you'll point out that the threshold is exactly the price. This is not at all a coincidence -- it's a direct result of the fact that the payout is $$\$1$$. The most you can ever win is $$\$1$$, so the expected value of the contract in dollars _is_ the probability that it pays out.

$$
\begin{aligned}
\mathbb{E}[Y] = p \cdot \$1 + (1-p) \cdot \$0 = \$p \;\; \checkmark
\end{aligned}
$$

This idea _can_ be extended to less "standard" payoffs though. Consider the following example:

> `AAPL` is trading at around $250 because they're undergoing some interesting changes tonight that will force their shares to open tomorrow at either $100 or $300. Given no other information, what would you say is the probability they open at $300 tomorrow?
>
> Let's translate this to an event contract in two steps...
>
> 1. $$ \$100 \xrightarrow{-\$100} \$0 \qquad \$300 \xrightarrow{-\$100} \$200 $$
> 2. $$ \$0 \xrightarrow{\times \tfrac{1}{200}} \$0 \qquad \$200 \xrightarrow{\times \tfrac{1}{200}} \$1 $$
>
> Basically, we have 200 event contracts that each pay out $1 if the share price tomorrow is $300 and $0 if the share price tomorrow is $100. Kalshi is also feeling charitable today so we get an extra $100 at the end (regardless of the outcome) to make this comparison work. Applying the same transformation to today's price, we get...
>
> $$ \$250 \xrightarrow{-\$100} \$150 \xrightarrow{\times \tfrac{1}{200}} \$0.75 $$
>
> So we can say that the probability `AAPL` opens at $300 tomorrow is about 75%. This is pretty cool, but you can follow some more straightforward logic to get to the same place. Since the current price has stabilized at $250, we can say that **_the market collectively expects_** the price to be $250 tomorrow.[^4] So...
>
> $$ \$250 = p \cdot \$300 + (1-p) \cdot \$100 \Rightarrow p = 0.75 \;\; \checkmark $$

The probability that we determine by leveraging the collective expectation of the market like this is called the **_implied probability_** or **_implied odds_**.[^5] In the case of the `DUKE: YES` contract, since the price is $$20\textrm{¢}$$, we can say that the market implied probability of Duke winning it all is about $$20\%$$.[^1] This idea proves to be incredibly useful as long as you follow a few caveats (as always).[^6]

<h3>Ok, Cool Math... So What?</h3>

Now that you can estimate what the market prices imply, you can use the same thresholding logic as before to make decisions. If the market implied probability of an event is $$75\%$$ but you believe there's only a $$60\%$$ chance, then the market (in your view) is _mispriced_ and you can take advantage of it. In the `AAPL` case, you'd sell shares because you're saying the $$\$100$$ outcome is more likely than the market says it is. If instead you think the chances are higher, then you do the opposite and buy. Either way, if you use this logic to make your trades and _your probability is more accurate than the implied probability_, you can expect to profit.

This assumption is quite a big one though. The whole point of an implied probability is that it reflects what a lot of people with a lot of information have collectively settled on. If you think the market is mispriced, you are effectively saying that your information is _better_ in some way. When this assumption is true, the improvement in information is called **_edge_**. Finding, verifying, and exploiting it is basically the entire game.

---

[^2]: There are a few nuances to this process that we skip here. Some light reading: bid-ask spreads, trading fees, confidence intervals, {% include post-preview-link.html path="blogs/game-theory/expected-utility.md" text="expected utility" %}.

[^1]: Frankly, I think these odds are way too inflated. As a Duke fan, I have experienced too much heartbreak to get my hopes up again. Obviously, this is not financial advice.

[^3]: This does require a few assumptions. Essentially, it's the profit we'd expect if we bought this contract once in a bunch of different universes. In some of the universes, Duke wins. In other universes, Duke loses. The probability $$p\%$$ we set here represents the _percentage of those universes_ where Duke wins. Some resources: [Law of Large Numbers](https://www.reddit.com/r/explainlikeimfive/comments/177rxp4/eli5_whats_the_law_of_large_numbers/) and [IID](https://towardsdatascience.com/independent-and-identically-distributed-ce250ad1bfa8/).

[^4]: This does not mean it _will_ be $250, because it must be either $100 or $300. A simple way to interpret this is that 75% of traders think it will definitely be $300 tomorrow, while the other 25% think it will definitely be $100 tomorrow. Technically this is not true -- traders carry a mix of uncertainties, but _on average_ it works out.

[^5]: This is probably the simplest we can make implied probability. It starts to get complicated quickly -- imagine trying to find the probabilities of 100 different prices that `AAPL` could be tomorrow. Or 1000 different prices. Or any non-negative real number. You will end up with [implied _distributions_](https://quant.stackexchange.com/questions/31479/what-the-implied-distribution-really-is).

[^6]: Technically, this tells you what the market's _prices_ say, which -- in practice -- isn't the same as what the market _believes_. Traders have motivations aside from speculation (e.g., hedging risk) that don't give any probabilistic information.
