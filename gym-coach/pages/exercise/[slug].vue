<script setup lang="ts">
import type { Exercise } from '~/types/exercise'

const route = useRoute()
const slug = route.params.slug as string

const { data: exercise, pending, error } = await useFetch<Exercise>(`/api/exercise/${slug}`, {
  key: `exercise-${slug}`
})

const currentImageIndex = ref(0)
let animationInterval: ReturnType<typeof setInterval> | null = null

const currentImage = computed(() => {
  if (!exercise.value || !exercise.value.images || !exercise.value.images.length) return ''
  return exercise.value.images[currentImageIndex.value]
})

onMounted(() => {
  startAnimation()
})

onUnmounted(() => {
  stopAnimation()
})

const startAnimation = () => {
  if (!exercise.value?.images || exercise.value.images.length <= 1) return
  
  stopAnimation()
  
  animationInterval = setInterval(() => {
    if (!exercise.value?.images) return
    currentImageIndex.value = (currentImageIndex.value + 1) % exercise.value.images.length
  }, 700)
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-background pb-20">
    <div v-if="pending" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error" class="flex flex-col items-center justify-center h-screen px-4">
      <p class="text-red-400 mb-4">{{ error.message }}</p>
      <NuxtLink to="/" class="text-blue-400 hover:underline">Back to Exercises</NuxtLink>
    </div>

    <div v-else-if="exercise" class="max-w-2xl mx-auto bg-white min-h-screen shadow-xl relative">
      <NuxtLink to="/" class="absolute top-4 left-4 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </NuxtLink>

      <div class="aspect-square bg-gray-100 relative">
        <img 
          :src="`/exercises/${currentImage}`" 
          :alt="exercise.name"
          class="w-full h-full object-contain mix-blend-multiply"
        />
      </div>

      <div class="p-6 md:p-8">
        <div class="mb-6">
          <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
            {{ exercise.category }}
          </span>
          <h1 class="text-3xl font-bold text-gray-900 leading-tight">{{ exercise.name }}</h1>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-gray-50 p-4 rounded-xl">
            <span class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Primary</span>
            <span class="font-medium text-gray-900 capitalize">{{ exercise.primaryMuscles.join(', ') }}</span>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl">
            <span class="block text-xs text-gray-500 uppercase tracking-wider mb-1">Equipment</span>
            <span class="font-medium text-gray-900 capitalize">{{ exercise.equipment || 'None' }}</span>
          </div>
        </div>

        <div class="prose prose-blue max-w-none">
          <h3 class="text-gray-900 font-bold text-lg mb-3">Instructions</h3>
          <ol class="list-decimal pl-5 space-y-2 text-gray-700">
            <li v-for="(step, index) in exercise.instructions" :key="index">
              {{ step }}
            </li>
          </ol>
        </div>
        
        <div v-if="exercise.secondaryMuscles.length" class="mt-8 pt-6 border-t border-gray-100">
           <span class="text-sm text-gray-500">Secondary Muscles: </span>
           <span class="text-sm text-gray-700 capitalize">{{ exercise.secondaryMuscles.join(', ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


