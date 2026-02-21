# ChronoSync

ChronoSync is a React + TypeScript web application for comparing time across regions. It provides a **primary interactive clock** for editing date/time in a chosen IANA time zone, and a **secondary clocks board** for tracking multiple regions side-by-side.

---

## Project Overview

### Purpose
- Help users coordinate schedules across global time zones.
- Keep a single source of truth (UTC) while presenting localized views.
- Support quick visual comparison via analog clocks and readable date/time summaries.

### Core Capabilities
- Select a primary time zone from searchable IANA options with country context.
- Change primary date and time using:
  - analog clock hand dragging,
  - AM/PM toggle,
  - date picker.
- Add/remove secondary clocks tied to the same UTC instant.
- Reorder secondary clocks with drag-and-drop.
- Persist theme and secondary clock selection in local storage.
- Handle daylight saving edge cases (invalid/ambiguous local times) with user-facing warnings.

---

## High-Level Architecture

### Application Structure
- `src/App.tsx`
  - Owns global UI state and orchestrates app behavior.
  - Coordinates primary and secondary panel interactions.
- `src/components/primary-clock-panel.tsx`
  - Primary zone controls, interactive clock, DST warning display.
- `src/components/secondary-clocks-panel.tsx`
  - Secondary cards list, add dialog, clear-all, drag-and-drop ordering.
- `src/lib/time-utils.ts`
  - Time zone option generation, UTC/local conversion, DST guardrails.
- `src/components/ui/*`
  - Reusable UI primitives (button, dialog, popover, command list, etc.).

### Data Flow (High Level)
1. App stores a canonical `primaryDateTimeUtc` (`Luxon DateTime` in UTC).
2. Primary panel emits local date/time edits for the selected primary zone.
3. `buildUtcFromLocalParts(...)` converts local parts back to UTC, returning warnings when DST rules cause adjustment/ambiguity.
4. Secondary panel renders each configured zone from the same UTC instant.
5. Persisted preferences (theme + secondary zones) are read on load and updated on state changes.

### State Model
- **Theme state**: `light | dark`, synced to `<html class="dark">` and local storage.
- **Primary state**:
  - `primaryTimeZone`
  - `primaryDateTimeUtc`
  - `warning` (DST/invalid local time messaging)
- **Secondary state**:
  - ordered `secondaryTimeZones[]`
  - add/remove/reorder handlers

---

## Technical Details

### Stack
- React 19 + TypeScript 5
- Vite 7 build/dev tooling
- Tailwind CSS 4 (`@tailwindcss/vite`) for styling
- shadcn-style UI primitives and Radix-based components
- Luxon for date/time and zone-aware computation
- `countries-and-timezones` + `country-flag-icons` for zone metadata/flags
- `@dnd-kit/*` for sortable secondary clocks

### Runtime and Time Handling
- The app ticks once per second using a `setInterval` in `App`.
- UI displays use `DateTime#setZone(...)` to localize from UTC.
- Zone options are generated dynamically from `Intl.supportedValuesOf('timeZone')` with fallback zones.
- Offsets are computed against a reference UTC instant and displayed as `GMT±HH:mm`.
- DST logic includes:
  - detection of non-existent local times (spring-forward gap),
  - detection of ambiguous local times (fall-back overlap),
  - clear user warnings while keeping behavior deterministic.

### UI and Interaction Patterns
- Searchable time zone picker with incremental rendering in long lists.
- Primary analog clock supports drag-to-set time.
- Secondary clocks are rendered as cards with:
  - zone metadata,
  - analog + textual time display,
  - drag handle behavior powered by DnD sensors (mouse/touch/keyboard).

### Project Configuration Notes
- Path alias `@` points to `src` (configured in `vite.config.ts`).
- StrictMode is enabled in `src/main.tsx`.
- Scripts:
  - `npm run dev` – start Vite dev server
  - `npm run build` – type-check and production build
  - `npm run lint` – run ESLint
  - `npm run preview` – preview built app

---

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Install and Run
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## Traffic Tracking (Free)

ChronoSync includes built-in support for **Google Analytics 4 (GA4)** via `gtag` and is designed to be paired with **Google Search Console (GSC)**.
It also includes **Vercel Analytics** for lightweight, privacy-friendly aggregate traffic insights.

### 0) Enable Vercel Analytics
1. Deploy the app to Vercel.
2. In Vercel project settings, enable Analytics.
3. Open the Analytics tab in Vercel to view visitors, page views, countries, and top pages.

Notes:
- No extra environment variable is required for Vercel Analytics.
- Vercel Analytics is automatic aggregate tracking; GA4 remains best for custom product event analysis.

### 1) Enable Google Analytics 4
1. In GA4, create a Web Data Stream for:
  - `https://chronosync-five.vercel.app/`
2. Copy your Measurement ID (example: `G-XXXXXXXXXX`).
3. Create `.env.local` in the project root (you can copy values from `.env.example`).

4. Set your value:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

5. Build/deploy the app.

If `VITE_GA_MEASUREMENT_ID` is not set, analytics is automatically disabled.

### 2) Events tracked in the app
- `page_view`
- `timezone_selected` (`selection_type: primary`)
- `secondary_clock_added`
- `secondary_clock_removed`
- `secondary_clocks_cleared`
- `secondary_clocks_reordered`
- `theme_toggled`
- `dst_warning_shown`

### 3) Enable Google Search Console
1. Add URL-prefix property: `https://chronosync-five.vercel.app/`
2. Verify ownership (DNS or HTML tag method).
3. Submit sitemap:
  - `https://chronosync-five.vercel.app/sitemap.xml`
4. Monitor:
  - Indexing status
  - Search queries / CTR
  - Core Web Vitals

---

## Directory Snapshot

```text
src/
  App.tsx
  main.tsx
  components/
    primary-clock-panel.tsx
    secondary-clocks-panel.tsx
    time-zone-select.tsx
    ...
  lib/
    time-utils.ts
```

This layout keeps business/time logic in `lib`, app-level orchestration in `App`, and UI concerns in focused component modules.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
