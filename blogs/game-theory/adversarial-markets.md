---
title: "We're All Missing Something"
date: 2026-05-24
tags: [game-theory, prediction-markets]
description: "Are you confident that you know more than your opponent?"
---

We have {% include post-preview-link.html path="blogs/game-theory/prediction-markets.md" text="talked previously" %} about how prediction markets are closer to stock markets than betting markets. You name a price, Kalshi checks its book, and either you take someone's offer or yours gets added there until somebody else takes it. Either way, since you're not taking up positions against Kalshi, it's technically not gambling -- in the legal sense of the word.[^1]

If you’re a bit more thorough though, you should stop to think about _who is on the other side of your trade_. You might imagine that someone who's jumping at the chance to take your bet could know something that you don't. Consider the following toy example:

> Suppose I pull a coin out of my pocket and propose a game. I tell you that I'll give you <span>$</span>1,000 if it lands H, but you'll have to give me <span>$</span>100 if it lands T. You are free to play as many times as you would like. Would you play?
>
> At first, it seems like an incredible deal -- I'm giving you 10-to-1 odds on a coin flip _and_ allowing you to play repeatedly. If I had a track record for being a degenerate gambler looking for an adrenaline rush, you might not think twice. But knowing me to be a rational person, you might start to get suspicious: Why would he make an offer like that? Does he have an ulterior motive? **_Is there something I'm missing?_**
>
> If you continue along this line of questioning, you will remember that _I brought the coin myself_ and will realize that the coin is likely to be biased. You will then tell me you don't like to gamble and walk away (to my disappointment).[^2]

What I'm trying to get at here is that the fact the offer exists in the first place should make you question your opinion. The strength of that signal depends on the _information_ you believe the other side has -- specifically, whether it's better or worse than what you have.

---

[^1]: This is more or less the argument Kalshi has made to regulators. The efficacy of that argument remains to be seen.

[^2]: Although it depends on your risk tolerance, the mathematically optimal decision here is to agree to a few rounds of the game and update your initial guess of the odds based on what you observe. See _Bayesian Inference_.
