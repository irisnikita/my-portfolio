---
title: Personal Portfolio
summary: This very portfolio — a performance-first Astro site with cinematic neon design, careful motion system, and static-first architecture.
date: 2026-02-26
tags:
  - Astro
  - Tailwind CSS
  - Performance
  - Motion Design
githubUrl: https://github.com/irisnikita/my-portfolio
---

## Overview

My developer portfolio built with Astro and Tailwind CSS v4. Features a cinematic dark neon design system, transform-only animations, and full SEO optimization with JSON-LD structured data.

## Problem

Needed a portfolio that showcases technical skill through the site itself — not just the content. Most developer portfolios feel generic or over-engineered.

## Approach

- Astro for static-first, zero-JS-by-default architecture
- Custom CSS design system with neon tokens (cyan, magenta, violet)
- Transform/opacity-only motion with `prefers-reduced-motion` support
- Full SEO: JSON-LD (Person + WebSite), OG tags, sitemap, canonical URLs
- Content Collections for type-safe project case studies
- View transitions scoped to project pages only

## Result

- Lighthouse 100 across all categories
- Smooth parallax hero without layout shift
- Accessible: skip-link, focus-visible parity, semantic HTML
- Static build deploys to Vercel in under 10 seconds

## Learnings

Constraint breeds creativity. The "transform-only motion" rule forced elegant solutions instead of heavy animation libraries.
