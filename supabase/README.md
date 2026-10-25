# Newsletter signup setup

1. Create a Supabase project and run [`schema.sql`](./schema.sql) in its SQL Editor.
2. In Vercel, open the `tussle` project settings and add these Production environment variables:
   - `SUPABASE_URL`: the project URL from Supabase Project Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY`: the server-side service-role/secret key from the same settings.
3. Redeploy the production site in Vercel.

Keep `SUPABASE_SERVICE_ROLE_KEY` server-side. Do not add it to the page, commit it, or share it in chat. The `/api/subscribe` endpoint validates and normalizes addresses, ignores duplicate signups, and does not expose subscriber data to the browser.
