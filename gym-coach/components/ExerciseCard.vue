<template>
  <NuxtLink 
    :to="`/exercise/${slug}`" 
    class="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform"
  >
    <div class="aspect-square relative bg-gray-100 p-4">
      <img 
        v-if="exercise.images && exercise.images.length"
        :src="`/exercises/${gifImage}`" 
        :alt="exercise.name" 
        loading="lazy"
        class="w-full h-full object-contain mix-blend-multiply"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        No Image
      </div>
    </div>
    <div class="p-2.5 sm:p-4">
      <h3 class="font-bold text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">{{ exercise.name }}</h3>
      <p class="text-[10px] sm:text-xs text-gray-500 mt-0.5 capitalize">{{ (exercise.primaryMuscles || []).join(', ') }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

const props = defineProps<{
  exercise: Partial<Exercise>
}>()

const gifImage = computed(() => {
  if (!props.exercise.images || props.exercise.images.length === 0) return ''
  const firstImage = props.exercise.images[0]
  // Extract folder path and append animation.gif
  const lastSlash = firstImage.lastIndexOf('/')
  if (lastSlash === -1) {
    return 'animation.gif' // Fallback if no folder structure
  }
  return firstImage.substring(0, lastSlash + 1) + 'animation.gif'
})

const slug = computed(() => {
  return (props.exercise.name || '').toLowerCase() // Handle possible undefined name
    .replace(/\//g, '-') // Replace slashes with dashes
    .replace(/ /g, '-') // Replace spaces with dashes
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/[^a-z0-9-]/g, '') // Remove any other non-alphanumeric chars (except dashes)
    .replace(/-+/g, '-') // Collapse multiple dashes
    .replace(/^-|-$/g, '') // Trim dashes
})
</script>
