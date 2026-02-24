import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

/**
 * Returns a shared Supabase client for use in Nuxt server routes ONLY.
 * Uses the service role key to bypass RLS — this is safe because this
 * function is only ever called in server/api routes, never in the browser.
 */
export function useSupabaseClient() {
    if (_client) return _client

    const url = process.env.SUPABASE_URL
    // Use service key server-side → bypasses Row Level Security safely
    const key = process.env.SUPABASE_SERVICE_KEY

    if (!url || !key) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables')
    }

    _client = createClient(url, key)
    return _client
}

