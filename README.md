# 🪷 Vesak Card Creator

A modern, elegant digital greeting card creator for Vesak Poya Day — built with React, TypeScript, and Tailwind CSS. Design beautiful cards, personalise your message, and download or share them instantly.

---

## Features

### Card Editor
- **7 templates** — Vesak Lanterns, Lotus Garden, Temple at Dawn, Pandal Festival, Zen Minimalist, Sacred Gold, and a **Your Photo** custom canvas
- **Custom background** — upload your own photo as the card background (available on the "Your Photo" template)
- **Text personalisation** — recipient name, custom greeting, message, sender name, and organisation
- **30+ curated Vesak messages** across categories: traditional, spiritual, poetic, and short
- **Style controls** — font family, font size, font colour (presets + custom picker), text alignment
- **Orientations** — portrait (600 × 800 px) and landscape (800 × 600 px)
- **Dark overlay slider** — control image readability when using a custom photo background
- **"Happy Vesak" title toggle** — show or hide the title on the custom photo template

### Export & Sharing
- **Download PNG** — standard, high-res (2×), or print (3×) quality
- **Download PDF** — print-ready, auto-sized to card orientation
- **Copy to clipboard** — paste directly into chats and messages
- **Share** — native device share sheet (Web Share API with PNG file)

### Editor Quality of Life
- **Live preview** — real-time card preview with zoom controls
- **Undo / Redo** — full history for all card changes
- **Recently used** — quick access to your last 5 templates
- **Favourites** — star templates for fast recall
- **Dark mode** — default dark theme with toggle; preference persisted across sessions
- **Mobile responsive** — tab-based editor (Content / Style / Save) on phones and tablets; full three-column layout on desktop

---

## Templates

| Template | Style | Description |
|---|---|---|
| Vesak Lanterns | Traditional | Deep night sky with glowing gold lanterns and lotus water scene |
| Lotus Garden | Floral | Soft pastel lotus blooms floating on tranquil waters |
| Temple at Dawn | Spiritual | Saffron sunrise with temple silhouette and Dharmachakra |
| Pandal Festival | Festive | Colourful night pandal illuminated with festive string lights |
| Zen Minimalist | Minimalist | Clean cream background with elegant lotus line art in gold |
| Sacred Gold | Spiritual | Luxurious gold mandala with Om symbol and ornate borders |
| Your Photo | Custom | Upload any photo as the full card background with optional Vesak title overlay |

All templates are pure CSS + inline SVG — no external image dependencies.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 with custom gold / Vesak theme |
| State | Zustand v4 with persist middleware |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Export | html2canvas + jsPDF |
| Auth & DB | Supabase (Auth, Postgres, Storage) |
| Fonts | Playfair Display, Cormorant Garamond, Josefin Sans, Inter |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/festival-card.git
cd festival-card
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> The app runs in **demo mode** if these are not set — the card creator works fully, but authentication and community features are disabled.

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

---

## Deployment

The project is configured for **Vercel**. A `vercel.json` rewrite rule ensures React Router's client-side routes work correctly on direct URL access.

1. Push the repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables
4. Deploy — every push to `main` triggers an automatic redeploy

---

## Community Platform *(Coming Soon)*

The community features are fully built on the backend but are currently hidden behind a **Coming Soon** page while the platform is being finalised. Once launched, users will be able to:

- **Browse a community feed** of templates shared by other creators, sortable by trending, newest, most liked, and featured
- **Like and save templates** — react to designs you love and build personal collections
- **Comment and discuss** — leave feedback and start conversations on any shared template
- **Publish your own templates** — share a card design you've made with the entire community; a thumbnail is auto-generated from your card
- **Follow creators** — subscribe to designers whose work you admire and see their new templates in your feed
- **Creator dashboard** — track your published templates, view counts, download counts, likes, and comments in one place
- **Badges and achievements** — earn recognition for contributions, popular templates, and milestones
- **Notifications** — get notified when someone likes your template, follows you, or replies to your comment
- **User profiles** — public creator pages showing published templates, follower counts, and earned badges

The backend infrastructure (Supabase schema, Row Level Security policies, storage bucket, auto-triggers for counts) is already in place. Authentication supports **email / password** and **Google OAuth**.

---

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── community/       # Community-specific components (PublishModal, etc.)
│   ├── CardPreviewPanel.tsx
│   ├── DownloadPanel.tsx
│   ├── Header.tsx
│   ├── MessagePicker.tsx
│   ├── StylePanel.tsx
│   └── TextEditor.tsx
├── data/                # Static data (templates, messages)
├── hooks/               # useCommunity hooks (feed, likes, follows, etc.)
├── lib/                 # Supabase client + mock data fallback
├── pages/               # Route-level page components
├── templates/           # CardTemplate — all 7 card designs as React components
├── App.tsx              # Router, layout, editor view
├── authStore.ts         # Auth Zustand store (not persisted)
├── store.ts             # App Zustand store (persisted)
└── types.ts             # Shared TypeScript types
supabase/
└── schema.sql           # Full Postgres schema with RLS, triggers, indexes
```

---

## License

MIT
