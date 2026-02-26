---
title: Neon Landing (MVP)
summary: A performance-first landing with cinematic neon grid parallax and crisp CTAs.
date: 2026-02-26
tags:
  - Astro
  - Motion rules
  - Performance
liveUrl: https://example.com
githubUrl: https://github.com/example/repo
---

## Problem

I needed a hero that *feels cinematic* without sacrificing mobile smoothness.

## Approach

- SVG/CSS neon grid (2 layers)
- Transform-only parallax + rAF throttle
- Respect `prefers-reduced-motion`

## Result

Smooth interactions across 360 → 1440, with no layout shift and clear CTA hierarchy.
