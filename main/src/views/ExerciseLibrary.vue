<template>
  <div class="exercise-library-view">
    <div class="library-container">
      <!-- Page Header -->
      <Transition name="header-fade" appear>
        <div v-if="true" class="page-header">
          <h1 class="page-title">Exercise Library</h1>
          <p class="page-subtitle">Browse and explore exercises for your workouts</p>
        </div>
      </Transition>

      <!-- Filters Card -->
      <Transition name="section-fade" style="--transition-delay: 0.1s" appear>
        <div v-if="true" class="filters-card">
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-input-wrapper">
              <i class="bi bi-search search-icon"></i>
              <input 
                type="text" 
                class="search-input"
                placeholder="Search exercises..."
                v-model="searchQuery"
                @input="filterExercises"
              >
            </div>
          </div>

          <!-- Filter Dropdowns -->
          <div class="filters-grid">
            <!-- Muscle Group -->
            <div class="filter-group">
              <label for="muscle" class="filter-label">MUSCLE GROUP</label>
              <select 
                id="muscle"
                class="filter-select" 
                v-model="filters.muscle" 
                @change="filterExercises"
              >
                <option value="">All</option>
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="shoulders">Shoulders</option>
                <option value="biceps">Biceps</option>
                <option value="triceps">Triceps</option>
                <option value="legs">Legs</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>

            <!-- Equipment -->
            <div class="filter-group">
              <label for="equipment" class="filter-label">EQUIPMENT</label>
              <select 
                id="equipment"
                class="filter-select" 
                v-model="filters.equipment" 
                @change="filterExercises"
              >
                <option value="">All</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="dumbbells">Dumbbells</option>
                <option value="barbell">Barbell</option>
                <option value="bench">Bench</option>
                <option value="pullup_bar">Pull-up Bar</option>
              </select>
            </div>

            <!-- Intensity -->
            <div class="filter-group">
              <label for="intensity" class="filter-label">INTENSITY</label>
              <select 
                id="intensity"
                class="filter-select" 
                v-model="filters.intensity" 
                @change="filterExercises"
              >
                <option v-for="intensity in INTENSITIES" :key="intensity.value" :value="intensity.value">
                  {{ intensity.label }}
                </option>
              </select>
            </div>

            <!-- Difficulty -->
            <div class="filter-group">
              <label for="difficulty" class="filter-label">DIFFICULTY</label>
              <select 
                id="difficulty"
                class="filter-select" 
                v-model="filters.difficulty" 
                @change="filterExercises"
              >
                <option value="">All</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Results Section -->
      <Transition name="section-fade" style="--transition-delay: 0.15s" appear>
        <div v-if="!loading">
          <!-- Results Count -->
          <div class="results-count">
            <p>{{ filteredExercises.length }} {{ filteredExercises.length === 1 ? 'exercise' : 'exercises' }} found</p>
          </div>

          <!-- Exercise Grid -->
          <Transition name="page-fade" mode="out-in">
            <div :key="currentPage" class="exercises-grid">
              <ExerciseCard 
                v-for="exercise in paginatedExercises" 
                :key="`${currentPage}-${exercise.exerciseId}`"
                :exercise="exercise"
                :delay="0"
                @addToRoutine="addToRoutine"
              />
            </div>
          </Transition>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination-wrapper">
            <ExerciseLibraryPagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>

          <!-- Empty State -->
          <div v-if="filteredExercises.length === 0" class="empty-state">
            <p>No exercises found matching your criteria</p>
          </div>
        </div>
      </Transition>

      <!-- Loading State -->
      <Transition name="fade" appear>
        <div v-if="loading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading exercises...</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue'
import { WorkoutService } from '../services/workoutService.js'
import ExerciseCard from '../components/ExerciseCard.vue'
import ExerciseLibraryPagination from '../components/ExerciseLibraryPagination.vue'

const loading = ref(false)
const exercises = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const exercisesPerPage = 12 // 4 rows × 3 columns (typical desktop layout)

// Toast notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const INTENSITIES = [
  { value: '',        label: 'All' },
  { value: 'low',     label: 'Low' },
  { value: 'medium',  label: 'Medium' },
  { value: 'high',    label: 'High' }
]

const filters = reactive({
  muscle: '',
  equipment: '',
  intensity: '',
  difficulty: ''
})

