<template>
  <div 
    class="exercise-card-view"
    :style="{ '--transition-delay': delay + 's' }"
  >
    <!-- Image Placeholder -->
    <div class="exercise-image-placeholder">
      <div class="image-content">
        <div class="image-circle"></div>
        <svg class="image-wave" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 50 L40 30 L60 50 L80 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <img 
        v-if="imageSrc && imageSrc !== unavailableUri"
        :src="imageSrc" 
        :alt="exercise.name"
        class="exercise-image"
        :class="{ 'image-loaded': imageLoaded }"
        @error="handleImageError"
        @load="handleImageLoad"
        loading="lazy"
      />
    </div>

    <!-- Content -->
    <div class="exercise-content">
      <!-- Title -->
      <div class="exercise-title-section">
        <h3 class="exercise-name">{{ exercise.name }}</h3>
        <p class="exercise-description">{{ exercise.description }}</p>
      </div>

      <!-- Badges -->
      <div class="exercise-badges-grid">
        <div class="badge-group">
          <div class="badge-label">DIFFICULTY</div>
          <span :class="getDifficultyBadgeClass(exercise.difficulty)" class="exercise-badge">
            {{ capitalizeFirst(exercise.difficulty) }}
          </span>
        </div>
        <div class="badge-group">
          <div class="badge-label">INTENSITY</div>
          <span :class="getIntensityBadgeClass(exercise.intensity)" class="exercise-badge">
            {{ capitalizeFirst(exercise.intensity) }}
          </span>
        </div>
      </div>

      <!-- Muscles -->
      <div class="exercise-info-section">
        <div class="info-label">MUSCLES:</div>
        <div class="info-pills">
          <span v-for="muscle in exercise.muscle" :key="muscle" class="info-pill">
            {{ formatTitleCase(muscle) }}
          </span>
        </div>
      </div>

      <!-- Equipment -->
      <div class="exercise-info-section">
        <div class="info-label">EQUIPMENT:</div>
        <div class="info-pills">
          <span v-for="eq in exercise.equipment" :key="eq" class="info-pill">
            {{ formatEquipment(eq) }}
          </span>
        </div>
      </div>

      <!-- Add to Routine Button -->
      <div class="button-container">
        <button class="add-to-routine-btn" @click.stop="$emit('addToRoutine', exercise)">
          <i class="bi bi-plus"></i>
          Add to Routine
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { resolveExerciseImage, UNAVAILABLE_DATA_URI } from '../services/imageResolver.js'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  }
})

defineEmits(['addToRoutine'])

const unavailableUri = UNAVAILABLE_DATA_URI
const imageSrc = ref(null)
const imageLoaded = ref(false)

// Update image source when exercise changes
watch(() => props.exercise?.exerciseId, () => {
  imageLoaded.value = false
  imageSrc.value = resolveExerciseImage(props.exercise?.exerciseId, props.exercise)
}, { immediate: true })

const handleImageError = (e) => {
  if (!e || !e.target) return
  if (e.target.src !== UNAVAILABLE_DATA_URI) {
    imageSrc.value = UNAVAILABLE_DATA_URI
    e.target.src = UNAVAILABLE_DATA_URI
  }
}

const handleImageLoad = (e) => {
  if (!e || !e.target) return
  imageLoaded.value = true
}

const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const formatTitleCase = (str) => {
  if (!str) return ''
  // Replace underscores with spaces and handle special cases
  let formatted = str.replace(/_/g, ' ')
  
  // Special case: Full_body or full_body should be "Full Body"
  if (formatted.toLowerCase() === 'full body' || formatted.toLowerCase() === 'fullbody') {
    return 'Full Body'
  }
  
  // Split by spaces and capitalize each word
  return formatted.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatEquipment = (str) => {
  if (!str) return ''
  // Replace underscores with spaces
  let formatted = str.replace(/_/g, ' ')
  
  // Split by spaces and capitalize each word properly
  return formatted.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
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

<style>
/* Global styles - not scoped so dark mode works */
.exercise-card-view {
  background: #ffffff;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
  animation: cardEnter 0.5s ease forwards;
  animation-delay: var(--transition-delay, 0s);
  opacity: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.exercise-card-view:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Image Placeholder */
.exercise-image-placeholder {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}

.image-content {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.image-circle {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.image-wave {
  position: absolute;
  width: 8rem;
  height: 8rem;
  color: rgba(0, 0, 0, 0.1);
}

.exercise-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.3s ease;
  will-change: opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.exercise-image.image-loaded {
  opacity: 1;
}

/* Content */
.exercise-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

/* Title Section */
.exercise-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 4.5rem; /* Ensures consistent height for title/description */
}

.exercise-name {
  font-size: 1.1875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #030213;
  margin: 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.exercise-description {
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
  transition: color 0.3s ease;
}

/* Badges Grid */
.exercise-badges-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
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
  transition: color 0.3s ease;
}

.exercise-badge {
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

/* Info Sections */
.exercise-info-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 3rem; /* Ensures consistent height for info sections */
}

.info-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.4;
  color: #030213;
  font-weight: 500;
  transition: color 0.3s ease;
}

.info-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.info-pill {
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 9999px;
  color: #030213;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Button Container - pushes button to bottom */
.button-container {
  margin-top: auto;
  padding-top: 0.5rem;
}

/* Add to Routine Button */
.add-to-routine-btn {
  width: 100%;
  height: 2.75rem;
  border-radius: 9999px;
  background: #030213;
  color: #ffffff;
  border: none;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.add-to-routine-btn:hover {
  background: #000000;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.add-to-routine-btn i {
  font-size: 1rem;
}
</style>
