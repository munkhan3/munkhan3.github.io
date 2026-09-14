---
title: "The Theory of Measuring"
date: 2026-01-03
tags: [probability, measure theory, introduction]
description: "If you like math and have ever been uncertain about anything, you will probably enjoy this."
keywords: [measure, theory, probability, sigma, algebra, outcome, theory]
draft: false
published: true
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

It's important to note that $$\mathbb{P}$$ is defined on _all_ of $$\mathcal{F}$$. This implies that every (well-posed) question about our random process has an answer. However, whether any particular observer _knows enough to answer_ depends on the information they have. **Sub-$$\boldsymbol \sigma$$-algebras** allow us to formalize that gap between _truth_ and _knowledge_.

Consider any arbitrary $$\sigma$$-algebra $$\mathcal{G}$$ on the outcome space $$\Omega$$. We call $$\mathcal{G}$$ a sub-$$\sigma$$-algebra of $$\mathcal{F}$$ if $$\mathcal{G} \subseteq \mathcal{F}$$. How can we use this to encode the information held by a particular observer?

> Recall our example from earlier, where we're interested in two flips of a fair coin. Suppose the coins have already been flipped, and you've been allowed to look at one of them.[^3] I have seen neither. We have different information, and thus should have different sub-$$\sigma$$-algebras.

To build an intuition for these objects, it will help to manually construct them. We can do this by thinking about how information induces **_partitions_** the outcome space. In my case, I can't make any statements about where in $$\Omega$$ the true outcome lies because I haven't seen any of the flips -- all I know is that the outcome is somewhere in $$\Omega$$. In other words, I can't partition $$\Omega$$ at all. Formally, we can write this as the trivial partition...

$$
\require{mathtools}
\mathcal{P}_{1} \coloneqq \{\{HH, HT, TH, TT\}\} = \{\Omega\}
$$

On the other hand, since you know the value of the first flip, you can identify whether the true outcome is in $$\{HH, HT\}$$ or $$\{TH, TT\}$$. Thus, the partition induced by your information is...

$$
\require{mathtools}
\mathcal{P}_{2} \coloneqq \{\{HH, HT\}, \{TH, TT\}\}
$$

In game theory, we call $$\mathcal{P}_{k}$$ the **_information structure_** of the $$k$$-th agent. Formally, the **_information set_** of the $$k$$-th agent is the particular subset of $$\mathcal{P}_{k}$$ that the $$k$$-th agent can identify as containing the realized outcome based on their information. In this example, if you saw that the first coin was $$H$$, your information set would be $$\{HH, HT\}$$. If you saw that the first coin was $$T$$, your information set would be $$\{TT, TH\}$$. Unfortunately, since I saw no coins, my information set would be $$\{HH, HT, TT, TH\}$$.

Constructing the sub-$$\sigma$$-algebras $$\mathcal{G}_{k}$$ from here is quite easy. The process here is a bit informal, but the idea is that $$\mathcal{G}_{k}$$ is all possible unions of the sets in the information structure $$\mathcal{P}_{k}$$ _and_ the empty set. So we have...

$$
\require{mathtools}
\begin{align*}
\mathcal{G}_{1} &\coloneqq \{\varnothing, \Omega\} \\

\mathcal{G}_{2} &\coloneqq \{\varnothing, \{HH, HT\}, \{TH, TT\}, \Omega\}
\end{align*}
$$

The idea is that **information structures tell us (in some sense), how _blurry_ the outcome space looks to each agent. The corresponding sub-$$\boldsymbol \sigma$$-algebra contains all of the events we can construct from those distinctions** and therefore all of the questions we can definitively answer given our information.

<h3>Some Thoughts on Time Travel</h3>

So far, we have talked about how we can use probability spaces and sub-$$\sigma$$-algebras to show how information varies across agents. Another important concept that this formalization allows us to develop is the idea of _**information evolving over time for just one observer**_.

In our previous example, you and I are separate observers with different information. In particular, your information _supersets_ my information...

$$
\mathcal{G}_{1} \subset \mathcal{G}_{2}
$$

Given this structure, we can instead imagine _one_ observer viewing two flips of a fair coin that proceed sequentially. At first, the observer sees no flips and has sub-$$\sigma$$-algebra $$\mathcal{G}_{1}$$. Once the first coin is flipped, the observer has sub-$$\sigma$$-algebra $$\mathcal{G}_{2}$$. Once the second coin is flipped, the observer can partition the outcome space on every individual outcome so we have $$\mathcal{G}_3 = \mathcal{F}$$. Notice that this is an sequence of $$\sigma$$-algebras _indexed by time_...

$$
\require{mathtools}
\{\mathcal{G}_t\}_{t=1}^3 \coloneqq \{\mathcal{G}_1, \mathcal{G}_2, \mathcal{G}_3\} \quad \textrm{with} \quad \mathcal{G}_{1} \subset \mathcal{G}_{2} \subset \mathcal{G}_3 = \mathcal{F}
$$

We call any non-decreasing sequence of $$\sigma$$-algebras _indexed by time_ a **_filtration_**. Over time, our ability to distinguish between the possible outcomes should become more precise as we gather more information.[^4] As a result, our sub-$$\sigma$$-algebra should get larger. This concept is quite important in fields like quantitative trading, where an observer must dynamically update their predictions / valuations as quickly as possible as new information is received.

---

[^1]: Unfortunately, the power set $$2^\Omega$$ is not always a valid $$\sigma$$-algebra for the measurable space of a random process. This is particularly an issue when we get to dealing with continuous outcome spaces, where it becomes impossible to assign probabilities to events without contradictions. The solution to this involves something called a **_Borel $$\boldsymbol \sigma$$-algebra_**.

[^2]: A collection of pairwise disjoint events is just any set of events such that the events do not share any elements. Formally, we write $$\{A_k\}$$ such that $$A_i \cap A_j = \varnothing$$ for all $$i \neq j$$.

[^3]: There's technically a [very sneaky issue](https://en.wikipedia.org/wiki/Boy_or_girl_paradox) with this phrasing. To avoid this issue here, we'll assume that the coins were flipped in sequence and I looked at the first coin.

[^4]: I use the word "should" because we assume no misinformation here. It's not necessarily the case in reality that everything we colloquially refer to as "information" is quality signal as opposed to noise.
