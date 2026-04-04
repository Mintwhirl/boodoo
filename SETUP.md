# Boo Boo Do

A shared todo list for two. One list, always in sync, made for phones.

**Live at:** https://boodoo-ivory.vercel.app

---

## What It Is

A single shared todo list that two people use on their phones every day. Add something, check it off, delete it. The other person sees it instantly. That's it.

## What It Is Not

This is a **locked scope**. These features will NOT be added:

- Login or authentication
- Multiple lists
- Categories, tags, or filters
- Priorities or due dates
- Notifications or reminders
- User profiles or avatars
- Dark mode or theme settings
- Undo or history
- Sharing or permissions (it's already shared)
- Search
- Drag-and-drop reordering
- Subtasks or nested items
- Comments or attachments
- Any settings page of any kind

If it's not in the "Features" section below, it doesn't exist and won't be added.

---

## Features

- Add a new task
- Toggle task complete / incomplete
- Delete a task
- Active / Completed tabs
- Completed tasks show completion date
- Celebration animation when checking off a task
- Real-time sync between devices
- Works offline (loads cached version, syncs when back online)
- Installable as a PWA on iPhone and Android

## Tech Stack

| Layer     | Technology              |
|-----------|------------------------|
| Frontend  | Plain HTML, CSS, JS    |
| Database  | Supabase (Postgres)    |
| Realtime  | Supabase subscriptions |
| Hosting   | Vercel (static site)   |
| PWA       | Service worker + manifest |

No frameworks. No build tools. No server-side code.

---

## Project Files

```
index.html       — App shell, meta tags, PWA manifest link
styles.css       — Mobile-first styles, organic watercolor background, frosted glass cards
script.js        — Supabase client, CRUD, tabs, celebration, realtime subscription, SW registration
manifest.json    — PWA manifest (name, icons, theme)
sw.js            — Service worker (caches static assets)
icon-192.png     — App icon (192x192)
icon-512.png     — App icon (512x512)
pwa_icon.png     — Source icon file
vercel.json      — Vercel static site config
```

## Data Model

Single table: `todos`

| Column       | Type          | Default              |
|--------------|---------------|----------------------|
| id           | UUID          | `gen_random_uuid()`  |
| text         | TEXT          | —                    |
| completed    | BOOLEAN       | `false`              |
| completed_at | TIMESTAMPTZ   | `null`               |
| created_at   | TIMESTAMPTZ   | `now()`              |

No other tables. No foreign keys. No migrations to manage.

---

## Setup (for a fresh install)

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), sign up, create a new project.

### 2. Create the table

Go to **SQL Editor** and run:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view todos" ON todos FOR SELECT USING (true);
CREATE POLICY "Anyone can insert todos" ON todos FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update todos" ON todos FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete todos" ON todos FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE todos;
```

### 3. Add your Supabase keys

In `script.js`, update lines 6-7:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

Both values are at **Settings > API** in your Supabase dashboard. The anon key is safe for client-side use.

### 4. Deploy

```bash
npm i -g vercel
vercel --prod
```

### 5. Add to phone

Open the URL in Safari, tap Share > Add to Home Screen. Do this on both phones. Done.

---

## Redeploying

After any code change:

```bash
vercel --prod
```

That's it. No build step.
