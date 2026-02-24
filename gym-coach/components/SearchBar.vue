<template>
  <div class="sticky top-0 z-10 bg-background/95 backdrop-blur-sm p-3 sm:p-4 border-b border-gray-800">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search exercises..."
        class="w-full bg-gray-900 border border-gray-700 rounded-xl py-3 px-4 pl-10 text-base sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="onInput"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const emit = defineEmits(['search'])

let timeout: ReturnType<typeof setTimeout>

const onInput = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}
</script>
