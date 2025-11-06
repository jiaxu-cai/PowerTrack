<template>
  <div class="progress-dashboard-view">
    <div class="dashboard-container">
      
      <Transition name="header-fade">
        <div v-if="true" class="page-header">
          <h1 class="page-title">
            Progress Dashboard
          </h1>
          <p class="page-subtitle">Track your fitness journey and see your improvements</p>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.1s">
        <div v-if="true" class="stats-overview">
          <div class="stat-card">
            <div class="stat-card-icon blue">
              <i class="bi bi-calendar-check"></i>
            </div>
            <div class="stat-card-value">{{ daysWorkedOut }}</div>
            <div class="stat-card-label">Days Worked Out</div>
            <div class="stat-card-period">All time</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-icon orange">
              <i class="bi bi-fire"></i>
            </div>
            <div class="stat-card-value">{{ currentStreak }}</div>
            <div class="stat-card-label">Current Streak</div>
            <div class="stat-card-period">Days</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-icon blue">
              <i class="bi bi-clock"></i>
            </div>
            <div class="stat-card-value">{{ totalTimeThisWeek }}</div>
            <div class="stat-card-label">Total Time</div>
            <div class="stat-card-period">Minutes</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-card-icon green">
              <i class="bi bi-trophy"></i>
            </div>
            <div class="stat-card-value">{{ totalExercisesAllTime }}</div>
            <div class="stat-card-label">Exercises Done</div>
            <div class="stat-card-period">All time</div>
          </div>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.2s">
        <div v-if="true" class="nav-tabs-container">
          <div class="nav-tabs-view">
            <button
              class="nav-tab-view"
              :class="{ active: activeTab === 'workout' }"
              @click="activeTab = 'workout'"
            >
              <i class="bi bi-lightning-charge"></i>
              Workout Statistics
            </button>
            <button
              class="nav-tab-view"
              :class="{ active: activeTab === 'running' }"
              @click="activeTab = 'running'"
            >
              <i class="bi bi-graph-up-arrow"></i>
              Running Statistics
            </button>
          </div>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.3s">
        <div v-show="activeTab === 'workout'">
          
          <div class="section-header">
            Last 8 Weeks
          </div>
          
          <div class="charts-grid">
            
            <div class="chart-card">
              <h3 class="chart-title">Workouts Completed</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasWorkoutData" class="empty-state">
                <i class="bi bi-graph-up"></i>
                <p>No workout data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="workoutChartData" :options="chartOptions" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Exercises Completed</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasExerciseData" class="empty-state">
                <i class="bi bi-list-ul"></i>
                <p>No exercise data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="exerciseChartData" :options="chartOptions" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Workout Duration (Minutes)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasDurationData" class="empty-state">
                <i class="bi bi-clock"></i>
                <p>No duration data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="durationChartData" :options="chartOptions" />
              </div>
            </div>
          </div>

          
          <div class="section-header">
            {{ currentYear }}
          </div>
          
          <div class="charts-grid">
            
            <div class="chart-card">
              <h3 class="chart-title">Workouts per Month</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasWorkoutYearData" class="empty-state">
                <i class="bi bi-graph-up"></i>
                <p>No workout data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="workoutYearChartData" :options="chartOptions" :key="'workoutYear_'+currentYear" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Exercises per Month</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasExerciseYearData" class="empty-state">
                <i class="bi bi-list-ul"></i>
                <p>No exercise data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="exerciseYearChartData" :options="chartOptions" :key="'exerciseYear_'+currentYear" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Duration per Month (Minutes)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasDurationYearData" class="empty-state">
                <i class="bi bi-clock"></i>
                <p>No duration data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="durationYearChartData" :options="chartOptions" :key="'durationYear_'+currentYear" />
              </div>
            </div>
          </div>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.3s">
        <div v-show="activeTab === 'running'">
          
          <div class="section-header">
            Last 8 Weeks
          </div>
          
          <div class="charts-grid">
            
            <div class="chart-card">
              <h3 class="chart-title">Runs Completed</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningRunsData" class="empty-state">
                <i class="bi bi-geo-alt"></i>
                <p>No running data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningRunsChartData" :options="chartOptions" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Distance Ran (km)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningDistanceData" class="empty-state">
                <i class="bi bi-signpost-split"></i>
                <p>No running distance data yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningDistanceChartData" :options="chartOptions" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Running Duration (Minutes)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningDurationData" class="empty-state">
                <i class="bi bi-clock-history"></i>
                <p>No running duration data yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningDurationChartData" :options="chartOptions" />
              </div>
            </div>
          </div>

          
          <div class="section-header">
            {{ currentYear }}
          </div>
          
          <div class="charts-grid">
            
            <div class="chart-card">
              <h3 class="chart-title">Runs per Month</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningYearRunsData" class="empty-state">
                <i class="bi bi-geo-alt"></i>
                <p>No running data available yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningYearRunsChartData" :options="chartOptions" :key="'runningYearRuns_'+currentYear" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Distance per Month (km)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningYearDistanceData" class="empty-state">
                <i class="bi bi-signpost-split"></i>
                <p>No running distance data yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningYearDistanceChartData" :options="chartOptions" :key="'runningYearDistance_'+currentYear" />
              </div>
            </div>

            
            <div class="chart-card">
              <h3 class="chart-title">Duration per Month (Minutes)</h3>
              <div v-if="loading" class="loading-state">
                <div class="spinner-border" role="status"></div>
              </div>
              <div v-else-if="!hasRunningYearDurationData" class="empty-state">
                <i class="bi bi-clock-history"></i>
                <p>No running duration data yet</p>
              </div>
              <div v-else class="chart-container-view">
                <Line :data="runningYearDurationChartData" :options="chartOptions" :key="'runningYearDuration_'+currentYear" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, toRaw} from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { WorkoutService } from '../services/workoutService.js'
