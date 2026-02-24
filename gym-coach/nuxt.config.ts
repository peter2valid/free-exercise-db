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
    }
})


