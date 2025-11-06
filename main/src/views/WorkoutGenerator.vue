<template>
  <div class="workout-generator-view">
    <div class="generator-container">
      <!-- Page Header -->
      <Transition name="header-fade">
        <div v-if="true" class="page-header">
          <h1 class="page-title">Generate Your Workout</h1>
          <p class="page-subtitle">Create a personalized workout routine tailored to your profile</p>
        </div>
      </Transition>

      <!-- Preferences and Profile Grid -->
      <div class="preferences-grid">
        <!-- Workout Preferences Card -->
        <Transition name="section-fade">
          <div v-if="true" class="preferences-card">
            <h2 class="preferences-title">Workout Preferences</h2>

              <form @submit.prevent="generateWorkout">
              <!-- Duration & Intensity Row -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                <div class="group">
                  <label for="timeMin" class="app-label">Duration</label>
                  <div style="position: relative;">
                      <input 
                        type="number" 
                        id="timeMin" 
                      v-model.number="workoutForm.timeMin"
                        min="10" 
                        max="120" 
                        required
                      placeholder="45"
                      class="app-input"
                      style="padding-right: 3rem;"
                      >
                    <span style="position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); font-size: 0.8125rem; opacity: 0.4; pointer-events: none;">min</span>
                  </div>
                </div>

                <div class="group">
                  <label for="intensity" class="app-label">Intensity</label>
                  <select id="intensity" v-model="workoutForm.intensity" required class="app-select">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
              </div>

              <!-- Goal & Experience Row -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                <div class="group">
                  <label for="goal" class="app-label">Goal</label>
                  <select id="goal" v-model="workoutForm.goal" required class="app-select">
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="strength">Strength</option>
                      <option value="general_fitness">General Fitness</option>
                    </select>
                  </div>

                <div class="group">
                  <label for="experienceLevel" class="app-label">Experience Level</label>
                  <select id="experienceLevel" v-model="workoutForm.experienceLevel" required class="app-select">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              
                <!-- Target Muscle Groups -->
              <div class="muscle-groups-container">
                <label class="muscle-groups-label">
                  Target Muscle Groups <span>(Click to select)</span>
                  </label>
                <div class="muscle-badges">
                  <button
                    v-for="muscle in muscleGroups"
                    :key="muscle.value"
                    type="button"
                    @click="toggleMuscle(muscle.value)"
                    class="muscle-badge"
                    :class="{ selected: workoutForm.muscleGroups.includes(muscle.value) }"
                  >
                    {{ muscle.label }}
                  </button>
                  </div>
                </div>

              <!-- Generate Button -->
              <button 
                type="submit" 
                class="generate-button"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem; border-width: 2px;"></span>
                <i v-else class="bi bi-stars"></i>
                <span>{{ loading ? 'Generating...' : 'Generate Workout' }}</span>
              </button>
            </form>
          </div>
        </Transition>

        <!-- Profile Summary Card -->
        <Transition name="section-fade" style="--transition-delay: 0.1s">
          <div v-if="true" class="profile-summary-card">
            <h2 class="profile-summary-title">
              <i class="bi bi-person-circle"></i>
              Your Profile
            </h2>

              <div v-if="userProfile">
              <div class="profile-stat">
                <div class="profile-stat-icon">
                    <i class="bi bi-award"></i>
                </div>
                <div class="profile-stat-content">
                  <div class="profile-stat-label">Experience</div>
                  <div class="profile-stat-value">
                    {{ userProfile.experienceLevel === 'beginner' ? 'Beginner' : userProfile.experienceLevel === 'intermediate' ? 'Intermediate' : 'Advanced' }}
                  </div>
                    </div>
                </div>
                
              <div class="profile-stat">
                <div class="profile-stat-icon">
                    <i class="bi bi-trophy"></i>
                </div>
                <div class="profile-stat-content">
                  <div class="profile-stat-label">Fitness Goal</div>
                  <div class="profile-stat-value">
                    {{ formatGoal(userProfile.goal) }}
                  </div>
                    </div>
                </div>
                
              <div class="profile-stat">
                <div class="profile-stat-icon">
                    <i class="bi bi-clock-history"></i>
                  </div>
                <div class="profile-stat-content">
                  <div class="profile-stat-label">Preferred Time</div>
                  <div class="profile-stat-value">{{ userProfile.preferredTimeMin }} min</div>
                  </div>
                </div>
                
              <div class="profile-stat">
                <div class="profile-stat-icon">
                    <i class="bi bi-fire"></i>
                  </div>
                <div class="profile-stat-content">
                  <div class="profile-stat-label">Intensity Level</div>
                  <div class="profile-stat-value">
                    {{ userProfile.preferredIntensity === 'low' ? 'Low' : userProfile.preferredIntensity === 'medium' ? 'Medium' : 'High' }}
                    </div>
                </div>
              </div>
            </div>

            <div v-else style="text-align: center; padding: 2rem 0;">
              <i class="bi bi-person-circle" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
              <p style="font-size: 0.875rem; opacity: 0.6; margin-bottom: 1rem;">
                  {{ AuthService.getCurrentUser() ? 'Create your profile to see personalized stats' : 'Sign in to see your personalized stats' }}
                </p>
              <router-link 
                to="/profile" 
                class="app-input"
                style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; text-decoration: none; background: rgba(0, 0, 0, 0.05);"
              >
                <i class="bi" :class="AuthService.getCurrentUser() ? 'bi-person-plus' : 'bi-box-arrow-in-right'"></i>
                  {{ AuthService.getCurrentUser() ? 'Create Profile' : 'Sign In' }}
                </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Generated Workout Display -->
      <Transition name="section-fade" style="--transition-delay: 0.2s">
        <div v-if="generatedWorkout" class="generated-workout-card">
          <!-- Header Section with Title, Subtitle, and Clear Button -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem;">
            <div>
              <h2 class="generated-workout-title">Generated Workout</h2>
              <p class="generated-workout-summary">
                {{ generatedWorkout.routine.items.length }} exercises • {{ generatedWorkout.routine.totalTimeMin }} minutes
              </p>
            </div>
            <button
              class="regenerate-btn"
              @click="clearWorkout"
              title="Clear Workout"
            >
              <i class="bi bi-trash"></i>
            </button>
                </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 0.75rem; margin-bottom: 2rem;">
            <button
              class="workout-action-btn primary"
              @click="startWorkout"
              style="flex: 1;"
            >
              <i class="bi bi-play-fill"></i>
              <span class="btn-text-full">Start Workout</span>
              <span class="btn-text-short">Start</span>
                  </button>
            <button
              class="workout-action-btn secondary"
              @click="saveRoutine"
              :disabled="saving"
              style="flex: 1;"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm" style="width: 0.875rem; height: 0.875rem; border-width: 2px;"></span>
              <i v-else class="bi bi-bookmark"></i>
              <span class="btn-text-full">{{ saving ? 'Saving...' : 'Save Routine' }}</span>
              <span class="btn-text-short">{{ saving ? 'Saving...' : 'Save' }}</span>
                  </button>
              </div>
          
          <!-- Exercise List -->
          <div class="exercise-list">
                  <div 
                    v-for="(item, index) in sortedExercises" 
                    :key="item.exerciseId"
              class="exercise-list-item"
            >
              <div class="exercise-item-content">
                <!-- Exercise Number Circle -->
                <div class="exercise-number-circle">
                  <span>{{ index + 1 }}</span>
                            </div>
                
                <!-- Exercise Name -->
                <h4 class="exercise-name">{{ getExerciseName(item.exerciseId) }}</h4>
                
                <!-- Exercise Stats (Right Side on Desktop, Below on Mobile) -->
                <div class="exercise-stats">
                  <div class="exercise-stat-item">
                    <div class="exercise-stat-value">{{ item.sets }}</div>
                    <div class="exercise-stat-label">SETS</div>
                            </div>
                  <div class="exercise-stat-item">
                    <div class="exercise-stat-value">{{ item.reps }}</div>
                    <div class="exercise-stat-label">REPS</div>
                          </div>
                  <div class="exercise-stat-item">
                    <div class="exercise-stat-value">{{ item.restTimeSec }}s</div>
                    <div class="exercise-stat-label">REST</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      </div>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="notification.show" class="notification-container">
          <div class="notification" :class="`notification-${notification.type}`">
            <i class="bi" :class="notification.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'"></i>
            <span>{{ notification.message }}</span>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Active Workout Confirmation Modal -->
    <ActiveWorkoutModal 
      :show="showActiveWorkoutModal" 
      @cancel="handleCancelActiveWorkout"
      @end-workout="handleEndActiveWorkout"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'
