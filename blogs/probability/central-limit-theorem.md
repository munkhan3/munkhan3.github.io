---
title: "Why the Central Limit Theorem Actually Works"
date: 2026-07-05
tags: [statistics, foundations]
---

Let $X_1, X_2, \dots, X_n$ be i.i.d. random variables with mean $\mu$ and finite variance $\sigma^2$. Define the sample mean:

$$
\bar{X}_n = \frac{1}{n} \sum_{i=1}^{n} X_i
$$

The Central Limit Theorem says that as $n \to \infty$, the standardized sample mean converges in distribution to a standard normal:

$$
\sqrt{n} \left( \frac{\bar{X}_n - \mu}{\sigma} \right) \xrightarrow{d} \mathcal{N}(0, 1)
$$

What makes this remarkable is that it holds regardless of the distribution of the individual $X_i$ — they don't need to be normal themselves, just i.i.d. with finite variance. This is why averages of almost anything (measurement error, sums of independent bets, aggregated noise) tend to look approximately Gaussian in practice, and it's the theoretical backbone behind why $t$-tests and confidence intervals work even when the underlying data isn't normally distributed.

A quick sanity check: for $n$ i.i.d. $\text{Uniform}(0,1)$ variables, $\mu = \tfrac{1}{2}$ and $\sigma^2 = \tfrac{1}{12}$, so $\sqrt{n}(\bar{X}_n - 0.5)$ should look increasingly normal with variance $\tfrac{1}{12}$ as $n$ grows — even though a single $\text{Uniform}(0,1)$ draw isn't remotely bell-shaped.