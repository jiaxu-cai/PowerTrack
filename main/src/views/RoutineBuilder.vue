<template>
  <div class="routine-page">
    <!-- Main Content stacked -->
    <div class="content-container">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">Routine Builder</h1>
        <p class="page-subtitle">Create and manage your custom workout routines</p>
      </div>
      <div class="card mb-4">
          <div class="card-header">
            <h4 class="card-title">{{ editingRoutine ? 'Edit Routine' : 'Create New Routine' }}</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveRoutine">
              <div class="mb-3">
                <label for="title" class="form-label">Routine Title</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="title" 
                  v-model="routineForm.title"
                  required
                  placeholder="e.g. Upper Body Strength"
                >
              </div>

              <div class="row mb-3">
                <div class="col-md-4">
                  <label for="goal" class="form-label">Goal</label>
                  <select class="form-select" id="goal" v-model="routineForm.goal" required>
                    <option value="fat_loss">Fat Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Endurance</option>
                    <option value="strength">Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label for="estimatedTime" class="form-label">Estimated Time (min)</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    id="estimatedTime" 
                    v-model="routineForm.estimatedTimeMinutes"
                    min="10" 
                    max="180" 
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="intensity" class="form-label">Intensity</label>
                  <select class="form-select" id="intensity" v-model="routineForm.intendedIntensity" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <!-- exercises user is adding -->
              <div class="mb-4">
                <div class="exercises-header-with-button mb-3">
                  <h5 class="section-title">Exercises ({{ routineForm.exercises.length }})</h5>
                  <button type="button" class="btn btn-outline-dark btn-add-exercise-desktop" @click="showExerciseSelector = true">
                    Add Exercise
                  </button>
                </div>

                <div v-if="routineForm.exercises.length === 0" class="empty-state-box empty-exercises-mobile">
                  <p class="mb-1">No exercises added yet</p>
                  <small class="text-muted">Browse the exercise library and select exercises to build your routine</small>
                </div>

                <transition-group name="list-fade" tag="div" v-else class="exercise-list-container mb-3">
                  <ExerciseForm 
                    v-for="(exercise, index) in routineForm.exercises" 
                    :key="exercise.exerciseId + '-' + index"
                    :exercise-name="getExerciseName(exercise.exerciseId)"
                    :exercise-description="getExerciseDescription(exercise.exerciseId)"
                    v-model:sets="exercise.sets"
                    v-model:reps="exercise.reps"
                    v-model:rest-seconds="exercise.restSeconds"
                    v-model:notes="exercise.notes"
                    :index="index"
                    @remove="removeExercise(index)"
                  />
                </transition-group>

                <!-- Add Exercise button for mobile (below exercises) -->
                <button type="button" class="btn btn-outline-dark w-100 btn-add-exercise-mobile" @click="showExerciseSelector = true">
                  Add Exercise
                </button>
              </div>

              <div class="d-flex gap-2 button-group-full">
                <button type="button" class="btn btn-outline-secondary flex-1" @click="cancelEdit">Clear All</button>
                <button type="submit" class="btn btn-dark flex-1" :disabled="saving || routineForm.exercises.length === 0">
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ saving ? 'Saving...' : (editingRoutine ? 'Update Routine' : 'Create Routine') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- saved routines -->
        <div class="saved-routines-section">
          <div class="routines-header mb-4">
            <h2 class="routines-title">My Routines</h2>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else-if="routines.length === 0" class="empty-routines">
            <div class="empty-content">
              <p class="empty-title">No routines yet</p>
              <p class="empty-subtitle">Create your first routine to start tracking your workouts</p>
            </div>
          </div>

          <!-- Desktop/Tablet Grid View -->
          <div v-else class="routines-grid d-none d-sm-grid">
            <div v-for="routine in routines" :key="routine.routineId" class="routine-card">
              <div class="routine-card-content">
                <div class="routine-card-header mb-3">
                  <div class="title-section">
                    <div class="title-row">
                      <h3 class="routine-card-title">{{ routine.title }}</h3>
                      <div class="dropdown" :class="{ show: openDropdownId === routine.routineId }">
                        <button 
                          class="btn-menu" 
                          type="button" 
                          :id="`dropdown-btn-${routine.routineId}`"
                          @click.stop="toggleDropdown(routine.routineId)"
                          :aria-expanded="openDropdownId === routine.routineId"
                          aria-haspopup="true"
                        >⋯</button>
                        <ul 
                          class="dropdown-menu dropdown-menu-end" 
                          :class="{ show: openDropdownId === routine.routineId }"
                          :aria-labelledby="`dropdown-btn-${routine.routineId}`"
                        >
                          <li><a class="dropdown-item" href="#" @click.prevent="closeDropdown(); editRoutine(routine)">Edit Routine</a></li>
                          <li><a class="dropdown-item text-danger" href="#" @click.prevent="closeDropdown(); deleteRoutine(routine.routineId)">Delete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div class="routine-meta">
                      <span class="text-capitalize">{{ routine.goal.replace('_', ' ') }}</span>
                      <span class="meta-separator">•</span>
                      <span class="text-capitalize">{{ routine.intendedIntensity }}</span>
                    </div>
                  </div>
                </div>

                <div class="routine-stats mb-4">
                  <div class="stat-item">
                    <span class="stat-value">{{ routine.exercises.length }}</span>
                    <span class="stat-text">exercises</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ routine.estimatedTimeMinutes }}</span>
                    <span class="stat-text">min</span>
                  </div>
                </div>

                <button class="btn btn-start w-100" @click="startWorkoutFromRoutine(routine)">
                  Start Workout
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile List View -->
          <div v-if="routines.length > 0" class="routines-list d-sm-none">
            <div v-for="routine in routines" :key="routine.routineId" class="routine-card-mobile">
              <div class="routine-card-content-mobile">
                <div class="routine-card-header-mobile mb-3">
                  <div class="title-section-mobile">
                    <div class="title-row-mobile">
                      <h3 class="routine-card-title-mobile">{{ routine.title }}</h3>
                      <div class="dropdown" :class="{ show: openDropdownId === routine.routineId }">
                        <button 
                          class="btn-menu-mobile" 
                          type="button" 
                          :id="`dropdown-btn-mobile-${routine.routineId}`"
                          @click.stop="toggleDropdown(routine.routineId)"
                          :aria-expanded="openDropdownId === routine.routineId"
                          aria-haspopup="true"
                        >⋯</button>
                        <ul 
                          class="dropdown-menu dropdown-menu-end" 
                          :class="{ show: openDropdownId === routine.routineId }"
                          :aria-labelledby="`dropdown-btn-mobile-${routine.routineId}`"
                        >
                          <li><a class="dropdown-item" href="#" @click.prevent="closeDropdown(); editRoutine(routine)">Edit</a></li>
                          <li><a class="dropdown-item text-danger" href="#" @click.prevent="closeDropdown(); deleteRoutine(routine.routineId)">Delete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div class="routine-meta-mobile">
                      <span class="text-capitalize">{{ routine.goal.replace('_', ' ') }}</span>
                      <span class="meta-separator-mobile">•</span>
                      <span class="text-capitalize">{{ routine.intendedIntensity }}</span>
                    </div>
                  </div>
                </div>

                <div class="routine-stats-mobile mb-3">
                  <div class="stat-item-mobile">
                    <span class="stat-value-mobile">{{ routine.exercises.length }}</span>
                    <span class="stat-text-mobile">exercises</span>
                  </div>
                  <div class="stat-item-mobile">
                    <span class="stat-value-mobile">{{ routine.estimatedTimeMinutes }}</span>
                    <span class="stat-text-mobile">min</span>
                  </div>
                </div>

                <button class="btn btn-start-mobile w-100" @click="startWorkoutFromRoutine(routine)">
                  Start Workout
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- popup to pick exercises -->
    <ExerciseSelector 
      :show="showExerciseSelector"
      :exercises="exercises"
      @close="showExerciseSelector = false"
      @select="addExerciseToRoutine"
    />

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

    <!-- Delete Confirmation Modal -->
    <Transition name="fade">
      <div v-if="deleteConfirmation.show" class="user-profile-view">
        <div class="app-modal-backdrop app-modal-backdrop-centered" @click.self="cancelDeleteRoutine">
          <div class="app-modal">
            <div class="app-modal-header">
              <h5 class="app-modal-title">Confirm Delete</h5>
              <button class="app-modal-close" @click="cancelDeleteRoutine">
                <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
              </button>
            </div>
            <div class="app-modal-body">
              <p class="mb-3">Are you sure you want to delete this routine?</p>
              <div class="workout-summary-box">
                <strong>{{ deleteConfirmation.routineTitle }}</strong>
              </div>
              <p class="text-muted mt-2 mb-0">
                <small>This action cannot be undone.</small>
              </p>

              <div class="workout-modal-actions">
                <button 
                  type="button" 
                  class="app-modal-cancel-btn"
                  @click="cancelDeleteRoutine"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  class="app-modal-end-btn"
                  @click="confirmDeleteRoutine"
                >
                  Delete Routine
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseForm from '../components/ExerciseForm.vue'
import ExerciseSelector from '../components/ExerciseSelector.vue'
import { getErrorMessage } from '../utils/errorHandler.js'

