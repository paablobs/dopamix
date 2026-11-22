# DopamiX - Agent Guide

## Stack

- React 19 + TypeScript 6
- Chakra UI v3 — component library
- Zustand — state management with localStorage persistence
- React Router v7 — client-side routing
- Framer Motion — animations
- Recharts — dashboard charts
- Vite 8 — build tooling

## Commands

- `pnpm install` — install deps (pnpm enforced by a preinstall script, will fail with npm/yarn)
- `pnpm run build` — typecheck (`tsc -b`) then vite build
- `pnpm run lint` — eslint
- `pnpm run dev` — vite dev server
- `pnpm run preview` — preview the production build
- No test runner configured.

Run `pnpm run build` before committing. It catches type errors that lint misses (`noUnusedLocals`, `noUnusedParameters` are strict).

## Architecture

React 19 + Chakra UI v3 + Zustand + React Router v7 + Vite 8.

```
src/
├── app/            # App root and router
├── components/     # Layout (TopBar, Sidebar, MainLayout, MobileNav)
├── constants/      # Config values (betting, balance, rewards, events)
├── features/       # Feature modules (betting, events, balance)
├── hooks/          # Custom hooks (useCountdown, useInterval, useMediaQuery)
├── pages/          # Route pages (Home, Events, History, Dashboard, Rewards, Settings)
├── services/       # Business logic (betEngine, eventEngine, rewardEngine, notifications)
├── stores/         # Zustand stores (bet, balance, event, reward, settings, ui)
├── theme/          # Chakra UI theme config
├── types/          # TypeScript interfaces
└── utils/          # Helpers (format, probability, random, id)
```

- `src/main.tsx` — entrypoint, mounts ChakraProvider
- `src/app/App.tsx` — root component, runs game loop (1s interval: tickBets, tickEvents, refreshExpired), renders Toaster + DailyRewardModal
- `src/app/router.tsx` — all routes under MainLayout
- `src/stores/` — Zustand stores with `persist` middleware (localStorage keys: `dopamix_*`)
- `src/features/` — feature modules (betting, events, balance) with their own components
- `src/pages/` — route page components
- `src/services/` — business logic engines (betEngine, eventEngine, rewardEngine, notificationService)
- `src/constants/` — config values (betting limits, balance amounts, reward tiers, event data)

## Critical patterns

**Zustand cross-store calls**: Stores call each other via `useXxxStore.getState()`. Example: `betStore.placeBet()` calls `balanceStore.deductCredits()` and `rewardStore.incrementBetCount()`.

**Toast rendering**: Chakra v3 Toaster requires a custom render function in `App.tsx`. `Toast.Title` and `Toast.Description` must receive `toast.title`/`toast.description` as children. Do not use empty self-closing tags — they render nothing.

**Event lifecycle**: Events transition `upcoming → live → finished` via `eventStore.tickEvents()` called every second. Live duration: 2min, finished cleanup: 5min. Without `tickEvents()` calls, events never change state.

**BetSlip**: Mounted once in `MainLayout.tsx`. Uses Chakra Portal internally. Desktop: always visible (360px right panel). Mobile: overlay triggered by `uiStore.betSlipOpen`. MainLayout needs `mr={{ base: 0, lg: '360px' }}` to avoid content overlap.

**Achievement migration**: `rewardStore` has a `version` field in persist config. When adding achievements, bump `ACHIEVEMENTS_VERSION` and update `migrate()` to preserve user unlock state.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Pushing to `main` triggers it: the workflow builds the app, copies `index.html` to `404.html` for SPA routing, and deploys to Pages. Requires `base: './'` in vite.config.ts and `404.html` copy for SPA routing. Source must be set to "GitHub Actions" in repo Settings → Pages.

## Style

- Dark theme: bg `#0D1117`, cards `#161B22`, borders `#30363D`, text `#F0F6FC`
- Accent colors: green `#00D395`, gold `#FFB800`, purple `#7C3AED`, red `#F85149`
- Icons: lucide-react
- No comments in code unless explicitly asked
