---
title: "You Are What You Know"
date: 2026-03-25
tags: [game theory, financial markets, asymmetric information]
description: "Information is currency."
keywords:
  [
    information,
    filtrations,
    kl divergence,
    edge,
    signal,
    noise,
    SNR,
    signal-to-noise ratio,
    ratio,
  ]
draft: true
published: true
---

When we {% include post-preview-link.html path="blogs/probability/how-to-put-your-money-where-your-mouth-is.md" text="last talked" %}, we briefly discussed the topic of **edge**. In case you decided not to read that post for whatever reason, here's the relevant part:

> If you think the market is mispriced, you are effectively saying that your information is better in some way. When this assumption is true, the _improvement in information is called_ **_edge_**. Finding, verifying, and exploiting it is basically the entire game.

When we actually want to play this game, it helps to be a little more precise. What exactly does it mean to have _better information_ than the market? Well, as a first step, we should probably define exactly what we mean by _information_. It helps to have some formal knowledge of probability theory here, but not completely necessary so bear with me as we take a detour to discuss some introductory measure theory.

<h3>Back to Easier Things</h3>

Let's start off by defining the information that each trader has at some time $$t$$ as a set of propositions[^2].

---

[^1]: Situations that don't carry uncertainty can also be modeled as probability spaces. Notice that any random situation eventually becomes a "completely certain" probability space once it is realized.

[^2]: Before my readers that are well-versed in game theory yell at me for conflating $$\sigma$$-algebras and information sets, I should note that we're looking at the decision of whether or not to trade _in isolation_. That is, we assume two things: the market doesn't react to our trade (i.e., we get to trade at the posted price), and we have no adversaries. Together, these assumptions allow us to treat the market as exogenous input, where the probabilities are fixed and given as opposed to being chosen by an opponent responding to us. These are strong assumptions worth exploring, but for now we use the simplification to remove the strategic layer and reduce our conceptualization of information to just be the $$\sigma$$-algebra.

[^3]: Propositions are just logical statements that are either true or false. You can imagine any "piece of information" you might come across can be decomposed as a bunch of propositions. For example, the information "it's raining and cold" can be decomposed into a set of two propositions: "it's raining" and "it's cold"
