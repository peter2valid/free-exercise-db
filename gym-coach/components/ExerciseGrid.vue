<template>
  <TransitionGroup name="list" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <ExerciseCard 
      v-for="(exercise, index) in exercises" 
      :key="exercise.id || index" 
      :exercise="exercise" 
      :style="{ transitionDelay: `${index * 50}ms` }"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

defineProps<{
  exercises: Partial<Exercise>[]
}>()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
