import type { Exercise } from '~/types/exercise'

export const useExercises = () => {
    const exercises = useState<Partial<Exercise>[]>('exercises', () => [])
    const page = useState<number>('exercises-page', () => 1)
    const hasMore = useState<boolean>('exercises-has-more', () => true)
    const loading = useState<boolean>('exercises-loading', () => false)
    const error = useState<string | null>('exercises-error', () => null)
    
    // Track the current search term and day plan so pagination works correctly
    const currentSearch = useState<string | undefined>('exercises-current-search', () => undefined)
    const currentDayPlan = useState<string[] | undefined>('exercises-current-day-plan', () => undefined)

    const fetchExercises = async (search?: string, loadMore: boolean = false, exerciseNames?: string[]) => {
        if (loading.value) return

        loading.value = true
        error.value = null

        if (!loadMore) {
            page.value = 1
            exercises.value = []
            currentSearch.value = search
            currentDayPlan.value = exerciseNames
        }

        try {
            // Day-plan mode: fetch by specific exercise name list (no pagination needed)
            const activeDbPlan = loadMore ? currentDayPlan.value : exerciseNames
            if (activeDbPlan && activeDbPlan.length > 0) {
                const data = await $fetch<{ total: number, exercises: Partial<Exercise>[] }>('/api/exercises', {
                    query: { exercises: activeDbPlan.join(',') }
                })
                exercises.value = data.exercises
                hasMore.value = false
                return
            }

            const activeSearch = loadMore ? currentSearch.value : search
            const data = await $fetch<{ total: number, exercises: Partial<Exercise>[] }>('/api/exercises', {
                query: {
                    search: activeSearch,
                    page: page.value,
                    limit: 24
                }
            })

            // Filter out exact duplicates by ID in case Supabase returns overlapping data on page boundaries
            if (loadMore) {
                const existingIds = new Set(exercises.value.map(e => e.id))
                const newUniqueExercises = data.exercises.filter(e => !existingIds.has(e.id))
                exercises.value.push(...newUniqueExercises)
            } else {
                exercises.value = data.exercises
            }

            // Only say we have more if the total unique exercises is less than the count
            hasMore.value = exercises.value.length < data.total
            
            if (hasMore.value) {
                page.value++
            }

        } catch (e: any) {
            error.value = e.message || 'Failed to fetch exercises'
        } finally {
            loading.value = false
        }
    }

    return {
        exercises,
        loading,
        error,
        hasMore,
        fetchExercises
    }
}
