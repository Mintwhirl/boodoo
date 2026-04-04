# Boo Boo Do

A shared todo list for two. One list, always in sync, made for phones.

## What It Is

A single shared todo list that two people use on their phones every day. Add something, check it off, delete it. The other person sees it instantly. That's it.

## Features

- Add a new task
- Toggle task complete / incomplete
- Delete a task
- Active / Completed tabs
- Completed tasks show completion date
- Celebration animation when checking off a task
- Real-time sync between devices
- Works offline
- Installable as a PWA on iPhone and Android

## What It Is Not

This is a locked scope. These will NOT be added:

- Login or authentication
- Multiple lists
- Categories, tags, or filters
- Priorities or due dates
- Notifications or reminders
- User profiles or avatars
- Dark mode or theme settings
- Undo or history
- Sharing or permissions
- Search
- Drag-and-drop reordering
- Subtasks or nested items
- Comments or attachments
- Any settings page

## Tech Stack

| Layer     | Technology              |
|-----------|------------------------|
| Frontend  | Plain HTML, CSS, JS    |
| Database  | Supabase (Postgres)    |
| Realtime  | Supabase subscriptions |
| Hosting   | Vercel (static site)   |
| PWA       | Service worker + manifest |

No frameworks. No build tools. No server-side code.

## Project Files

```
index.html       — App shell, meta tags, PWA manifest link
styles.css       — Mobile-first styles, organic watercolor background, frosted glass cards
script.js        — Supabase client, CRUD, tabs, celebration, realtime subscription
manifest.json    — PWA manifest
sw.js            — Service worker (caches static assets)
icon-192.png     — App icon (192x192)
icon-512.png     — App icon (512x512)
pwa_icon.png     — Source icon file
vercel.json      — Vercel static site config
SETUP.md         — Setup instructions for fresh install
```

## Setup

See [SETUP.md](SETUP.md) for step-by-step instructions.

## Redeploying

```bash
vercel --prod
```
