
# Troubleshooting Database Connection

The database connection to Supabase is failing with `P1001: Can't reach database server`.

## Possible Causes
1. **Supabase Project Paused:** Free tier projects pause after 1 week of inactivity. 
2. **Firewall/Network:** Something is blocking port 5432.
3. **Password:** Although updated, sometimes special characters need different escaping (we used URL encoding `%40` for `@`).

## Current Workaround: Demo Mode
To keep you moving, I have enabled **Demo Mode** on the frontend.
- The Wallet and Dashboard will load **Mock Data**.
- You can navigate and interact with the UI.
- Real data persistence will fail until the DB is reachable.

## Action Items
1. Log into [Supabase Dashboard](https://supabase.com/dashboard).
2. Check if project `vjcifzncgxxeqbagbzsc` is **Active**.
3. If paused, click **Restore**.
