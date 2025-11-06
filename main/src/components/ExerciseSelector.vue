<template>
  <div v-if="show" class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Select Exercise</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-4">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search exercises..." 
              v-model="searchQuery"
            >
            <button class="btn btn-outline-secondary" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
          <div class="exercise-selector-grid">
            <div 
              v-for="exercise in filteredExercises" 
              :key="exercise.exerciseId" 
              class="exercise-selector-card"
              @click="selectExercise(exercise)"
            >
              <div class="exercise-selector-content">
                <!-- Title Section -->
                <div class="exercise-selector-title-section">
                  <h6 class="exercise-selector-name">{{ exercise.name }}</h6>
                  <p class="exercise-selector-description">{{ exercise.description }}</p>
                </div>

                <!-- Badges -->
                <div class="exercise-selector-badges-grid">
                  <div class="badge-group">
                    <div class="badge-label">DIFFICULTY</div>
                    <span :class="getDifficultyBadgeClass(exercise.difficulty)" class="exercise-selector-badge">
                      {{ capitalizeFirst(exercise.difficulty) }}
                    </span>
                  </div>
                  <div class="badge-group">
                    <div class="badge-label">INTENSITY</div>
                    <span :class="getIntensityBadgeClass(exercise.intensity)" class="exercise-selector-badge">
                      {{ capitalizeFirst(exercise.intensity) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  exercises: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select'])

const searchQuery = ref('')

const filteredExercises = computed(() => {
  if (!searchQuery.value) return props.exercises
  
  const search = searchQuery.value.toLowerCase()
  return props.exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(search) ||
    exercise.description.toLowerCase().includes(search) ||
    exercise.muscle.some(m => m.toLowerCase().includes(search))
  )
})

const selectExercise = (exercise) => {
  emit('select', exercise)
  emit('close')
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getIntensityBadgeClass = (intensity) => {
  switch (String(intensity).toLowerCase()) {
    case 'low':
      return 'intensity-low'
    case 'medium':
      return 'intensity-medium'
    case 'high':
      return 'intensity-high'
    default:
      return 'intensity-default'
  }
}

const getDifficultyBadgeClass = (difficulty) => {
  switch (String(difficulty).toLowerCase()) {
    case 'beginner':
      return 'difficulty-beginner'
    case 'intermediate':
      return 'difficulty-intermediate'
    case 'advanced':
      return 'difficulty-advanced'
    default:
      return 'difficulty-default'
  }
}
</script>

<style scoped>
.modal-content {
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0;
}

.modal-body {
  padding: 1.5rem;
}

.input-group .form-control {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 48px;
  font-size: 0.9375rem;
}

.input-group .form-control:focus {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.input-group .btn-outline-secondary {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 48px;
  width: 48px;
}

/* Exercise Grid */
.exercise-selector-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 768px) {
  .exercise-selector-grid {
    grid-template-columns: 1fr;
  }
}

/* Exercise Card */
.exercise-selector-card {
  background: #ffffff;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 200px; /* Fixed height for consistency */
  width: 100%; /* Equal width */
}

.exercise-selector-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.1);
}

.exercise-selector-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

/* Title Section */
.exercise-selector-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4rem; /* Ensures consistent height for title/description */
}

.exercise-selector-name {
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #030213;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-selector-description {
  font-size: 0.8125rem;
  opacity: 0.5;
  color: #030213;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badges Grid */
.exercise-selector-badges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: auto;
}

.badge-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.4;
  color: #030213;
  font-weight: 500;
}

.exercise-selector-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid;
  width: fit-content;
}

/* Difficulty Colors */
.difficulty-beginner {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.2);
}

.difficulty-intermediate {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
  border-color: rgba(249, 115, 22, 0.2);
}

.difficulty-advanced {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.difficulty-default {
  background: rgba(0, 0, 0, 0.05);
  color: #030213;
  border-color: rgba(0, 0, 0, 0.1);
}

/* Intensity Colors */
.intensity-low {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.2);
}

.intensity-medium {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.2);
}

.intensity-high {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  border-color: rgba(236, 72, 153, 0.2);
}

.intensity-default {
  background: rgba(0, 0, 0, 0.05);
  color: #030213;
  border-color: rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
.dark .modal-content {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .modal-header {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.dark .modal-title {
  color: #ffffff;
}

.dark .exercise-selector-card {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .exercise-selector-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .exercise-selector-name {
  color: #ffffff;
}

.dark .exercise-selector-description {
  color: rgba(255, 255, 255, 0.6);
}

.dark .badge-label {
  color: rgba(255, 255, 255, 0.6);
}

.dark .difficulty-default,
.dark .intensity-default {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .input-group .form-control {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.dark .input-group .form-control:focus {
  border-color: rgba(255, 255, 255, 0.2);
}

.dark .input-group .btn-outline-secondary {
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
</style>