import { AuthService } from '../services/authService.js'
import { useTheme } from '../composables/useTheme.js'
import { getErrorMessage } from '../utils/errorHandler.js'

// chart.js setup
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const loading = ref(false)
const workoutLogs = ref([])
const runningLogs = ref([])

const workoutData = ref([])
const exerciseData = ref([])
const durationData = ref([])

const workoutYearData = ref([])
const exerciseYearData = ref([])
const durationYearData = ref([])

const runningRunsData = ref([])
const runningDurationData = ref([])
const runningDistanceData = ref([])

const runningYearRunsData = ref([])
const runningYearDurationData = ref([])
const runningYearDistanceData = ref([])

const daysWorkedOut = ref(0)
const currentYear = new Date().getFullYear()

const hasWorkoutData = computed(() => {
  return workoutData.value.some(d => d.workouts > 0)
})

const hasExerciseData = computed(() => {
  return exerciseData.value.some(d => d.exercises > 0)
})

const hasDurationData = computed(() => {
  return durationData.value.some(d => d.duration > 0)
})

const hasRunningRunsData = computed(() => {
  return runningRunsData.value.some(d => d.runs > 0)
})

const hasRunningDurationData = computed(() => {
  return runningDurationData.value.some(d => d.duration > 0)
})

const hasRunningDistanceData = computed(() => {
  return runningDistanceData.value.some(d => d.distance > 0)
})

const loadedOnce = ref(false)

onMounted(async () => {
  if (loadedOnce.value) return
  loadedOnce.value = true
  await loadAllData()
})

const loadAllData = async () => {
  loading.value = true
  try {
    const user = AuthService.getCurrentUser()
    
    if (user) {
      await Promise.all([
        loadWorkoutLogs(),
        loadRunningLogs()
      ])
      
      calculateDaysWorkedOut()
      processChartData(workoutLogs.value)
      processRunningChartData(runningLogs.value)
      processYearChartData(workoutLogs.value)
      processRunningYearChartData(runningLogs.value)
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const loadWorkoutLogs = async () => {
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 1000 })
    workoutLogs.value = allLogs.filter(log => !log.workoutType || log.workoutType === 'routine')
  } catch (error) {
    console.error('Error loading workout logs:', error)
    // ignore silent auth errors
    if (!getErrorMessage(error, '').includes('Please sign in')) {
      console.warn(getErrorMessage(error, 'Failed to load workout logs'))
    }
    workoutLogs.value = []
  }
}

const loadRunningLogs = async () => {
  try {
    const allLogs = await WorkoutService.getUserWorkoutLogs({ limit: 1000 })
    runningLogs.value = allLogs.filter(log => log.workoutType === 'runs')
  } catch (error) {
    console.error('Error loading running logs:', error)
    // ignore silent auth errors
    if (!getErrorMessage(error, '').includes('Please sign in')) {
      console.warn(getErrorMessage(error, 'Failed to load running logs'))
    }
    runningLogs.value = []
  }
}

