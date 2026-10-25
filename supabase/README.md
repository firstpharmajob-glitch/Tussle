# Newsletter signup setup

1. In the Supabase project at `tauezbbieptnofczckka`, open **SQL Editor**.
2. Run [`schema.sql`](./schema.sql).
3. The site sends signup inserts using the Supabase publishable key. Row Level Security allows inserts for anonymous and authenticated visitors; subscribers cannot be read, updated, or deleted through the public API.

Publishable keys are designed for browser use. Never put a Supabase secret/service-role key in this static site. The form normalizes addresses and safely treats duplicate signups as success.
