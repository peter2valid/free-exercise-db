<template>
  <NuxtLink 
    :to="`/exercise/${slug}`" 
    class="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform"
    @mouseenter="startAnimation"
    @mouseleave="stopAnimation"
  >
    <div class="aspect-square relative bg-gray-100 p-4">
      <img 
        v-if="exercise.images && exercise.images.length"
        :src="`/exercises/${currentImage}`" 
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

const currentImageIndex = ref(0)
let animationInterval: ReturnType<typeof setInterval> | null = null

const currentImage = computed(() => {
  if (!props.exercise.images || !props.exercise.images.length) return ''
  // If we are animating, we might need to handle the path differently if the images array has full paths
  // The images array usually looks like ["Output/0.jpg", "Output/1.jpg"] or just ["0.jpg", "1.jpg"] inside the folder?
  // Actually the data says: "images": ["Ab_Crunch_Machine/0.jpg", "Ab_Crunch_Machine/1.jpg"]
  // So we just need to pick the index.
  return props.exercise.images[currentImageIndex.value]
})

const startAnimation = () => {
  if (!props.exercise.images || props.exercise.images.length <= 1) return
  
  stopAnimation()
  
  animationInterval = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % (props.exercise.images?.length || 1)
  }, 700) // 700ms per frame for a steady pace
}

const stopAnimation = () => {
  if (animationInterval) {
    clearInterval(animationInterval)
    animationInterval = null
  }
  currentImageIndex.value = 0
}

onUnmounted(() => {
  stopAnimation()
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