const calculateDaysWorkedOut = () => {
  try {
    const uniqueDays = new Set()
    
    // convert timestamps
    const convertTimestamp = (timestamp) => {
      if (!timestamp) return new Date()
      if (timestamp instanceof Date) return timestamp
      if (typeof timestamp === 'number') return new Date(timestamp)
      if (typeof timestamp === 'string') return new Date(timestamp)
      
      const unwrapped = toRaw(timestamp)
      if (typeof unwrapped === 'number') return new Date(unwrapped)
      if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
      if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
      return new Date(unwrapped)
    }
    
    workoutLogs.value.forEach(log => {
      const date = convertTimestamp(log.timestamp)
      uniqueDays.add(date.toDateString())
    })
    
    runningLogs.value.forEach(log => {
      const date = convertTimestamp(log.timestamp)
      uniqueDays.add(date.toDateString())
    })
    
    daysWorkedOut.value = uniqueDays.size
  } catch (error) {
    console.error('Error calculating days worked out:', error)
  }
}

const processChartData = (logs) => {
  const weeks = []
  const now = new Date()
  
  // most recent monday
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)
  
  const convertTimestamp = (timestamp) => {
    if (!timestamp) {
      console.warn('Null/undefined timestamp, using current date')
      return new Date()
    }
    
    if (timestamp instanceof Date) return timestamp
    
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    if (typeof timestamp === 'string') return new Date(timestamp)
    
    const unwrapped = toRaw(timestamp)
    
    if (unwrapped?.seconds !== undefined) {
      return new Date(unwrapped.seconds * 1000)
    }
    
    if (unwrapped?._seconds !== undefined) {
      return new Date(unwrapped._seconds * 1000)
    }
    
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate()
    }
    
    try {
      const date = new Date(unwrapped)
      if (isNaN(date.getTime())) {
        console.error('Invalid timestamp. Type:', typeof timestamp, 'Value:', timestamp)
        return new Date()
      }
      return date
    } catch (e) {
      console.error('Failed to convert timestamp:', timestamp, e)
      return new Date()
    }
  }
  
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekWorkouts = (logs || []).filter(log => {
      const logDate = convertTimestamp(log.timestamp)
      return logDate >= weekStart && logDate <= weekEnd
    })
    
    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
    
    const weekData = {
      label: weekLabel,
      workouts: weekWorkouts.length,
      exercises: weekWorkouts.reduce((sum, w) => sum + (w.numberOfExercises || 0), 0),
      duration: weekWorkouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0)
    }
    
    weeks.push(weekData)
  }
  
  workoutData.value = weeks.map(w => ({ label: w.label, workouts: w.workouts }))
  exerciseData.value = weeks.map(w => ({ label: w.label, exercises: w.exercises }))
  durationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
}

const processYearChartData = (logs) => {
  const now = new Date()
  const year = now.getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    workouts: 0,
    exercises: 0,
    duration: 0,
  }))

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    const unwrapped = toRaw(timestamp)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate()
    return new Date(unwrapped)
  }

  logs.forEach(log => {
    const logDate = convertTimestamp(log.timestamp)
    if (logDate.getFullYear() === year) {
      const monthIndex = logDate.getMonth()
      months[monthIndex].workouts++
      months[monthIndex].exercises += (log.numberOfExercises || 0)
      months[monthIndex].duration += (log.durationMinutes || 0)
    }
  })

  workoutYearData.value = months.map(m => ({ label: m.label, workouts: m.workouts }))
  exerciseYearData.value = months.map(m => ({ label: m.label, exercises: m.exercises }))
  durationYearData.value = months.map(m => ({ label: m.label, duration: m.duration }))
}

const processRunningChartData = (logs) => {
  const weeks = []
  const now = new Date()
  
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const mostRecentMonday = new Date(now)
  mostRecentMonday.setDate(now.getDate() - daysToMonday)
  mostRecentMonday.setHours(0, 0, 0, 0)
  
  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    const unwrapped = toRaw(timestamp)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate()
    return new Date(unwrapped)
  }
  
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(mostRecentMonday)
    weekStart.setDate(mostRecentMonday.getDate() - (i * 7))
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    const weekRuns = (logs || []).filter(log => {
      const logDate = convertTimestamp(log.timestamp)
      return logDate >= weekStart && logDate <= weekEnd
    })
    
    const weekLabel = weekStart.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
    
    const weekData = {
      label: weekLabel,
      runs: weekRuns.length,
      distance: weekRuns.reduce((sum, r) => sum + (r.distanceKm || 0), 0),
      duration: weekRuns.reduce((sum, r) => sum + (r.durationMinutes || 0), 0)
    }
    
    weeks.push(weekData)
  }
  
  runningRunsData.value = weeks.map(w => ({ label: w.label, runs: w.runs }))
  runningDistanceData.value = weeks.map(w => ({ label: w.label, distance: w.distance }))
  runningDurationData.value = weeks.map(w => ({ label: w.label, duration: w.duration }))
}

