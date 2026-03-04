---
title: Zalo Mini App — PNJ
summary: Zalo Mini App for PNJ (Vietnam's leading jewelry retailer) with product catalog, store locator, and membership rewards integration.
date: 2024-05-01
tags:
  - Zalo Mini App
  - React
  - Next.js
  - CDP
---

## Overview

Developed the Zalo Mini App for PNJ — Vietnam's largest jewelry retail chain. The app provides a premium product browsing experience, store appointment booking, and membership tier rewards — all accessible within Zalo.

## My Role

**Full-stack Developer** — Led front-end development with a focus on premium UI/UX matching PNJ's luxury brand. Team of 4 (2 FE, 1 BE, 1 PM), delivered in 4 months.

## Problem

PNJ's customer base is primarily mobile-first but reluctant to install multiple apps. They needed a native-feeling experience within Zalo that matched the premium brand positioning of a luxury jewelry retailer.

## Architecture

| Layer     | Tech             | Purpose                              |
| --------- | ---------------- | ------------------------------------ |
| UI        | React + Zalo SDK | Product catalog, booking, membership |
| Rendering | Next.js (SSR)    | SEO-friendly product pages           |
| Back-end  | NestJS           | Catalog API, booking system          |
| CDP       | Antsomi CDP      | Personalized recommendations         |
| Hosting   | Vercel + AWS     | Edge deployment                      |

## Approach

- Premium UI with smooth animations matching PNJ brand guidelines
- Product catalog with high-resolution image lazy loading and search
- Store locator with appointment booking and real-time availability
- CDP integration for personalized product recommendations based on purchase history
- Membership tier system with point accumulation and exclusive offers
- Progressive image loading + skeleton screens for perceived performance

## Key Metrics

| Metric                 | Result                        |
| ---------------------- | ----------------------------- |
| Lighthouse performance | 90+ consistently              |
| Potential reach        | 70M+ Zalo users               |
| Store foot traffic     | Increased via in-app bookings |
| Image load strategy    | Progressive + lazy loading    |
| Membership engagement  | Real-time point tracking      |

## Result

- Premium shopping experience accessible to 70M+ Zalo users
- Increased store foot traffic through Mini App appointment bookings
- Membership engagement improved with real-time point tracking
- Consistent 90+ Lighthouse scores despite rich media content

## Learnings

Balancing premium visual quality with strict performance budgets required creative solutions — progressive image loading and skeleton screens made a significant difference. CDP integration for personalized recommendations proved to be a major engagement driver.
