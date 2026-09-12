---
title: "The Theory of Measuring"
date: 2026-01-03
tags: [probability, measure theory, introduction]
description: "If you like math and have ever been uncertain about anything, you will probably enjoy this."
keywords: [measure, theory, probability, sigma, algebra, outcome, theory]
draft: true
---

It's useful to think about any situation that carries uncertainty as a **_probability space_**. It is even more useful -- for our purposes -- to think about probability spaces as models built on top of a **_measurable space_**. By that, I mean that there exists some objective mathematical description of everything that a random process _could_ do. **Crucially, any individual observer may not have the complete picture.** Different observers might see different parts of this picture, and thus may have different interpretations of the same process.

Let's formalize this notion.

<h3>Trust Me, This Will Be Helpful</h3>

Mathematically, a measurable space is a collection of two components: the **_outcome space_** $$\Omega$$ and the **_event space_** $$\mathcal{F}$$. These are pretty intuitive concepts, and we can develop them one-by-one using a simple example.

> Suppose you have a fair coin and you plan to flip it twice. You are interested in the sequence of the flips. Clearly, this is a random process and has uncertainty, so we can think about constructing a measurable space to represent it.

As the name suggests, an outcome space $$\Omega$$ is just the set of all possible outcomes or realizations of a particular random process. In the case of our example, the outcome space is each possible sequence of two flips:

$$
\require{mathtools}
\Omega \coloneqq \{HH, HT, TH, TT\}
$$

Similarly, the event space $$\mathcal{F}$$ is the set of all possible _events_ that could occur. These are not just individual outcomes like $$HH$$ or $$TT$$, but also _seeing at least one_ $$H$$ or _seeing_ $$\ T$$ on the second flip. You can encode these events as sets of outcomes. For example, _seeing at least one_ $$H$$ is the set of outcomes $$\{HH, HT, TH\}$$. Generalizing, our event space $$\mathcal{F}$$ becomes the collection of every possible set of outcomes, including the empty set $$\varnothing$$ and the full outcome set $$\Omega$$:

$$
\require{mathtools}
\mathcal{F} \coloneqq  \{\varnothing, \{HH\}, \dots, \{HH, HT\}, \dots, \{HH, HT, TH\}, \dots, \Omega\} = 2^\Omega
$$

For this space to be measurable, we require the event space to be a **$$\boldsymbol \sigma$$-algebra**. A $$\sigma$$-algebra is a general mathematical object that satisfies three fundamental axioms:

1. **Inclusion of Certainty and Impossibility:** $$\mathcal{F}$$ must contain both $$\varnothing$$ and $$\Omega$$
2. **Closure Under Complements:** If $$A$$ is an event in $$\mathcal{F}$$, then $$A^C$$ (the event _not_ $$A$$) must also be in $$\mathcal{F}$$
3. **Closure Under Countable Unions:** If $$\{A_k\}_{k=1}^{\infty}$$ is a countable collection of events in $$\mathcal{F}$$, then $$\bigcup_{k=1}^{\infty} A_k$$ must also be in $$\mathcal{F}$$

We note that -- in this particular discrete case -- the power set $$2^\Omega$$ satisfies these axioms.[^1] We can then assign a probability to each of the events / items in $$\mathcal{F}$$. This assignment is called a **_probability measure_** $$\mathbb{P}$$, and we can write it formally in function notation as...

$$
\mathbb{P} : \mathcal{F} \mapsto \left[0,1\right]
$$

A probability measure also must satisfy certain axioms, namely...

1. **Non-Negativity:** For any event $$A \in \mathcal{F}$$, $$\mathbb{P}(A) \geq 0$$
2. **Normalization:** An outcome in the outcome space $$\Omega$$ must occur, so $$\mathbb{P}(\Omega) = 1$$
3. **Countable Additivity:** For any countable collection of pairwise disjoint events $$\{A_k\}$$,[^2] $$\mathbb{P}(\bigcup_{k=1}^\infty A_k) = \sum_{k=1}^\infty \mathbb{P}(A_k)$$

To illustrate, suppose the event $$A \in \mathcal{F}$$ is the event that the second flip is $$H$$. The probability measure allows us to ask and answer the question: _how likely is it that the second flip is heads?_

$$
\mathbb{P}(A) = \mathbb{P}(\{HH, TH\}) = \tfrac{1}{2}
$$

When we add this third component to the measurable space $$(\Omega, \mathcal{F})$$ we end up with a **probability space** $$(\Omega, \mathcal{F}, \mathbb{P})$$.

<h3>A Whole Bunch of Greek</h3>
It's important to note that $$\mathbb{P}$$ is defined on _all_ of $$\mathcal{F}$$. This implies that every (well-posed) question about our random process has an answer. However, whether any particular observer *knows enough to answer* depends on the information they have. ***Sub-$$\boldsymbol \sigma$$-algebras*** allow us to formalize that gap between _truth_ and _knowledge_.

Consider any arbitrary $$\sigma$$-algebra $$\mathcal{G}$$ on the outcome space $$\Omega$$. We call $$\mathcal{G}$$ a sub-$$\sigma$$-algebra of $$\mathcal{F}$$ if $$\mathcal{G} \subseteq \mathcal{F}$$. How can we use this to encode the information held by a particular observer?

> Recall our example from earlier, where we're interested in two flips of a fair coin. Suppose I have already flipped the coins and looked at one of them. You have seen neither. We have different information, and thus should have different sub-$$\sigma$$-algebras.

In the context of information, we can interpret sub-$$\sigma$$-algebras as sets of information that we can distinguish. Let's call my sub-$$\sigma$$-algebra $$\mathcal{G}^{(1)}$$ and your sub-$$\sigma$$-algebra $$\mathcal{G}^{(2)}$$.

<h3>Back to Probability</h3>
This is the toolkit that allows us to quantify uncertainty of any situation. In general, the procedure that we follow involves listing out all of the outcomes $$\Omega$$, constructing an event space $$\mathcal{F}$$, and then using $$\mathbb{P}$$ to identify the probability of any event of interest.

<h3>PLACEHOLDER</h3>

---

[^1]: Unfortunately, the power set $$2^\Omega$$ is not always a valid $$\sigma$$-algebra for the measurable space of a random process. This is particularly an issue when we get to dealing with continuous outcome spaces, where it becomes impossible to assign probabilities to events without contradictions. The solution to this involves something called a **_Borel $$\boldsymbol \sigma$$-algebra_**. Don't worry, we'll discuss this soon.

[^2]: A collection of pairwise disjoint events is just any set of events such that the events do not share any elements. Formally, we write $$\{A_k\}$$ such that $$A_i \cap A_j = \varnothing$$ for all $$i \neq j$$.
