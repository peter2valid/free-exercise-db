<template>
  <div class="px-3 sm:px-4 pb-2">
    <h2 class="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Weekly Plan</h2>
    <div class="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
      <button
        v-for="day in days"
        :key="day.number"
        @click="selectDay(day)"
        :class="[
          'snap-start flex-shrink-0 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-2 sm:py-3 transition-all duration-300 min-w-[58px] sm:min-w-[88px] border touch-manipulation',
          activeDay === day.number
            ? 'bg-gradient-to-br ' + day.gradient + ' border-transparent text-white shadow-lg scale-105'
            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
        ]"
      >
        <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Day</span>
        <span class="text-xl sm:text-2xl font-extrabold leading-none mb-0.5">{{ day.number }}</span>
        <span :class="['text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide', activeDay === day.number ? 'text-white/80' : day.labelColor]">
          {{ day.label }}
        </span>
      </button>
    </div>

    <!-- Active day detail strip -->
    <transition name="slide-down">
      <div
        v-if="activeDayData && activeDayData.exercises.length"
        class="mt-2 bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-3"
      >
        <p class="text-[10px] sm:text-xs text-gray-500 mb-1.5 font-semibold uppercase tracking-widest">{{ activeDayData.focus }}</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="ex in activeDayData.exercises"
            :key="ex.name"
            class="text-[10px] sm:text-[11px] bg-gray-800 text-gray-300 rounded-full px-2 py-0.5 border border-gray-700 leading-tight"
          >
            {{ ex.name }}
          </span>
        </div>
      </div>
      <div v-else-if="activeDayData && activeDayData.exercises.length === 0" class="mt-2 bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
        <p class="text-gray-500 text-sm">🧘 Rest & Recovery Day</p>
        <p class="text-gray-600 text-xs mt-0.5">Light walking, stretching or yoga recommended</p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  select: [exerciseNames: string[]]
  clear: []
}>()

const activeDay = ref<number | null>(null)

interface DayExercise { name: string; sets: string; reps: string }

interface WorkoutDay {
  number: number
  label: string
  focus: string
  gradient: string
  labelColor: string
  exercises: DayExercise[]
}

const days: WorkoutDay[] = [
  {
    number: 1,
    label: 'Push',
    focus: 'Chest · Shoulders · Triceps',
    gradient: 'from-blue-600 to-blue-400',
    labelColor: 'text-blue-400',
    exercises: [
      { name: 'Barbell Bench Press', sets: '3-4', reps: '8-12' },
      { name: 'Overhead Press', sets: '3', reps: '10-15' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '8-12' },
      { name: 'Lateral Raise', sets: '3', reps: '12-15' },
      { name: 'Tricep Dip', sets: '3-4', reps: '8-12' },
    ]
  },
  {
    number: 2,
    label: 'Pull',
    focus: 'Back · Biceps · Rear Delts',
    gradient: 'from-violet-600 to-violet-400',
    labelColor: 'text-violet-400',
    exercises: [
      { name: 'Pull-Up', sets: '3-4', reps: '6-12' },
      { name: 'Lat Pulldown', sets: '3-4', reps: '6-12' },
      { name: 'Barbell Row', sets: '3-4', reps: '8-10' },
      { name: 'Face Pull', sets: '3', reps: '12-15' },
      { name: 'Barbell Curl', sets: '3', reps: '8-12' },
      { name: 'Hammer Curl', sets: '3', reps: '8-12' },
    ]
  },
  {
    number: 3,
    label: 'Legs',
    focus: 'Quads · Hamstrings · Glutes · Calves',
    gradient: 'from-emerald-600 to-emerald-400',
    labelColor: 'text-emerald-400',
    exercises: [
      { name: 'Barbell Squat', sets: '3-4', reps: '6-10' },
      { name: 'Romanian Deadlift', sets: '3', reps: '8-12' },
      { name: 'Leg Press', sets: '3', reps: '10-15' },
      { name: 'Leg Curl', sets: '3', reps: '10-15' },
      { name: 'Calf Raise', sets: '3-4', reps: '15-20' },
    ]
  },
  {
    number: 4,
    label: 'Rest',
    focus: 'Active Recovery',
    gradient: 'from-gray-600 to-gray-400',
    labelColor: 'text-gray-400',
    exercises: [] // Rest day
  },
  {
    number: 5,
    label: 'Push+',
    focus: 'Chest · Shoulders · Triceps (Variation)',
    gradient: 'from-sky-600 to-sky-400',
    labelColor: 'text-sky-400',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: '3-4', reps: '8-12' },
      { name: 'Dumbbell Shoulder Press', sets: '3', reps: '10-15' },
      { name: 'Cable Fly', sets: '3', reps: '12-15' },
      { name: 'Lateral Raise', sets: '3', reps: '12-15' },
      { name: 'Tricep Pushdown', sets: '3-4', reps: '10-15' },
    ]
  },
  {
    number: 6,
    label: 'Pull+',
    focus: 'Back · Biceps (Variation)',
    gradient: 'from-purple-600 to-purple-400',
    labelColor: 'text-purple-400',
    exercises: [
      { name: 'Deadlift', sets: '3-4', reps: '4-8' },
      { name: 'Dumbbell Row', sets: '3-4', reps: '8-12' },
      { name: 'Seated Cable Row', sets: '3', reps: '10-15' },
      { name: 'Face Pull', sets: '3', reps: '12-15' },
      { name: 'Hammer Curl', sets: '3', reps: '8-12' },
    ]
  },
  {
    number: 7,
    label: 'Legs+',
    focus: 'Quads · Hamstrings · Glutes (Variation)',
    gradient: 'from-teal-600 to-teal-400',
    labelColor: 'text-teal-400',
    exercises: [
      { name: 'Front Squat', sets: '3-4', reps: '6-10' },
      { name: 'Lunge', sets: '3', reps: '10-12' },
      { name: 'Leg Press', sets: '3', reps: '12-15' },
      { name: 'Romanian Deadlift', sets: '3', reps: '8-12' },
      { name: 'Calf Raise', sets: '3-4', reps: '15-20' },
    ]
  }
]

const activeDayData = computed(() =>
  days.find(d => d.number === activeDay.value) ?? null
)

const selectDay = (day: WorkoutDay) => {
  if (activeDay.value === day.number) {
    // Toggle off
    activeDay.value = null
    emit('clear')
    return
  }
  activeDay.value = day.number
  if (day.exercises.length === 0) {
    // Rest day – clear filter
    emit('clear')
  } else {
    emit('select', day.exercises.map(e => e.name))
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
