# Frequent Flyer

NASA's [Astronomy Picture of the Day](https://apod.nasa.gov/) archive, reimagined as an airline boarding-pass collection. Each APOD entry gets a generated flight code (e.g. `FF250902`) and a deterministic "miles" balance, styled with a retro-futuristic airline aesthetic.

> **Status: work in progress.** The data layer (NASA API client, formatting helpers, accessibility hooks) is built, but the UI components that consume it are not — `App.tsx` is still a placeholder.

## Tech stack

- [Vite](https://vite.dev/) 8
- [React](https://react.dev/) 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4 (CSS-based `@theme`, no `tailwind.config.js`)
- [oxlint](https://oxc.rs/) for linting

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app calls NASA's APOD API and works out of the box using NASA's shared `DEMO_KEY`, but that key is rate-limited to 30 requests/hour/IP. For a smoother experience, grab a free key at [api.nasa.gov](https://api.nasa.gov) and set it in `.env.local`:

```
VITE_NASA_API_KEY=your-key-here
```

## Scripts

| Command           | Description                          |
| ------------------ | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server             |
| `npm run build`   | Type-check (`tsc -b`) and build for production |
| `npm run lint`    | Run oxlint                            |
| `npm run preview` | Preview the production build locally  |

## Project structure

```
src/
├── App.tsx          # Root component (placeholder — UI not yet built)
├── main.tsx         # React entry point
├── constants.ts      # APOD date bounds, calendar labels
├── types.ts           # ApodEntry, DateRange, FilterMode, LightboxState
├── index.css          # Tailwind v4 theme tokens (fonts, colors, radii, shadows)
├── hooks/              # UI/accessibility hooks: focus trap, click-outside,
│                        # escape-key, modal dismiss, responsive page size,
│                        # progressive image preload
└── lib/
    ├── apod.ts         # NASA APOD API client (date-range, random, collage fetches)
    └── format.ts       # Flight code / seeded miles / date formatting helpers

inspo/                  # Reference screenshots for the boarding-pass design
```

## Design

Visual design (Orbitron display font, Space Mono monospace, orange/navy/gold palette) is based on a Figma design system, referenced directly in `src/index.css`. Reference screenshots of the target "boarding pass" card design live in [`inspo/`](inspo/).
