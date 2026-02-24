export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
        throw createError({ statusCode: 400, statusMessage: 'Missing slug' })
    }

    const supabase = useSupabaseClient()

    // Fetch all exercises to match slug (slug is derived from name, not stored)
    const { data, error } = await supabase
        .from('exercises')
        .select('*')

    if (error) throw createError({ statusCode: 500, message: error.message })

    const found = (data ?? []).find((ex: Record<string, any>) => {
        const generatedSlug = ex.name.toLowerCase()
            .replace(/\//g, '-')
            .replace(/ /g, '-')
            .replace(/[()]/g, '')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        return generatedSlug === slug
    })

    if (!found) {
        throw createError({ statusCode: 404, statusMessage: 'Exercise not found' })
    }

    // Map snake_case → camelCase for the frontend
    return {
        ...found,
        primaryMuscles: found.primary_muscles ?? [],
        secondaryMuscles: found.secondary_muscles ?? [],
    }
})

