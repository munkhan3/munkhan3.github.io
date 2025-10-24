---
title: "Building Live Win Probability Graphics for Broadcast"
date: 2023-12-05
summary: "Behind the scenes on translating a win probability engine into studio-ready visuals and commentator talking points."
tags:
  - Analytics
  - Sports
  - Media
readingTime: "9 min read"
deck: "Making real-time analytics broadcast-friendly without losing analytical rigor."
---
## Graphics Pipeline
We render win probability in under 500ms by chaining a lightweight API with a viz layer powered by WebGL. The graphics team receives a JSON payload containing current win probability, change over the last snap, and contextual copy suggestions.

### Latency budget
Anything over half a second feels laggy to producers. Caching and pre-fetching common scenarios keep the pipeline snappy.

## Handling Edge Cases
Broadcasts hate surprises. We flag weird scenarios—botched laterals, multiple penalties, double timeouts—and freeze the graphic until an analyst confirms the data. A manual override ensures on-air talent never cites a bogus number.

## Commentary Integration
We work with talent every Thursday to script story starters tied to expected spikes. When the model flags a swing, a pre-written nugget appears in the prompter so commentary sounds prepared, not robotic.

## Studio Rundown
- Rehearse the biggest leverage swings with talent before going live.
- Pair every number with a human story—matchups, coaching history, or situational tendencies.
- Always show the delta, not just the absolute win probability. Movement tells the story.
