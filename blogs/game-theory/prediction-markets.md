---
title: "So...Kalshi Is Lying To Us"
date: 2026-08-16
tags: [game-theory, mechanism-design, prediction-markets]
description: "Why Kalshi's displayed probabilities aren't the same as an oddsmaker's payout, and what that means for how you should read prediction market prices."
---

<strong>Introduction</strong>

If you recently watched _The Odyssey_ and have strong opinions on how good the movie was, you can go to [Kalshi](https://kalshi.com/markets/kxoscarpic/oscar-for-best-picture) and speculate on those opinions. Right now, Kalshi says the probability that _The Odyssey_ wins ‘Best Picture’ at the Oscars is ~60%. Based on that information, you can make an informed decision by following some straightforward logic:

1. If you thought the movie was incredible and will easily win (i.e., more than 60% chance), you might buy a `YES` contract.
2. If you thought the movie was a let down and are quite confident that it will not win (i.e., less than 60% chance), you might buy a `NO` contract.<sup>1</sup>
3. If you don't have strong opinions either way (i.e., you agree there's around a 60% chance), it doesn't make too much sense to put your money on the line.<sup>2</sup>

Before you make this incredibly consequential decision though, you should probably be aware of the fact that **_Kalshi isn't an oddsmaker_** -- they are not the ones that are paying you out if you win.

---

[1] Frankly, I think these odds are way too inflated. I have high hopes for _Dune: Part Three_. Obviously, this is not financial advice.

[2] There are a few nuances to this process that we skip here. Some light reading: bid-ask spreads, uncertainty and confidence intervals, {% include post-preview-link.html path="blogs/game-theory/expected-utility.md" text="expected utility" %}