const router = useRouter()

const loading = ref(false)
const saving = ref(false)
const routines = ref([])
const exercises = ref([])
const showExerciseSelector = ref(false)
const editingRoutine = ref(null)
const openDropdownId = ref(null)

// Toast notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

// Delete confirmation state
const deleteConfirmation = ref({
  show: false,
  routineId: null,
  routineTitle: ''
})

const routineForm = ref({
  title: '',
  goal: 'general_fitness',
  estimatedTimeMinutes: 45,
  intendedIntensity: 'medium',
  exercises: []
})

const toggleDropdown = (routineId) => {
  if (openDropdownId.value === routineId) {
    openDropdownId.value = null
  } else {
    openDropdownId.value = routineId
  }
}

const closeDropdown = () => {
  openDropdownId.value = null
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown')) {
    closeDropdown()
  }
}

onMounted(async () => {
  await loadRoutines()
  await loadExercises()
  loadDraftRoutine()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(routineForm, () => {
  saveDraftRoutine()
}, { deep: true })

// Load draft routine state from localStorage
const loadDraftRoutine = () => {
  try {
    const draftKey = 'draftRoutineState'
    const exerciseKey = 'draftRoutineExercises'
    
    // Load draft routine form state
    const draftState = JSON.parse(localStorage.getItem(draftKey) || 'null')
    if (draftState) {
      routineForm.value = { ...routineForm.value, ...draftState }
    }
    
    // Load draft exercises from Exercise Library
    const draftExercises = JSON.parse(localStorage.getItem(exerciseKey) || '[]')
    if (draftExercises.length > 0) {
      draftExercises.forEach(draft => {
        // Check if exercise already exists to avoid duplicates
        const exists = routineForm.value.exercises.some(ex => ex.exerciseId === draft.exerciseId)
        if (!exists) {
          routineForm.value.exercises.push({
            exerciseId: draft.exerciseId,
            sets: draft.sets || 3,
            reps: draft.reps || '8-12',
            restSeconds: draft.restSeconds || 60,
            notes: draft.notes || ''
          })
        }
      })
      
      // Clear the exercise library localStorage after loading
      localStorage.removeItem(exerciseKey)
      
      showNotification(`${draftExercises.length} exercise(s) added from Exercise Library!`, 'success')
    }
    
    // Show notification if there's a draft routine
    if (draftState || draftExercises.length > 0) {
      // Silent loading - no notification needed
    }
  } catch (error) {
    console.error('Error loading draft routine:', error)
  }
}

// Save draft routine state to localStorage
const saveDraftRoutine = () => {
  try {
    const draftKey = 'draftRoutineState'
    const draftState = {
      title: routineForm.value.title,
      goal: routineForm.value.goal,
      estimatedTimeMinutes: routineForm.value.estimatedTimeMinutes,
      intendedIntensity: routineForm.value.intendedIntensity,
      exercises: routineForm.value.exercises
    }
    localStorage.setItem(draftKey, JSON.stringify(draftState))
  } catch (error) {
    console.error('Error saving draft routine:', error)
  }
}

// Clear draft routine state
const clearDraftRoutine = () => {
  try {
    localStorage.removeItem('draftRoutineState')
    localStorage.removeItem('draftRoutineExercises')
  } catch (error) {
    console.error('Error clearing draft routine:', error)
  }
}

// Toast notification function
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const loadRoutines = async () => {
  loading.value = true
  try {
    routines.value = await WorkoutService.getUserRoutines()
    closeDropdown()
  } catch (error) {
    console.error('Error loading routines:', error)
    showNotification(getErrorMessage(error, 'Failed to load routines. Please try again.'), 'error')
  } finally {
    loading.value = false
  }
}

const loadExercises = async () => {
  try {
    exercises.value = await WorkoutService.getExercises()
  } catch (error) {
    console.error('Error loading exercises:', error)
  }
}

const getExerciseName = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.name : 'Unknown Exercise'
}

const getExerciseDescription = (exerciseId) => {
  const exercise = exercises.value.find(ex => ex.exerciseId === exerciseId)
  return exercise ? exercise.description : ''
}

const addExerciseToRoutine = (exercise) => {
  routineForm.value.exercises.push({
    exerciseId: exercise.exerciseId,
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    notes: ''
  })
  showExerciseSelector.value = false
  saveDraftRoutine() // Save draft state
}

const removeExercise = (index) => {
  routineForm.value.exercises.splice(index, 1)
  saveDraftRoutine() // Save draft state
}

const saveRoutine = async () => {
  saving.value = true
  try {
    if (editingRoutine.value) {
      await WorkoutService.updateRoutine({
        routineId: editingRoutine.value.routineId,
        ...routineForm.value
      })
      showNotification('Routine updated successfully!', 'success')
    } else {
      await WorkoutService.createRoutine(routineForm.value)
      showNotification('Routine created successfully!', 'success')
    }
    
    await loadRoutines()
    resetForm()
    clearDraftRoutine() // Clear draft state after successful save
  } catch (error) {
    console.error('Error saving routine:', error)
    showNotification(getErrorMessage(error, 'Failed to save routine. Please try again.'), 'error')
  } finally {
    saving.value = false
  }
}

const editRoutine = (routine) => {
  closeDropdown()
  editingRoutine.value = routine
  routineForm.value = {
    title: routine.title,
    goal: routine.goal,
    estimatedTimeMinutes: routine.estimatedTimeMinutes,
    intendedIntensity: routine.intendedIntensity,
    exercises: routine.exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      sets: ex.sets,
      reps: ex.reps,
      restSeconds: ex.restSeconds,
      notes: ex.notes || ''
    }))
  }
}