import { WorkoutStateService } from '../services/workoutStateService.js'
import ActiveWorkoutModal from '../components/ActiveWorkoutModal.vue'
import { getErrorMessage } from '../utils/errorHandler.js'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const userProfile = ref(null)
const generatedWorkout = ref(null)
const notification = ref({ show: false, message: '', type: 'success' })
const showActiveWorkoutModal = ref(false)
const pendingWorkoutData = ref(null)

const muscleGroups = [
  { label: 'Chest', value: 'chest' },
  { label: 'Back', value: 'back' },
  { label: 'Shoulders', value: 'shoulders' },
  { label: 'Bicep', value: 'biceps' },
  { label: 'Tricep', value: 'triceps' },
  { label: 'Legs', value: 'legs' },
  { label: 'Core', value: 'core' },
  { label: 'Cardio', value: 'cardio' }
]

const workoutForm = ref({
  timeMin: 30,
  intensity: 'medium',
  goal: 'general_fitness',
  experienceLevel: 'beginner',
  muscleGroups: []
})

// Format goal for display
const formatGoal = (goal) => {
  if (!goal) return ''
  const goalMap = {
    'weight_loss': 'Weight Loss',
    'muscle_gain': 'Muscle Gain',
    'endurance': 'Endurance',
    'strength': 'Strength',
    'general_fitness': 'General Fitness'
  }
  return goalMap[goal] || goal.charAt(0).toUpperCase() + goal.slice(1).replace('_', ' ')
}