const processRunningYearChartData = (logs) => {
  const now = new Date()
  const year = now.getFullYear()
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(year, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    runs: 0,
    distance: 0,
    duration: 0,
  }))

  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    const unwrapped = toRaw(timestamp)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') return timestamp.toDate()
    return new Date(unwrapped)
  }

  logs.forEach(log => {
    const logDate = convertTimestamp(log.timestamp)
    if (logDate.getFullYear() === year) {
      const monthIndex = logDate.getMonth()
      months[monthIndex].runs++
      months[monthIndex].distance += (log.distanceKm || 0)
      months[monthIndex].duration += (log.durationMinutes || 0)
    }
  })

  runningYearRunsData.value = months.map(m => ({ label: m.label, runs: m.runs }))
  runningYearDistanceData.value = months.map(m => ({ label: m.label, distance: m.distance }))
  runningYearDurationData.value = months.map(m => ({ label: m.label, duration: m.duration }))
}

// chart data and options
const workoutChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  return {
    labels: workoutData.value.map(d => d.label),
    datasets: [{
      label: 'Workouts',
      data: workoutData.value.map(d => d.workouts),
      borderColor: '#3b82f6',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

// year charts
const hasWorkoutYearData = computed(() => workoutYearData.value.some(d => d.workouts > 0))
const hasExerciseYearData = computed(() => exerciseYearData.value.some(d => d.exercises > 0))
const hasDurationYearData = computed(() => durationYearData.value.some(d => d.duration > 0))

const workoutYearChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  return {
    labels: workoutYearData.value.map(d => d.label),
    datasets: [{
      label: 'Workouts',
      data: workoutYearData.value.map(d => d.workouts),
      borderColor: '#3b82f6',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const exerciseYearChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
  
  return {
    labels: exerciseYearData.value.map(d => d.label),
    datasets: [{
      label: 'Exercises',
      data: exerciseYearData.value.map(d => d.exercises),
      borderColor: '#10b981',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const durationYearChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
  gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)')
  
  return {
    labels: durationYearData.value.map(d => d.label),
    datasets: [{
      label: 'Minutes',
      data: durationYearData.value.map(d => d.duration),
      borderColor: '#06b6d4',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const exerciseChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
  
  return {
    labels: exerciseData.value.map(d => d.label),
    datasets: [{
      label: 'Exercises',
      data: exerciseData.value.map(d => d.exercises),
      borderColor: '#10b981',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const durationChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
  gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)')
  
  return {
    labels: durationData.value.map(d => d.label),
    datasets: [{
      label: 'Minutes',
      data: durationData.value.map(d => d.duration),
      borderColor: '#06b6d4',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const runningRunsChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  return {
    labels: runningRunsData.value.map(d => d.label),
    datasets: [{
      label: 'Runs',
      data: runningRunsData.value.map(d => d.runs),
      borderColor: '#3b82f6',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const runningDurationChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
  gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)')
  
  return {
    labels: runningDurationData.value.map(d => d.label),
    datasets: [{
      label: 'Minutes',
      data: runningDurationData.value.map(d => d.duration),
      borderColor: '#06b6d4',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const runningDistanceChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
  
  return {
    labels: runningDistanceData.value.map(d => d.label),
    datasets: [{
      label: 'Kilometers',
      data: runningDistanceData.value.map(d => d.distance),
      borderColor: '#10b981',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const hasRunningYearRunsData = computed(() => runningYearRunsData.value.some(d => d.runs > 0))
const hasRunningYearDurationData = computed(() => runningYearDurationData.value.some(d => d.duration > 0))
const hasRunningYearDistanceData = computed(() => runningYearDistanceData.value.some(d => d.distance > 0))

const runningYearRunsChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
  
  return {
    labels: runningYearRunsData.value.map(d => d.label),
    datasets: [{
      label: 'Runs',
      data: runningYearRunsData.value.map(d => d.runs),
      borderColor: '#3b82f6',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const runningYearDurationChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
  gradient.addColorStop(1, 'rgba(6, 182, 212, 0.05)')
  
  return {
    labels: runningYearDurationData.value.map(d => d.label),
    datasets: [{
      label: 'Minutes',
      data: runningYearDurationData.value.map(d => d.duration),
      borderColor: '#06b6d4',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const runningYearDistanceChartData = computed(() => {
  const ctx = document.createElement('canvas').getContext('2d')
  const gradient = ctx.createLinearGradient(0, 0, 0, 220)
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')
  
  return {
    labels: runningYearDistanceData.value.map(d => d.label),
    datasets: [{
      label: 'Kilometers',
      data: runningYearDistanceData.value.map(d => d.distance),
      borderColor: '#10b981',
      backgroundColor: gradient,
      tension: 0.4,
      fill: true,
      borderWidth: isDark.value ? 1.5 : 2
    }]
  }
})

const currentStreak = computed(() => {
  // consecutive-day streak
  if (!workoutLogs.value.length && !runningLogs.value.length) return 0
  
  const allLogs = [...workoutLogs.value, ...runningLogs.value]
  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    const unwrapped = toRaw(timestamp)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    return new Date(unwrapped)
  }
  
  const workoutDates = new Set()
  allLogs.forEach(log => {
    const date = convertTimestamp(log.timestamp)
    workoutDates.add(date.toDateString())
  })
  
  const sortedDates = Array.from(workoutDates).map(d => new Date(d)).sort((a, b) => b - a)
  if (sortedDates.length === 0) return 0
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  let checkDate = new Date(today)
  for (let i = 0; i < sortedDates.length; i++) {
    const workoutDate = new Date(sortedDates[i])
    workoutDate.setHours(0, 0, 0, 0)
    
    if (workoutDate.getTime() === checkDate.getTime()) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (workoutDate < checkDate) {
      break
    }
  }
  
  return streak
})

const totalTimeThisWeek = computed(() => {
  const now = new Date()
  const currentDay = now.getDay()
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - daysToMonday)
  weekStart.setHours(0, 0, 0, 0)
  
  const convertTimestamp = (timestamp) => {
    if (!timestamp) return new Date()
    if (timestamp instanceof Date) return timestamp
    if (typeof timestamp === 'number') return new Date(timestamp)
    if (typeof timestamp === 'string') return new Date(timestamp)
    const unwrapped = toRaw(timestamp)
    if (unwrapped?.seconds !== undefined) return new Date(unwrapped.seconds * 1000)
    if (unwrapped?._seconds !== undefined) return new Date(unwrapped._seconds * 1000)
    return new Date(unwrapped)
  }
  
  const thisWeekLogs = [...workoutLogs.value, ...runningLogs.value].filter(log => {
    const logDate = convertTimestamp(log.timestamp)
    return logDate >= weekStart
  })
  
  return thisWeekLogs.reduce((sum, log) => sum + (log.durationMinutes || 0), 0)
})

const totalExercisesAllTime = computed(() => {
  return workoutLogs.value.reduce((sum, log) => sum + (log.numberOfExercises || 0), 0)
})

// Active tab state
const activeTab = ref('workout')

// Get theme for chart colors
const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const chartOptions = computed(() => {
  const textColor = isDark.value ? 'rgba(255, 255, 255, 0.6)' : '#999'
  const gridColor = isDark.value ? 'rgba(255, 255, 255, 0.08)' : '#f0f0f0'
  const tooltipBg = isDark.value ? '#1a1a1a' : 'white'
  const tooltipBorder = isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.05)'
  const tooltipTextColor = isDark.value ? '#ffffff' : '#030213'
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        titleFont: {
          size: 13,
          weight: '500',
          color: tooltipTextColor
        },
        bodyFont: {
          size: 13,
          color: tooltipTextColor
        },
        boxPadding: 6,
        enabled: true,
        callbacks: {
          title: function() {
            return ''
          },
          label: function(context) {
            if (!context) return ''
            const label = context.label || ''
            const value = context.parsed?.y ?? context.raw ?? 0
            return `${label}: ${value}`
          },
          labelTextColor: function() {
            return tooltipTextColor
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          }
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
          lineWidth: 1,
          drawBorder: false
        },
        ticks: {
          color: textColor,
          font: {
            size: 11
          },
          precision: 0
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4
      },
      line: {
        tension: 0.4,
        borderWidth: isDark.value ? 1.5 : 2
      }
    }
  }
})
</script>

<style scoped>
.header-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
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
</style>