const deleteRoutine = async (routineId) => {
  const routine = routines.value.find(r => r.routineId === routineId)
  if (routine) {
    deleteConfirmation.value = {
      show: true,
      routineId: routineId,
      routineTitle: routine.title
    }
  }
}

const confirmDeleteRoutine = async () => {
  try {
    await WorkoutService.deleteRoutine(deleteConfirmation.value.routineId)
    showNotification('Routine deleted successfully!', 'success')
    await loadRoutines()
  } catch (error) {
    console.error('Error deleting routine:', error)
    showNotification(getErrorMessage(error, 'Failed to delete routine. Please try again.'), 'error')
  } finally {
    deleteConfirmation.value.show = false
  }
}

const cancelDeleteRoutine = () => {
  deleteConfirmation.value.show = false
}

const startWorkoutFromRoutine = (routine) => {
  // Format workout data for WorkoutTracking
  const workoutData = {
    title: routine.title,
    goal: routine.goal,
    estimatedTimeMinutes: routine.estimatedTimeMinutes,
    intendedIntensity: routine.intendedIntensity,
    exercises: routine.exercises.map(exercise => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets,
      reps: exercise.reps,
      restSeconds: exercise.restSeconds,
      completed: false
    }))
  }
  
  // Navigate to WorkoutTracking with routine data
  router.push({
    name: 'WorkoutTracking',
    query: {
      workoutData: JSON.stringify(workoutData),
      sourceType: 'routine',
      sourceId: routine.routineId
    }
  })
}

