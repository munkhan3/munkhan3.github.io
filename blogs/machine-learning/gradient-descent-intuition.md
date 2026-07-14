---
title: "Gradient Descent, Intuitively"
date: 2026-07-10
tags: [optimization, neural-networks]
---

Gradient descent updates parameters by stepping opposite the gradient of a loss function $J(\theta)$:

$$
\theta_{t+1} = \theta_t - \eta \nabla_\theta J(\theta_t)
$$

Here $\eta$ is the learning rate, and $\nabla_\theta J(\theta_t)$ is the gradient evaluated at the current parameters. Intuitively, the gradient points in the direction of steepest *increase*, so subtracting it moves us downhill.

For a simple quadratic loss $J(\theta) = \frac{1}{2}(\theta - a)^2$, the gradient is just $\theta - a$, so the update becomes:

$$
\theta_{t+1} = \theta_t - \eta(\theta_t - a) = (1 - \eta)\theta_t + \eta a
$$

which converges to $a$ as long as $0 < \eta < 2$. A minimal implementation:

```python
def gradient_descent(grad_fn, theta0, lr=0.1, steps=100):
    theta = theta0
    for _ in range(steps):
        theta -= lr * grad_fn(theta)
    return theta
```

The step size $\eta$ controls the tradeoff between convergence speed and stability — too large and $\theta_t$ can oscillate or diverge; too small and convergence is slow.