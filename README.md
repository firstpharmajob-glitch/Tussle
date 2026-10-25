# Tussle Furniture Co.

The storefront runs on Next.js App Router and is deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Verify and build

```bash
npm run typecheck
npm run build
npm run start
```

The storefront is rendered by Next.js and React. Product cards, persistent cart, newsletter form, quiz, Nightshift flip, hero showcase, room comparison, age gate, and logo moods use React components/state. `app/storefront-content.ts` contains the static React element data for the original design; `index.html` is retained only as the visual reference and is not read at runtime.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for local newsletter signup; configure the same variables in Vercel for production. Only use a publishable key in these browser-visible variables, never a secret/service-role key.

Newsletter database setup is documented in [`supabase/README.md`](./supabase/README.md). Online payments are not configured.
