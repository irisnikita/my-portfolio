---
title: Zalo Mini App — Highlands Coffee
summary: A Zalo Mini App for Highlands Coffee enabling mobile ordering, loyalty rewards, and store locator for millions of Vietnamese users.
date: 2024-01-15
tags:
  - Zalo Mini App
  - React
  - NestJS
  - TypeScript
---

## Overview

Built the Zalo Mini App for Highlands Coffee — one of Vietnam's largest coffee chains. The app lets users browse the menu, place orders, collect loyalty points, and find nearby stores — all within the Zalo ecosystem.

## Problem

Highlands needed a mobile-first ordering experience without requiring users to download a separate app. The Zalo platform provided reach (70M+ users) but came with strict performance and size constraints.

## Approach

- Developed with React + TypeScript, optimized for Zalo Mini App runtime
- Integrated CDP for personalized menu recommendations and targeted promotions
- Built NestJS backend handling order processing, payment, and loyalty point calculation
- Implemented store locator with geolocation and real-time availability
- Performance budget: < 2s initial load, < 100ms interaction response

## Result

- Smooth ordering experience within Zalo — no separate app download needed
- Loyalty program driving repeat purchases
- Lighthouse performance score consistently above 90
- Served millions of users across Vietnam

## Learnings

Zalo Mini App has unique constraints (bundle size, API limitations). Early prototyping within the platform saved weeks of rework later.
