import exercises from '~/data/exercises.json'
import type { Exercise } from '~/types/exercise'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const search = (query.search as string)?.toLowerCase()
    const exerciseNames = (query.exercises as string)
        ?.split(',').map(n => n.trim()).filter(Boolean)

    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 24
    const offset = (page - 1) * limit

    const supabase = useSupabaseClient()

    // Day-plan mode: match by exercise name list
    if (exerciseNames && exerciseNames.length > 0) {
        // Build OR filter: name ilike '%Barbell Bench Press%' OR ...
        const orFilter = exerciseNames
            .map(n => `name.ilike.%${n}%`)
            .join(',')

        const { data, error } = await supabase
            .from('exercises')
            .select('id, name, images, primary_muscles, category')
            .or(orFilter)

        if (error) throw createError({ statusCode: 500, message: error.message })

        const exercises = (data ?? []).map(mapRow)
        return { total: exercises.length, exercises }
    }

    // Normal browse / search mode with pagination
    let dbQuery = supabase
        .from('exercises')
        .select('id, name, images, primary_muscles, category', { count: 'exact' })

    if (search) {
        dbQuery = dbQuery.ilike('name', `%${search}%`)
    }

    const { data, count, error } = await dbQuery
        .order('name')
        .range(offset, offset + limit - 1)

    if (error) throw createError({ statusCode: 500, message: error.message })

    return {
        total: count ?? 0,
        exercises: (data ?? []).map(mapRow)
    }
})

// Map snake_case DB columns → camelCase for the frontend
function mapRow(row: any) {
    return {
        id: row.id,
        name: row.name,
        images: row.images ?? [],
        primaryMuscles: row.primary_muscles ?? [],
        category: row.category ?? '',
    }
}

