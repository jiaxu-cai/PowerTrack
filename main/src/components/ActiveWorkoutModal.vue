<template>
  <!-- Active Workout Confirmation Modal (Workouts Only) -->
  <Transition name="modal-fade">
    <div 
      v-if="show && isWorkout" 
      class="active-workout-modal"
    >
      <div class="modal-backdrop" @click.self="handleCancel">
        <div class="modal-content">
          <!-- Header -->
          <div class="modal-header-section">
            <div class="header-content">
              <div class="alert-icon-container">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <h2 class="modal-title">Active Workout Detected</h2>
            </div>
            <button class="modal-close-button" @click="handleCancel">
              <i class="bi bi-x"></i>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-body-section">
            <!-- Description -->
            <p class="modal-description">
              You currently have an active workout in progress. Starting a new workout will end your current session.
            </p>

            <!-- Current Workout Card -->
            <Transition name="card-fade">
              <div v-if="true" class="current-workout-card">
                <!-- Subtle background pattern -->
                <div class="card-background-pattern"></div>
                
                <div class="card-content">
                  <div class="card-label">CURRENT WORKOUT</div>
                  <h4 class="card-workout-name">{{ activeWorkoutData?.workoutName || 'Active Workout' }}</h4>

                  <div class="card-meta">
                    <div class="workout-type-badge">
                      <span>{{ getSourceTypeLabel(activeWorkoutData?.sourceType) }}</span>
                    </div>
                    <div class="elapsed-time">
                      <i class="bi bi-clock"></i>
                      <span>{{ formatDuration(activeWorkoutData?.elapsedTime || 0) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Question -->
            <p class="modal-question">What would you like to do?</p>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button 
                type="button" 
                class="action-button cancel-button"
                @click="handleCancel"
              >
                Cancel
              </button>
              <button 
                type="button" 
                class="action-button end-button"
                @click="handleEndWorkout"
                :disabled="ending"
              >
                <span v-if="ending" class="spinner-border spinner-border-sm me-2"></span>
                <span v-else>End Current Workout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { WorkoutStateService } from '../services/workoutStateService.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  onEndWorkout: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['cancel', 'end-workout'])

const ending = ref(false)
const activeWorkoutData = ref(null)

// Check if active workout is a workout (not a run)
const isWorkout = computed(() => {
  if (!activeWorkoutData.value) return false
  return activeWorkoutData.value.sourceType !== 'running-route'
})

const loadActiveWorkoutData = () => {
  activeWorkoutData.value = WorkoutStateService.getActiveWorkoutData()
}

watch(() => props.show, (newShow) => {
  if (newShow) {
    loadActiveWorkoutData()
  }
})

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

const getSourceTypeLabel = (sourceType) => {
  const labels = {
    'generated': 'Generated',
    'routine': 'Routine',
    'running-route': 'Running Route',
    'custom': 'Custom'
  }
  return labels[sourceType] || 'Workout'
}

const handleCancel = () => {
  emit('cancel')
  if (props.onCancel) {
    props.onCancel()
  }
}

const handleEndWorkout = async () => {
  ending.value = true
  try {
    emit('end-workout')
    if (props.onEndWorkout) {
      await props.onEndWorkout()
    }
  } catch (error) {
    console.error('Error ending workout:', error)
  } finally {
    ending.value = false
  }
}
</script>

<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.card-fade-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  transition-delay: 0.1s;
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

/* Modal Styles */
.active-workout-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1050;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-content {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 28rem;
  width: 100%;
  overflow: hidden;
}

/* Header Section */
.modal-header-section {
  padding: 2rem 2rem 1.5rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.alert-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(249, 115, 22, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon-container i {
  font-size: 1.25rem;
  color: #f97316;
}

.modal-title {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #030213;
  margin: 0;
  line-height: 1.3;
}

.modal-close-button {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.modal-close-button:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-close-button i {
  font-size: 1rem;
  color: #030213;
}

/* Body Section */
.modal-body-section {
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-description {
  font-size: 0.9375rem;
  opacity: 0.6;
  color: #030213;
  line-height: 1.6;
  margin: 0;
}

/* Current Workout Card */
.current-workout-card {
  position: relative;
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
  border-left: 4px solid #3b82f6;
  border-radius: 1rem;
  padding: 1.25rem;
  overflow: hidden;
}

.card-background-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 50%;
  filter: blur(3rem);
  pointer-events: none;
}

.card-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-label {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
  color: #030213;
  font-weight: 500;
}

.card-workout-name {
  font-size: 1.0625rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #030213;
  margin: 0;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.workout-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 9999px;
}

.workout-type-badge span {
  font-size: 0.8125rem;
  opacity: 0.7;
  color: #030213;
}

.elapsed-time {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  opacity: 0.7;
  color: #030213;
}

.elapsed-time i {
  font-size: 0.875rem;
}

/* Question */
.modal-question {
  font-size: 0.8125rem;
  opacity: 0.5;
  color: #030213;
  margin: 0;
  padding-top: 0.5rem;
}

/* Action Buttons */
.modal-actions {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

@media (min-width: 640px) {
  .modal-actions {
    flex-direction: row;
  }
}

.action-button {
  flex: 1;
  height: 3rem;
  border-radius: 9999px;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cancel-button {
  background: #ffffff;
  color: #030213;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.cancel-button:hover {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.end-button {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.end-button:hover:not(:disabled) {
  background: #dc2626;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.end-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Dark Mode Styles */
.dark .modal-content,
html.dark .modal-content {
  background: #1a1a1a !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .modal-title,
html.dark .modal-title {
  color: #ffffff !important;
}

.dark .modal-description,
html.dark .modal-description {
  color: rgba(255, 255, 255, 0.75) !important;
}

.dark .modal-question,
html.dark .modal-question {
  color: rgba(255, 255, 255, 0.7) !important;
}

.dark .modal-close-button,
html.dark .modal-close-button {
  background: rgba(255, 255, 255, 0.1) !important;
}

.dark .modal-close-button:hover,
html.dark .modal-close-button:hover {
  background: rgba(255, 255, 255, 0.15) !important;
}

.dark .modal-close-button i,
html.dark .modal-close-button i {
  color: rgba(255, 255, 255, 0.9) !important;
}

.dark .current-workout-card,
html.dark .current-workout-card {
  background: linear-gradient(to bottom right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1)) !important;
  border-left-color: #3b82f6 !important;
}

.dark .card-label,
html.dark .card-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.dark .card-workout-name,
html.dark .card-workout-name {
  color: #ffffff !important;
}

.dark .workout-type-badge,
html.dark .workout-type-badge {
  background: rgba(255, 255, 255, 0.15) !important;
}

.dark .workout-type-badge span,
html.dark .workout-type-badge span {
  color: rgba(255, 255, 255, 0.9) !important;
}

.dark .elapsed-time,
html.dark .elapsed-time {
  color: rgba(255, 255, 255, 0.8) !important;
}

.dark .cancel-button,
html.dark .cancel-button {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.dark .cancel-button:hover,
html.dark .cancel-button:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}
</style>