const cancelEdit = () => {
  editingRoutine.value = null
  resetForm()
  clearDraftRoutine() // Clear draft state when canceling
}

const resetForm = () => {
  routineForm.value = {
    title: '',
    goal: 'general_fitness',
    estimatedTimeMinutes: 45,
    intendedIntensity: 'medium',
    exercises: []
  }
}
</script>

<style scoped>
.routine-page {
  min-height: 100vh;
  background: #fbfbfd;
  transition: background 0.3s ease;
}
.routine-page .form-control,
.routine-page .form-select {
  background: var(--input-background);
  border-color: transparent;
  border-radius: 12px;
  height: 48px;
}

.routine-page .form-control:focus,
.routine-page .form-select:focus {
  box-shadow: 0 0 0 2px var(--ring);
}

.routine-page .card {
  border-radius: 24px;
  border: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.routine-page .form-label {
  font-size: 13px;
  opacity: 0.6;
  margin-bottom: 0.5rem;
}

.exercises-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.exercises-header-with-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-add-exercise-desktop {
  display: block;
  height: 40px;
  padding: 0 1.5rem;
  border-radius: 12px;
}

.btn-add-exercise-mobile {
  display: none;
}

.exercise-list-container {
  display: contents;
}

/* Mobile responsive styles */
@media (max-width: 991px) {
  .content-container {
    padding: 0 1rem;
  }

  /* Page header responsive styles are handled in components.css */

  .routine-page .card {
    border-radius: 20px;
  }

  .routine-page .card-body {
    padding: 1.5rem;
  }

  /* Make action buttons always visible on mobile */
  .action-fade {
    opacity: 1;
  }
}

@media (max-width: 767px) {
  .content-container {
    padding: 0 0.75rem;
  }

  /* Page header responsive styles are handled in components.css */

  .routine-page .card {
    border-radius: 16px;
  }

  .routine-page .card-body {
    padding: 1.25rem;
  }

  .routine-page .card-header {
    padding: 1rem 1.25rem;
  }

  .routine-page .form-control,
  .routine-page .form-select {
    height: 44px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  /* Stack buttons on mobile */
  .routine-page .d-flex.justify-content-between {
    flex-direction: column;
    gap: 0.75rem;
  }

  .routine-page .d-flex.justify-content-between .btn {
    width: 100%;
  }

  /* Exercise header left-aligned on mobile */
  .exercises-header {
    justify-content: flex-start;
  }

  /* Saved routine cards on mobile */
  .routine-hover {
    padding: 1rem;
  }

  .routine-hover .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 0.75rem;
  }

  .routine-hover .d-flex.gap-4 {
    flex-direction: column;
    gap: 0.5rem !important;
    font-size: 14px;
    align-items: flex-start !important;
  }

  .routine-hover .action-fade {
    margin-top: 0;
    width: 100%;
  }

  .routine-hover .action-fade .btn {
    flex: 1;
  }

  .chip-badge {
    font-size: 11px;
    padding: 2px 6px;
  }
}

@media (max-width: 575px) {
  .content-container {
    padding: 0 0.5rem;
  }

  /* Page header responsive styles are handled in components.css */

  .routine-page .card-body {
    padding: 1rem;
  }

  .routine-page .card-header {
    padding: 0.875rem 1rem;
  }

  .card-title {
    font-size: 1.125rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .btn-add-exercise-desktop {
    display: none;
  }

  .btn-add-exercise-mobile {
    display: block;
  }

  .empty-exercises-mobile {
    margin-bottom: 1rem;
  }

  .routine-page .form-label {
    font-size: 12px;
  }

  .btn-outline-dark,
  .btn-dark {
    font-size: 14px;
    padding: 0.5rem 0.875rem;
  }

  /* Compact empty state on mobile */
  .empty-state-box {
    padding: 1.5rem 1rem;
  }

  .empty-state-box p {
    font-size: 14px;
  }

  .empty-state-box small {
    font-size: 12px;
  }
}


/* Page header styles are handled in components.css */

.content-container {
  max-width: 64rem; /* ~1024px: similar to max-w-4xl */
  margin: 0 auto;
  padding: 0 1.5rem;
}
.page-title {
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card-header {
  background-color: var(--card);
  border-bottom: 1px solid var(--border);
}

.card-title {
  margin: 0;
  font-weight: 600;
}

.routine-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.routine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-chip {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.stat-value {
  font-weight: 700;
  color: #212529;
}

.stat-label {
  color: #6c757d;
  font-size: 0.875rem;
}

.btn-dark {
  border: none;
  background: var(--primary);
  color: var(--primary-foreground);
}

/* Button group styles */
.button-group-full {
  width: 100%;
}

.flex-1 {
  flex: 1;
}

/* Saved Routines Section */
.saved-routines-section {
  margin-top: 3rem;
}

.routines-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.routines-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Empty state */
.empty-routines {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  padding: 5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-content {
  max-width: 28rem;
  margin: 0 auto;
}

.empty-title {
  font-size: 21px;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  font-size: 15px;
  opacity: 0.5;
  line-height: 1.6;
  margin: 0;
}

/* Grid layout for desktop/tablet */
.routines-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 992px) {
  .routines-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Routine cards */
.routine-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.routine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.routine-card-content {
  padding: 2rem;
}

.routine-card-header {
  display: block;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.routine-card-title {
  font-size: 20px;
  letter-spacing: -0.01em;
  margin: 0;
  line-height: 1.3;
  word-wrap: break-word;
  flex: 1;
}

.routine-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  opacity: 0.5;
}

.meta-separator {
  opacity: 0.3;
}

.btn-menu {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  opacity: 0.5;
  transition: all 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.routine-card:hover .btn-menu {
  opacity: 1;
}

.btn-menu:focus {
  opacity: 1;
  outline: none;
}

.btn-menu:hover {
  background: var(--muted);
}

.routine-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 14px;
  opacity: 0.6;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-weight: 600;
}

.stat-text {
  opacity: 0.8;
}

.btn-start {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 100px;
  height: 44px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-start:hover {
  background: #000;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Mobile list view */
.routines-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.routine-card-mobile {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.routine-card-content-mobile {
  padding: 1.5rem;
}

.routine-card-header-mobile {
  display: block;
}

.title-section-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-row-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.routine-card-title-mobile {
  font-size: 18px;
  letter-spacing: -0.01em;
  margin: 0;
  word-wrap: break-word;
  flex: 1;
}

.routine-meta-mobile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  opacity: 0.5;
}

.meta-separator-mobile {
  opacity: 0.5;
}

.btn-menu-mobile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}

.btn-menu-mobile:focus {
  outline: none;
}

.btn-menu-mobile:hover {
  background: var(--muted);
}

.routine-stats-mobile {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 13px;
  opacity: 0.6;
}

.stat-item-mobile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-value-mobile {
  font-weight: 600;
}

.stat-text-mobile {
  opacity: 0.8;
}

.btn-start-mobile {
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 100px;
  height: 44px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-start-mobile:hover {
  background: #000;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  min-width: 160px;
  margin-top: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  background: white;
}

.dropdown.show .dropdown-menu,
.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  border-radius: 12px;
  padding: 0.625rem 1rem;
  font-size: 14px;
  display: block;
  width: 100%;
  text-align: left;
  text-decoration: none;
  color: inherit;
  border: none;
  background: none;
}

.dropdown-item:hover {
  background: var(--muted);
}

/* Empty exercises state */
.empty-state-box {
  border: 2px dashed var(--border);
  background: var(--muted);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
}

/* Animated list for exercise items */
.list-fade-enter-active,
.list-fade-leave-active {
  transition: all 0.25s ease;
}

.list-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.list-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.list-fade-move {
  transition: transform 0.25s ease;
}

/* Dark mode styles for routine cards */
.dark .routine-page {
  background: #000000;
}

.dark .routine-card {
  background: #1a1a1a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.dark .routine-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

.dark .routines-title {
  color: #ffffff;
}

.dark .routine-card-title,
.dark .routine-card-title-mobile {
  color: #ffffff;
}

.dark .routine-meta,
.dark .routine-meta-mobile {
  color: rgba(255, 255, 255, 0.6);
}

.dark .stat-value,
.dark .stat-value-mobile {
  color: #ffffff;
}

.dark .stat-text,
.dark .stat-text-mobile {
  color: rgba(255, 255, 255, 0.7);
}

.dark .routine-card-mobile {
  background: #1a1a1a !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.dark .empty-routines {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .empty-title {
  color: rgba(255, 255, 255, 0.9);
}

.dark .empty-subtitle {
  color: rgba(255, 255, 255, 0.6);
}

.dark .btn-menu:hover,
.dark .btn-menu-mobile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark .dropdown-menu {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .dropdown-item {
  color: rgba(255, 255, 255, 0.85);
}

.dark .dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.dark .dropdown-item.text-danger {
  color: #ff6b6b;
}

.dark .dropdown-item.text-danger:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.dark .dropdown-menu {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
}

/* Fade transition for delete modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>