const filteredExercises = computed(() => {
  let filtered = exercises.value

  // filter by search text
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(exercise => 
      exercise.name.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.muscle.some(m => m.toLowerCase().includes(query))
    )
  }

  // apply other filters
  if (filters.muscle) {
    if (filters.muscle === 'biceps') {
      // Match exercises that target biceps - check exerciseId, name, or muscle array
      filtered = filtered.filter(exercise => {
        const exerciseIdLower = exercise.exerciseId?.toLowerCase() || ''
        const nameLower = exercise.name?.toLowerCase() || ''
        const hasBicepInName = exerciseIdLower.includes('bicep') || exerciseIdLower.includes('curl') || 
                               nameLower.includes('bicep') || nameLower.includes('curl')
        const hasArmsInMuscle = exercise.muscle.includes('arms')
        // Include if it's specifically a bicep exercise or has arms (but not tricep-specific)
        const isTricepExercise = exerciseIdLower.includes('tricep') || nameLower.includes('tricep') || 
                                exerciseIdLower.includes('dip') || nameLower.includes('dip')
        return hasBicepInName || (hasArmsInMuscle && !isTricepExercise)
      })
    } else if (filters.muscle === 'triceps') {
      // Match exercises that target triceps - check exerciseId, name, or muscle array
      filtered = filtered.filter(exercise => {
        const exerciseIdLower = exercise.exerciseId?.toLowerCase() || ''
        const nameLower = exercise.name?.toLowerCase() || ''
        const hasTricepInName = exerciseIdLower.includes('tricep') || exerciseIdLower.includes('dip') ||
                                nameLower.includes('tricep') || nameLower.includes('dip')
        const hasArmsInMuscle = exercise.muscle.includes('arms')
        // Include if it's specifically a tricep exercise or has arms (but not bicep-specific)
        const isBicepExercise = exerciseIdLower.includes('bicep') || exerciseIdLower.includes('curl') ||
                                nameLower.includes('bicep') || nameLower.includes('curl')
        return hasTricepInName || (hasArmsInMuscle && !isBicepExercise)
      })
    } else {
      // Standard muscle group matching
      filtered = filtered.filter(exercise => 
        exercise.muscle.includes(filters.muscle)
      )
    }
  }

  if (filters.equipment) {
    filtered = filtered.filter(exercise => 
      exercise.equipment.includes(filters.equipment)
    )
  }

  if (filters.intensity) {
    filtered = filtered.filter(exercise => 
      exercise.intensity === filters.intensity
    )
  }

  if (filters.difficulty) {
    filtered = filtered.filter(exercise => 
      exercise.difficulty === filters.difficulty
    )
  }

  return filtered
})

// Pagination logic
const totalPages = computed(() => {
  return Math.ceil(filteredExercises.value.length / exercisesPerPage)
})

const paginatedExercises = computed(() => {
  const start = (currentPage.value - 1) * exercisesPerPage
  const end = start + exercisesPerPage
  return filteredExercises.value.slice(start, end)
})

// Reset to page 1 when filters change
watch([searchQuery, filters], () => {
  currentPage.value = 1
}, { deep: true })

const handlePageChange = (page) => {
  // Small delay to ensure smooth transition
  setTimeout(() => {
    currentPage.value = page
    // Scroll to top of results after transition starts
    setTimeout(() => {
      const resultsSection = document.querySelector('.results-count')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }, 50)
}

onMounted(async () => {
  await loadExercises()
})

// Toast notification function
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const loadExercises = async () => {
  loading.value = true
  try {
    const fetchedExercises = await WorkoutService.getExercises()
    exercises.value = fetchedExercises
  } catch (error) {
    console.error('Error loading exercises:', error)
  } finally {
    loading.value = false
  }
}

const filterExercises = () => {
  // This is just to trigger reactivity if needed
  // The actual filtering is done in computed property
}

const addToRoutine = (exercise) => {
  try {
    const key = 'draftRoutineExercises'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const exists = existing.some(e => e.exerciseId === exercise.exerciseId)
    if (!exists) {
      const drafted = {
        exerciseId: exercise.exerciseId,
        sets: 3,
        reps: '8-12',
        restSeconds: 60
      }
      existing.push(drafted)
      localStorage.setItem(key, JSON.stringify(existing))
      showNotification(`${exercise.name} added to routine!`, 'success')
    } else {
      showNotification(`${exercise.name} is already in your routine`, 'error')
    }
  } catch (error) {
    console.error('Error adding exercise to draft routine:', error)
    showNotification('Failed to add exercise to routine', 'error')
  }
}

</script>

<style scoped>
/* Transitions */
.header-fade-enter-active,
.section-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--transition-delay, 0s);
}

.header-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.section-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Smooth pagination transition */
.page-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.page-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.page-fade-enter-from {
  opacity: 0;
}

.page-fade-leave-to {
  opacity: 0;
}

.exercise-card-enter-active {
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
              transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.exercise-card-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.exercise-card-move {
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}

/* Ensure smooth transitions without layout shift */
.exercises-grid {
  position: relative;
  min-height: 400px; /* Prevent layout shift during transitions */
}
</style>
