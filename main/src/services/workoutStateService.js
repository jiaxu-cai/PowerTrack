// Service for managing workout state across the application
export class WorkoutStateService {
  static ACTIVE_SESSION_KEY = 'activeWorkoutSessionData'
  static WORKOUT_DATA_KEY = 'currentWorkoutData'
  static ROUTE_DATA_KEY = 'currentRouteData'

  // Check if there's an active workout session
  static checkActiveWorkout() {
    try {
      const sessionData = localStorage.getItem(this.ACTIVE_SESSION_KEY)
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        
        // Validate session data
        if (!parsed.isActive || !parsed.sessionId || !parsed.startTime) {
          return false
        }
        
        // Check if session is not too old (more than 24 hours)
        const sessionStartTime = new Date(parsed.startTime)
        const now = new Date()
        const hoursSinceStart = (now - sessionStartTime) / (1000 * 60 * 60)
        
        if (hoursSinceStart > 24) {
          // Session is too old, clear it
          this.clearActiveWorkout()
          return false
        }
        
        return true
      }
    } catch (error) {
      console.error('Error checking active workout:', error)
      // Clear corrupted data
      this.clearActiveWorkout()
    }
    return false
  }

  // Save current workout data
  static saveWorkoutData(workoutData, sourceType, routeData = null, trackedDistance = null) {
    try {
      localStorage.setItem(this.WORKOUT_DATA_KEY, JSON.stringify(workoutData))
      localStorage.setItem('activeWorkoutSourceType', sourceType)
      if (routeData) {
        localStorage.setItem(this.ROUTE_DATA_KEY, JSON.stringify(routeData))
      }
      if (trackedDistance !== null) {
        localStorage.setItem('trackedDistance', trackedDistance.toString())
      }
    } catch (error) {
      console.error('Error saving workout data:', error)
    }
  }

  // Save active session data
  static saveActiveSession(sessionId, startTime, isActive, elapsedTime = 0, isPaused = false, pausedElapsedTime = 0, resumeTime = null) {
    try {
      const sessionData = {
        sessionId,
        startTime: startTime.toISOString(),
        isActive,
        elapsedTime,
        isPaused,
        pausedElapsedTime,
        resumeTime: resumeTime ? resumeTime.toISOString() : null,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem(this.ACTIVE_SESSION_KEY, JSON.stringify(sessionData))
    } catch (error) {
      console.error('Error saving active session:', error)
    }
  }

  // Get current workout data
  static getCurrentWorkoutData() {
    try {
      const workoutData = localStorage.getItem(this.WORKOUT_DATA_KEY)
      const sourceType = localStorage.getItem('activeWorkoutSourceType')
      const routeData = localStorage.getItem(this.ROUTE_DATA_KEY)
      const trackedDistance = localStorage.getItem('trackedDistance')
      
      return {
        workoutData: workoutData ? JSON.parse(workoutData) : null,
        sourceType: sourceType || 'custom',
        routeData: routeData ? JSON.parse(routeData) : null,
        trackedDistance: trackedDistance ? parseFloat(trackedDistance) : 0
      }
    } catch (error) {
      console.error('Error getting current workout data:', error)
      return {
        workoutData: null,
        sourceType: 'custom',
        routeData: null,
        trackedDistance: 0
      }
    }
  }

  // Get active workout data
  static getActiveWorkoutData() {
    try {
      const sessionData = localStorage.getItem(this.ACTIVE_SESSION_KEY)
      const workoutData = localStorage.getItem(this.WORKOUT_DATA_KEY)
      const sourceType = localStorage.getItem('activeWorkoutSourceType')
      
      if (sessionData) {
        const parsed = JSON.parse(sessionData)
        if (parsed.isActive && parsed.sessionId && parsed.startTime) {
          const result = {
            sessionId: parsed.sessionId,
            startTime: new Date(parsed.startTime),
            elapsedTime: parsed.elapsedTime || 0,
            isActive: parsed.isActive,
            isPaused: parsed.isPaused || false,
            pausedElapsedTime: parsed.pausedElapsedTime || 0,
            resumeTime: parsed.resumeTime ? new Date(parsed.resumeTime) : null,
            routeCompleted: parsed.routeCompleted || false
          }
          
          // Add workout name if available
          if (workoutData) {
            try {
              const parsedWorkout = JSON.parse(workoutData)
              result.workoutName = parsedWorkout.title || 'Active Workout'
              result.sourceType = sourceType || 'custom'
            } catch (error) {
              console.error('Error parsing workout data:', error)
              result.workoutName = 'Active Workout'
              result.sourceType = sourceType || 'custom'
            }
          } else {
            result.workoutName = 'Active Workout'
            result.sourceType = sourceType || 'custom'
          }
          
          return result
        }
      }
    } catch (error) {
      console.error('Error getting active workout data:', error)
    }
    return null
  }

  // Clear active session only (keep workout data for potential restart)
  static clearActiveSession() {
    try {
      localStorage.removeItem(this.ACTIVE_SESSION_KEY)
    } catch (error) {
      console.error('Error clearing active session:', error)
    }
  }

  // Clear all workout state (session + data)
  static clearActiveWorkout() {
    try {
      // Clear all workout-related localStorage items
      localStorage.removeItem('activeWorkoutSession')
      localStorage.removeItem('activeWorkoutSourceType')
      localStorage.removeItem('activeWorkoutSourceId')
      localStorage.removeItem(this.ACTIVE_SESSION_KEY)
      localStorage.removeItem(this.WORKOUT_DATA_KEY)
      localStorage.removeItem(this.ROUTE_DATA_KEY)
      localStorage.removeItem('trackedDistance')
      
      // Also clear any draft workout data that might interfere
      localStorage.removeItem('draftGeneratedWorkout')
      
      console.log('All workout state cleared')
    } catch (error) {
      console.error('Error clearing active workout:', error)
    }
  }
}

export default WorkoutStateService
