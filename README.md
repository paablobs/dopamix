# DopamiX

Bet in style, win with excitement.

## Stack

- **React 19** + **TypeScript 6**
- **Chakra UI v3** — component library
- **Zustand** — state management with localStorage persistence
- **React Router v7** — client-side routing
- **Framer Motion** — animations
- **Recharts** — dashboard charts
- **Vite 8** — build tooling

## Getting Started

```bash
pnpm install
pnpm run dev
```

> This project requires pnpm. npm and yarn are blocked by a preinstall script.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Start dev server |
| `pnpm run build` | Typecheck + production build |
| `pnpm run lint` | Run ESLint |
| `pnpm run preview` | Preview production build |

## Features

- **Sports betting** — fictional events with odds, stake selection, and auto-resolution
- **Balance system** — welcome bonus, daily rewards, free refills
- **Event lifecycle** — upcoming → live → finished with real-time transitions
- **Achievement system** — unlockable milestones with migration support
- **Rewards** — daily claims, spin wheel, mystery boxes
- **Dashboard** — charts for balance history, win/loss ratio, daily activity
- **Dark theme** — GitHub-inspired color palette

## Project Structure

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

## Deployment

Deployed to GitHub Pages via GitHub Actions. Push to `main` triggers the workflow automatically.

```bash
# Manual build verification
pnpm run build
```

The workflow builds the app, copies `index.html` to `404.html` for SPA routing, and deploys to Pages.

## License

Private project.
