import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import WorkoutGenerator from '../views/WorkoutGenerator.vue'
import ExerciseLibrary from '../views/ExerciseLibrary.vue'
import ProgressDashboard from '../views/ProgressDashboard.vue'
import UserProfile from '../views/UserProfile.vue'
import RoutineBuilder from '../views/RoutineBuilder.vue'
import WorkoutTracking from '../views/WorkoutTracking.vue'
import RunningRoutes from '../views/RunningRoutes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
    },
    {
      path: '/workout',
      name: 'WorkoutGenerator',
      component: WorkoutGenerator,
    },
    {
      path: '/exercises',
      name: 'ExerciseLibrary',
      component: ExerciseLibrary,
    },
    {
      path: '/routines',
      name: 'RoutineBuilder',
      component: RoutineBuilder,
    },
    {
      path: '/progress',
      name: 'ProgressDashboard',
      component: ProgressDashboard,
    },
    {
      path: '/profile',
      name: 'UserProfile',
      component: UserProfile,
    },
    {
      path: '/workout-tracking',
      name: 'WorkoutTracking',
      component: WorkoutTracking,
    },
    {
      path: '/running-routes',
      name: 'RunningRoutes',
      component: RunningRoutes,
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Return a promise to delay scroll until after transition
    return new Promise((resolve) => {
      setTimeout(() => {
        // If there's a saved position (back/forward navigation), restore it
        if (savedPosition) {
          resolve(savedPosition)
        }
        // For hash links, scroll to the element
        else if (to.hash) {
          resolve({
            el: to.hash,
            behavior: 'smooth'
          })
        }
        // Always scroll to top when navigating to a new route
        else {
          resolve({ 
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 350) // Match transition duration (350ms for enter)
    })
  }
})

export default router