// Toggle muscle group selection
const toggleMuscle = (muscle) => {
  const index = workoutForm.value.muscleGroups.indexOf(muscle)
  if (index > -1) {
    workoutForm.value.muscleGroups.splice(index, 1)
  } else {
    workoutForm.value.muscleGroups.push(muscle)
  }
}

// Load user data
const initializeForm = () => {
  if (userProfile.value) {
    workoutForm.value = {
      timeMin: userProfile.value.preferredTimeMin || 30,
      intensity: userProfile.value.preferredIntensity || 'medium',
      goal: userProfile.value.goal || 'general_fitness',
      experienceLevel: userProfile.value.experienceLevel || 'beginner',
      muscleGroups: []
    }
  }
}

// Toast messages
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

onMounted(async () => {
  await loadUserProfile()
  initializeForm()
  loadDraftWorkout()
  
  // Listen for auth state changes
  AuthService.onAuthStateChanged(async (user) => {
    if (user) {
      await loadUserProfile()
    } else {
      userProfile.value = null
    }
  })
})

// Load user profile with proper auth checking
const loadUserProfile = async () => {
  try {
    const currentUser = AuthService.getCurrentUser()
    if (currentUser) {
  userProfile.value = await AuthService.getCurrentUserProfile()
    } else {
      userProfile.value = null
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userProfile.value = null
  }
}

// Load draft workout state from localStorage
const loadDraftWorkout = () => {
  try {
    const draftKey = 'draftWorkoutState'
    const generatedKey = 'draftGeneratedWorkout'
    
    // Load draft workout form state
    const draftState = JSON.parse(localStorage.getItem(draftKey) || 'null')
    if (draftState) {
      workoutForm.value = { ...workoutForm.value, ...draftState }
    }
    
    // Always load generated workout if it exists - persist across page navigation
    const generatedWorkoutData = JSON.parse(localStorage.getItem(generatedKey) || 'null')
    if (generatedWorkoutData && generatedWorkoutData.routine) {
      generatedWorkout.value = generatedWorkoutData
    }
  } catch (error) {
    console.error('Error loading draft workout:', error)
  }
}

// Save draft workout state to localStorage
const saveDraftWorkout = () => {
  try {
    const draftKey = 'draftWorkoutState'
    const generatedKey = 'draftGeneratedWorkout'
    
    // Save workout form state
    localStorage.setItem(draftKey, JSON.stringify(workoutForm.value))
    
    // Save generated workout if it exists
    if (generatedWorkout.value) {
      localStorage.setItem(generatedKey, JSON.stringify(generatedWorkout.value))
    }
  } catch (error) {
    console.error('Error saving draft workout:', error)
  }
}

// Clear draft workout state
const clearDraftWorkout = () => {
  try {
    localStorage.removeItem('draftWorkoutState')
    localStorage.removeItem('draftGeneratedWorkout')
  } catch (error) {
    console.error('Error clearing draft workout:', error)
  }
}

// Watch for changes in workout form and save draft state
watch(workoutForm, () => {
  saveDraftWorkout()
}, { deep: true })

// Watch for changes in generated workout and save draft state
watch(generatedWorkout, (newValue) => {
  // Only save if there's actually a workout (not when clearing)
  if (newValue && newValue.routine) {
  saveDraftWorkout()
  }
}, { deep: true })

// Computed property for sorted exercises (most intensive/difficult first)
const sortedExercises = computed(() => {
  if (!generatedWorkout.value) return []
  
  return [...generatedWorkout.value.routine.items].sort((a, b) => {
    // Get exercise details for intensity and difficulty comparison
    const exerciseA = generatedWorkout.value.exercises.find(ex => ex.exerciseId === a.exerciseId)
    const exerciseB = generatedWorkout.value.exercises.find(ex => ex.exerciseId === b.exerciseId)
    
    if (!exerciseA || !exerciseB) return 0
    
    // Define intensity order (high > medium > low)
    const intensityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
    const difficultyOrder = { 'advanced': 3, 'intermediate': 2, 'beginner': 1 }
    
    // First sort by intensity (descending)
    const intensityDiff = intensityOrder[exerciseB.intensity] - intensityOrder[exerciseA.intensity]
    if (intensityDiff !== 0) return intensityDiff
    
    // Then sort by difficulty (descending)
    const difficultyDiff = difficultyOrder[exerciseB.difficulty] - difficultyOrder[exerciseA.difficulty]
    if (difficultyDiff !== 0) return difficultyDiff
    
    // Finally sort by exercise name for consistency
    return exerciseA.name.localeCompare(exerciseB.name)
  })
})

const generateWorkout = async () => {
  loading.value = true
  try {
    const result = await WorkoutService.generateWorkout(workoutForm.value)
    generatedWorkout.value = result
    // Explicitly save the generated workout immediately
    saveDraftWorkout()
    showNotification('Workout generated successfully!', 'success')
  } catch (error) {
    console.error('Error generating workout:', error)
    showNotification(getErrorMessage(error, 'Failed to generate workout. Please try again.'), 'error')
  } finally {
    loading.value = false
  }
}

const getExerciseName = (exerciseId) => {
  if (!generatedWorkout.value) return 'Unknown'
  const exercise = generatedWorkout.value.exercises.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.name : 'Unknown Exercise'
}

const saveRoutine = async () => {
  if (!generatedWorkout.value) return
  
  saving.value = true
  try {
    const routineData = {
      title: "Generated Workout",
      goal: generatedWorkout.value.routine.goal,
      estimatedTimeMinutes: generatedWorkout.value.routine.totalTimeMin,
      intendedIntensity: generatedWorkout.value.routine.intensity,
      exercises: generatedWorkout.value.routine.items.map(item => ({
        exerciseId: item.exerciseId,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restTimeSec
      }))
    }
    
    await WorkoutService.createRoutine(routineData)
    showNotification('Routine saved successfully!', 'success')
    // Don't clear the generated workout - let user start it later
  } catch (error) {
    console.error('Error saving routine:', error)
    showNotification(getErrorMessage(error, 'Failed to save routine. Please try again.'), 'error')
  } finally {
    saving.value = false
  }
}

const startWorkout = () => {
  if (!generatedWorkout.value) return
  
  // Check if there's an active workout
  if (WorkoutStateService.checkActiveWorkout()) {
    // Store the workout data to start after confirmation
    pendingWorkoutData.value = {
      title: "Generated Workout",
      goal: generatedWorkout.value.routine.goal,
      estimatedTimeMinutes: generatedWorkout.value.routine.totalTimeMin,
      intendedIntensity: generatedWorkout.value.routine.intensity,
      exercises: generatedWorkout.value.routine.items.map(item => ({
        exerciseId: item.exerciseId,
        sets: item.sets,
        reps: item.reps,
        restSeconds: item.restTimeSec,
        completed: false
      })),
      sourceType: 'generated',
      sourceId: generatedWorkout.value.routine.routineId
    }
    
    // Show confirmation modal
    showActiveWorkoutModal.value = true
    return
  }
  
  // No active workout, proceed normally
  proceedWithWorkout()
}

const proceedWithWorkout = () => {
  if (!generatedWorkout.value) return
  
  // Format workout data
  const workoutData = {
    title: "Generated Workout",
    goal: generatedWorkout.value.routine.goal,
    estimatedTimeMinutes: generatedWorkout.value.routine.totalTimeMin,
    intendedIntensity: generatedWorkout.value.routine.intensity,
    exercises: generatedWorkout.value.routine.items.map(item => ({
      exerciseId: item.exerciseId,
      sets: item.sets,
      reps: item.reps,
      restSeconds: item.restTimeSec,
      completed: false
    }))
  }
  
  router.push({
    name: 'WorkoutTracking',
    query: {
      workoutData: JSON.stringify(workoutData),
      sourceType: 'generated',
      sourceId: generatedWorkout.value.routine.routineId
    }
  })
  
  clearDraftWorkout() // Clear draft state when starting workout
}

const handleCancelActiveWorkout = () => {
  showActiveWorkoutModal.value = false
  pendingWorkoutData.value = null
}

const handleEndActiveWorkout = async () => {
  showActiveWorkoutModal.value = false
  
  // Clear the active workout state
  WorkoutStateService.clearActiveWorkout()
  
  // Proceed with the new workout
  if (pendingWorkoutData.value) {
    const { sourceType, sourceId, ...workoutData } = pendingWorkoutData.value
    
    router.push({
      name: 'WorkoutTracking',
      query: {
        workoutData: JSON.stringify(workoutData),
        sourceType: sourceType,
        sourceId: sourceId
      }
    })
    
    clearDraftWorkout() // Clear draft state when starting workout
    pendingWorkoutData.value = null
  }
}

const clearWorkout = () => {
  generatedWorkout.value = null
  // Don't clear draft state - keep it so user can regenerate or come back to it
  // Only clear the display, not the saved state
  localStorage.removeItem('draftGeneratedWorkout')
  showNotification('Workout cleared successfully!', 'success')
}
</script>

<style scoped>
.exercise-list {
  display: flex;
  flex-direction: column;
}

.group {
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.header-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: 0s;
}

.header-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.section-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--transition-delay, 0.1s);
}

.section-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .workout-action-btn span.btn-text-full {
    display: none;
  }

  .workout-action-btn span.btn-text-short {
    display: inline;
  }
}

@media (max-width: 480px) {
  .workout-action-btn span.btn-text-short {
    display: none;
  }

  .workout-action-btn.icon-only {
    width: 2.5rem;
    padding: 0;
    justify-content: center;
  }
}
</style>