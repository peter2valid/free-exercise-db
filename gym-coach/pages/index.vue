<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto max-w-7xl">
      <header class="py-5 sm:py-8 px-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-1">Gym Coach</h1>
        <p class="text-sm text-gray-400">Find the perfect exercise for your workout</p>
      </header>

      <!-- Workout Day Cards -->
      <WorkoutDayCards
        class="mb-4"
        @select="handleDaySelect"
        @clear="handleDayClear"
      />

      <!-- Search bar — hidden when a day plan is active -->
      <SearchBar v-if="!isDayPlanActive" @search="handleSearch" class="mb-3 sticky top-0 z-20" />

      <!-- Active day plan badge -->
      <div v-if="isDayPlanActive" class="px-4 mb-4 flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 bg-blue-900/40 border border-blue-700/50 rounded-full px-3 py-1">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>
          Showing day plan exercises
        </span>
        <button @click="handleDayClear" class="text-xs text-gray-500 hover:text-white transition-colors ml-auto">
          Clear ✕
        </button>
      </div>

      <main class="pb-24" style="padding-bottom: max(6rem, env(safe-area-inset-bottom, 0px) + 1.5rem)">
        <div v-if="loading && !exercises.length" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="error" class="text-center text-red-400 py-12">
          {{ error }}
        </div>

        <div v-else-if="!exercises.length && !loading" class="text-center text-gray-400 py-12">
          No exercises found. Try a different search.
        </div>

        <ExerciseGrid v-else :exercises="exercises" />

        <div v-if="hasMore && !loading && exercises.length && !isDayPlanActive" class="flex justify-center mt-8">
          <button 
            @click="loadMore"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors shadow-lg"
          >
            Load More Exercises
          </button>
        </div>
        
        <div v-if="loading && exercises.length" class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const { exercises, loading, error, hasMore, fetchExercises } = useExercises()

const isDayPlanActive = ref(false)

// Initial fetch
await fetchExercises()

const handleSearch = (query: string) => {
  fetchExercises(query, false)
}

const loadMore = () => {
    fetchExercises(undefined, true)
}

const handleDaySelect = (exerciseNames: string[]) => {
  isDayPlanActive.value = true
  fetchExercises(undefined, false, exerciseNames)
}

const handleDayClear = () => {
  isDayPlanActive.value = false
  fetchExercises(undefined, false)
}
</script>

