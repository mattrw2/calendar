# Days

A simple mobile-first calendar + todo app. Vertical scroll feed of upcoming days, each with its own checklist, plus a separate Unscheduled list for loose items.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- [dayjs](https://day.js.org/) for date handling
- [idb](https://github.com/jakearchibald/idb) for IndexedDB persistence
- No auth, no backend — everything lives in the browser

## Features

- **Calendar tab** — scrollable feed showing today + the next 13 days. Each day has its own checklist with inline add/check/delete.
- **Unscheduled tab** — independent list of todos not tied to any day, with a `→ Today` action to drop an item into today's list.
- **Auto dark mode** via `prefers-color-scheme`.
- **Persists across reloads** in IndexedDB (DB name: `calendar-todos`).

## Run

```sh
npm install
npm run dev      # localhost:5173
npm run build    # type-check + production build
```

## Layout

```
src/
├── main.tsx         # React root
├── App.tsx          # tab state, todo state, IDB sync, bottom nav
├── DayCard.tsx      # one day in the Calendar feed
├── TodoItem.tsx     # checkbox + text + delete
├── WeekView.tsx     # the Unscheduled tab
├── db.ts            # idb open + CRUD helpers
├── types.ts         # Todo interface
└── index.css        # Tailwind + base styles (incl. dark mode)
```

## Data model

A single IndexedDB store (`todos`) holding records of:

```ts
{ id, dateKey, text, done, createdAt }
```

`dateKey` is either a `YYYY-MM-DD` string (Calendar items) or the literal `'week'` (Unscheduled items). The Calendar view filters by date; the Unscheduled view filters by the sentinel.
