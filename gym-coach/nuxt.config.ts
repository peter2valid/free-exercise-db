// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss'],
    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
            meta: [
                { name: 'theme-color', content: '#0f1115' },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            ]
        }
    },
    runtimeConfig: {
        // Server-only (private) — only accessible in server/api routes
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    routeRules: {
        // Production SWR caching (Stale-While-Revalidate).
        // Caches API responses at the Vercel Edge CDN for 24 hours.
        // Means instant load times worldwide & zero load on Supabase free-tier.
        '/api/**': { swr: 86400 },
        // Cache the main HTML page at the Edge CDN too, for instant initial loads.
        '/': { swr: 3600 },
        // Cache images & GIFs in the browser and Edge CDN for 1 year (immutable)
        '/exercises/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } }
    }
})


