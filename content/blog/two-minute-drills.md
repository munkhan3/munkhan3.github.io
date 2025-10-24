---
title: "Measuring the Hidden Value of Two-Minute Drills"
date: 2024-06-18
summary: "Quantifying how teams capitalize on late-half possessions with a custom leverage model."
tags:
  - Analytics
  - Sports
  - Experimentation
readingTime: "8 min read"
deck: "Inside the live leverage model that helps coaching staffs squeeze extra possessions out of the final 120 seconds."
---
## Why Two-Minute Drills Matter
Two-minute situations swing an entire win probability chart faster than almost any other sequence. By pairing drive level win probability deltas with timeout inventory, we identify when an offense should lean into the sideline, press tempo, or force the defense to burn clock.

- We bucket possessions by clock, score state, and remaining timeouts for both teams.
- Each play is graded against historical leverage to highlight when play callers leave free win probability on the field.
- Staffs receive a weekly scout packet summarizing opponent tendencies in the final two minutes of each half.

## Model Architecture
The engine blends logistic regression with gradient boosted calibration layers to keep predictions stable in outlier situations. We train the core model on *nflverse* play-by-play data, then feed situational priors derived from coaching self-scout sessions.

<figure>
<strong>Drive state outputs</strong>
<p>The model emits a probability vector for burn, tempo, and strike calls given the next snap context. Assistants receive this matrix on tablets between plays.</p>
<figcaption>Example drive state transitions used during our sideline huddles.</figcaption>
</figure>

### Calibration windows
Win probability is recalibrated every Tuesday using the latest league data so crews always have the freshest baselines entering the weekend.

## Sideline Operations
Analytics only helps if it survives the chaos of the sideline. We built a simple sideline dashboard that surfaces actionable prompts, not just numbers.

1. Color-coded prompts for play caller, situational assistant, and game management lead.
2. Automatic reminders to force defensive timeouts when leverage crosses our stop-loss threshold.
3. Post-game review clips stitched to model inflection points for film breakdown.

## Game Day Checklist
- Confirm timeout burn rules with coaching staff Saturday night.
- Preload opponent blitz and prevent tendencies into the dashboard queue.
- Assign an analyst to track sideline prompts to ensure nothing slips through the headset.
