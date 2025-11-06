<template>
    <nav class="modern-navbar">
      <div class="navbar-container">
        <button 
          class="mobile-menu-toggle" 
          type="button" 
          @click="toggleMenu"
          aria-label="Toggle navigation"
          :aria-expanded="isMenuOpen"
          aria-controls="mobileNavMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <router-link class="navbar-logo" to="/" @click="closeMenu">
          PowerTrack
        </router-link>
        <div 
          id="mobileNavMenu"
          class="navbar-menu" 
          :class="{ show: isMenuOpen }"
          :aria-hidden="!isMenuOpen"
        >
          <div class="nav-links">
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'WorkoutGenerator' }" 
              to="/workout" 
              @click="closeMenu"
            >
              Generate
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'WorkoutTracking' }" 
              to="/workout-tracking" 
              @click="closeMenu"
            >
              Tracking
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'RunningRoutes' }" 
              to="/running-routes" 
              @click="closeMenu"
            >
              Routes
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'ExerciseLibrary' }" 
              to="/exercises" 
              @click="closeMenu"
            >
              Library
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'RoutineBuilder' }" 
              to="/routines" 
              @click="closeMenu"
            >
              Routines
            </router-link>
            <router-link 
              class="nav-link" 
              :class="{ active: $route.name === 'ProgressDashboard' }" 
              to="/progress" 
              @click="closeMenu"
            >
              Progress
            </router-link>
          </div>
        </div>
        <div class="nav-actions">
          <button 
            class="theme-toggle" 
            @click="toggleTheme"
            :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
            title="Toggle theme"
          >
            <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>
          <router-link class="user-avatar" to="/profile" @click="closeMenu">
            <div class="avatar-circle">
              <i class="bi bi-person"></i>
            </div>
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, getCurrentUserProfile } from '@/services/authService'
import { useTheme } from '@/composables/useTheme'

const isMenuOpen = ref(false)
const userProfile = ref(null)
const { theme, toggleTheme } = useTheme()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(async () => {
    const user = getCurrentUser()
    if (user) {
      const profile = await getCurrentUserProfile()
      userProfile.value = profile
    }
  })
  </script>

  <style scoped>
  .modern-navbar {
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #f0f0f0;
    backdrop-filter: blur(10px);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .dark .modern-navbar {
    background: #000000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    height: 64px;
    gap: 2rem;
  }

  .mobile-menu-toggle {
    display: none;
  }

  .navbar-logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #212529 !important;
    text-decoration: none;
    letter-spacing: -0.02em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }

  .dark .navbar-logo {
    color: #ffffff !important;
  }

  @media (min-width: 992px) {
    .navbar-logo:hover {
      color: #212529 !important;
      transform: translateY(-2px);
      text-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }

    .dark .navbar-logo:hover {
      color: #ffffff !important;
    }

    .navbar-logo:active {
      transform: translateY(0);
    }
  }

  .navbar-logo:focus {
    color: #212529 !important;
  }

  .dark .navbar-logo:focus {
    color: #ffffff !important;
  }

  .navbar-menu {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.625rem 1.125rem;
    text-decoration: none;
    color: #495057;
    font-weight: 500;
    font-size: 0.9375rem;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    letter-spacing: 0.01em;
  }

  .dark .nav-link {
    color: rgba(255, 255, 255, 0.85);
  }

  .dark .nav-link:hover {
    color: #ffffff;
  }

  .dark .nav-link.active {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-link::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    transition: transform 0.2s ease;
    z-index: -1;
  }

  .nav-link:hover {
    color: #212529;
    transform: translateY(-1px);
  }

  .nav-link:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }

  .dark .nav-link::before {
    background: rgba(255, 255, 255, 0.1);
  }

  .dark .nav-link:hover::before {
    background: rgba(255, 255, 255, 0.15);
  }

  .nav-link.active {
    color: #212529;
    font-weight: 600;
    background: #f0f7ff;
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 2px 2px 0 0;
    box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .theme-toggle {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: transparent;
    border: 2px solid rgba(0, 0, 0, 0.1);
    color: #495057;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .dark .theme-toggle {
    border-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
  }

  .theme-toggle:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  .dark .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }

  .user-avatar {
    display: inline-block;
  }

  .avatar-circle {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: transparent;
    color: #495057 !important; /* same as theme toggle in light mode */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: transform 0.2s ease;
    border: 2px solid rgba(0, 0, 0, 0.1);
  }

  .dark .avatar-circle {
    background: transparent;
    color: rgba(255, 255, 255, 0.8) !important; /* same as theme toggle in dark mode */
    border-color: rgba(255, 255, 255, 0.2);
  }

  .avatar-circle i {
    color: inherit;
  }

  .user-avatar:hover .avatar-circle {
    transform: translateY(-1px) scale(1.03);
  }

  .user-avatar:active .avatar-circle {
    transform: scale(1.0);
  }

  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .mobile-menu-toggle span {
    width: 24px;
    height: 2px;
    background: #212529;
    border-radius: 2px;
    transition: background 0.3s ease;
  }

  .dark .mobile-menu-toggle span {
    background: #ffffff;
  }

  @media (max-width: 991px) {
    .navbar-container {
      padding: 0 1rem;
      grid-template-columns: auto 1fr auto;
      gap: 0.75rem;
      height: 56px;
    }

    .mobile-menu-toggle {
      display: flex;
      padding: 0.25rem;
      margin: 0;
    }

    .navbar-logo {
      color: #212529 !important;
    }

    .navbar-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      flex-direction: column;
      align-items: stretch;
      padding: 1rem;
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, background 0.3s ease;
      z-index: 999;
      visibility: hidden;
      pointer-events: none;
    }

    .dark .navbar-menu {
      background: #000000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }

    .navbar-menu.show {
      max-height: 500px;
      visibility: visible;
      pointer-events: auto;
    }

    .nav-links {
      flex-direction: column;
      gap: 0;
      width: 100%;
    }

    .nav-link {
      width: 100%;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 0.25rem;
    }

    .nav-link.active::after {
      display: none;
    }

    .nav-link.active {
      background: #f8f9fa;
    }

    .nav-actions {
      display: flex;
      gap: 0.5rem;
    }

    .theme-toggle {
      width: 36px;
      height: 36px;
      font-size: 1.125rem;
    }

    .avatar-circle {
      width: 36px;
      height: 36px;
      font-size: 1.125rem;
    }
  }

  @media (max-width: 575px) {
    .navbar-container {
      padding: 0 0.5rem;
    }

    .navbar-logo {
      font-size: 1.25rem;
      color: #212529 !important;
    }
  }
  </style>
  