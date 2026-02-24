import { createClient } from '@supabase/supabase-js'

/**
 * Returns a Supabase client for use in Nuxt server routes.
 * Uses runtimeConfig so keys are injected from env vars at request time.
 */
export function useSupabaseClient() {
    const config = useRuntimeConfig()
    return createClient(
        config.supabaseUrl as string,
        config.supabaseAnonKey as string
    )
}
