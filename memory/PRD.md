# SplitFinder — PRD

## Overview
SplitFinder is a mobile-first real estate app that helps Australian investors identify properties suitable for two-lot subdivision. The app focuses on three core flows: discovering subdivision-ready listings on an interactive map, validating frontage requirements per property, and modelling gross profit feasibility for a two-lot split.

## Platforms
- React Native (Expo SDK 54), iOS / Android / Web (via Expo Go and web preview)
- No backend persistence — all state is local (AsyncStorage / SecureStore via `@/src/utils/storage`)

## Navigation
Bottom tab bar with three tabs:
1. **Map Search** (`app/(tabs)/index.tsx`)
2. **Saved** (`app/(tabs)/saved.tsx`)
3. **Feasibility** (`app/(tabs)/feasibility.tsx`)

## Features

### 1. Map Search
- Interactive Leaflet/OpenStreetMap map rendered via `react-native-webview` (native) and an iframe (web), so it works in Expo Go + web preview without API keys.
- Filter chips:
  - **Suburb** — list of distinct suburbs from seeded data (or "All Suburbs")
  - **Price Cap** — defaults to $700,000
  - **Minimum Land Size** — defaults to 600 m²
- 12 pre-seeded sample properties across Sydney, Melbourne, Brisbane, Perth, Adelaide.
- Tapping a price pin opens the **Property Details** bottom-sheet modal.

### 2. Property Details Modal
- Hero image, suburb tag, address, price, key stats (beds, baths, land size, frontage).
- **Frontage Calculator widget** (embedded):
  - Input: street frontage (m), prefilled with the property's frontage.
  - Rule: subdivision into 2 lots requires ≥ 10 m per lot → ≥ 20 m total.
  - Live Pass (green) / Fail (red) pill with delta.
- **Save Property** button (persists to local storage; toggles to green "Saved" state).

### 3. Saved Properties
- FlatList of saved properties (thumbnail, suburb, address, price, land, frontage).
- Per-item unsave (`×`) action.
- Tap a card to re-open the property details modal.
- Empty state with guidance.

### 4. Feasibility Calculator
- Inputs (all currency, number pad):
  - Purchase Price
  - Stamp Duty
  - Civil Works (baseline $80,000 pre-filled)
  - Sale Price per Lot
- Live output card (large hero metric):
  - **Gross Profit = (Sale Price per Lot × 2) − Purchase Price − Stamp Duty − Civil Works**
  - Revenue, Costs, Margin %
  - Card turns dark-red on loss
- Reset button restores defaults.

## Smart business enhancement
A future revenue/conversion lever: surface a "Run Feasibility" CTA inside the Property Details modal that pre-populates the Feasibility tab with the property's price and a regional default Sale Price per Lot — converting a passive map browse into a high-intent feasibility evaluation.
