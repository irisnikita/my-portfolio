---
title: Zalo Mini App — Phúc Long
summary: Zalo Mini App for Phúc Long Heritage enabling online ordering, loyalty program, and in-app payments for tea and coffee lovers.
date: 2024-08-01
tags:
  - Zalo Mini App
  - React
  - NestJS
  - Performance
---

## Overview

Built the Zalo Mini App for Phúc Long Heritage — a beloved Vietnamese tea and coffee brand. The app supports full online ordering flow, loyalty punch cards, voucher management, and seamless in-app payments.

## My Role

**Full-stack Developer** — Owned the entire ordering flow, payment integration, and loyalty system. Team of 3 (1 FE/BE, 1 designer, 1 PM), delivered in 3 months.

## Problem

Phúc Long wanted to reduce queue times and increase order frequency. They needed a lightweight ordering channel that leveraged Zalo's massive user base without the friction of a standalone app.

## Architecture

| Layer    | Tech             | Purpose                          |
| -------- | ---------------- | -------------------------------- |
| UI       | React + Zalo SDK | Menu, cart, checkout, loyalty    |
| Back-end | NestJS + TypeORM | Order management, voucher engine |
| Payments | ZaloPay API      | In-app payment processing        |
| Cache    | Redis            | Session, cart persistence        |

## Approach

- Full ordering flow: menu browsing → cart → payment → order tracking
- Loyalty punch card system with digital stamp collection
- Voucher engine with auto-apply logic and stacking rules
- NestJS backend with payment gateway integration (ZaloPay)
- Optimized bundle size for fast load within Zalo Mini App constraints
- Error handling with retry logic for payment edge cases

## Key Metrics

| Metric                | Result                         |
| --------------------- | ------------------------------ |
| App load time         | < 2s on mid-range devices      |
| Order completion rate | 85%+ (above industry avg)      |
| Payment success rate  | 98.5% (with retry logic)       |
| Daily active users    | Thousands of orders daily      |
| Bundle size           | Optimized for Zalo constraints |

## Result

- Streamlined ordering reducing average queue wait time
- Digital loyalty program increasing repeat purchase rate
- Smooth payment integration with ZaloPay
- App load time under 2 seconds on mid-range devices

## Learnings

Payment integration within Zalo requires careful error handling and retry logic. Edge cases around payment timeouts and partial failures were the most challenging part of the project. Building a robust voucher stacking engine required extensive test coverage.
