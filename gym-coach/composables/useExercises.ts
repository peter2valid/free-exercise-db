import type { Exercise } from '~/types/exercise'

export const useExercises = () => {
    const exercises = useState<Partial<Exercise>[]>('exercises', () => [])
    const page = useState<number>('exercises-page', () => 1)
    const hasMore = useState<boolean>('exercises-has-more', () => true)
    const loading = useState<boolean>('exercises-loading', () => false)
    const error = useState<string | null>('exercises-error', () => null)

    const fetchExercises = async (search?: string, loadMore: boolean = false, exerciseNames?: string[]) => {
        if (loading.value) return

        loading.value = true
        error.value = null

        if (!loadMore) {
            page.value = 1
            exercises.value = []
        }

        try {
            // Day-plan mode: fetch by specific exercise name list (no pagination needed)
            if (exerciseNames && exerciseNames.length > 0) {
                const data = await $fetch<{ total: number, exercises: Partial<Exercise>[] }>('/api/exercises', {
                    query: { exercises: exerciseNames.join(',') }
                })
                exercises.value = data.exercises
                hasMore.value = false
                return
            }

            const data = await $fetch<{ total: number, exercises: Partial<Exercise>[] }>('/api/exercises', {
                query: {
                    search,
                    page: page.value,
                    limit: 24
                }
            })

            if (loadMore) {
                exercises.value.push(...data.exercises)
            } else {
                exercises.value = data.exercises
            }

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
