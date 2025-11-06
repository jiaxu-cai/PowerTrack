<template>
  <div class="user-profile-view">
    <!-- Not authenticated -->
    <div v-if="!userProfile && !AuthService.getCurrentUser()" class="empty-state" style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="app-card text-center" style="padding: 3rem;">
              <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 1.5rem;">
                <i class="bi bi-person-circle"></i>
              </div>
              <h2 style="font-size: 1.75rem; font-weight: 500; margin-bottom: 1rem;">Welcome to PowerTrack</h2>
              <p class="welcome-text" style="margin-bottom: 2rem;">Sign in to access your personalized fitness profile and start tracking your progress.</p>
              <button class="app-save-btn" @click="showSignIn = true">
                <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Authenticated but loading -->
    <div v-else-if="AuthService.getCurrentUser() && !userProfile" class="empty-state" style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="app-card text-center" style="padding: 3rem;">
              <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 1.5rem;">
                <i class="bi bi-person-circle"></i>
              </div>
              <h2 style="font-size: 1.75rem; font-weight: 500; margin-bottom: 1rem;">Setting up your profile...</h2>
              <p class="welcome-text" style="margin-bottom: 2rem;">Please wait while we load your profile information.</p>
              <div class="spinner-border" role="status" style="color: #030213;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile loaded -->
    <div v-else>
      <div class="profile-container">
        <!-- Header -->
        <Transition name="header-fade" appear>
          <div v-if="true" class="app-header">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <div class="d-flex align-items-center gap-3">
                <div class="app-avatar">
                  <i class="bi bi-person"></i>
                </div>
                <div>
                  <h1 class="app-username mb-0">{{ profileForm.username }}</h1>
                  <p class="app-email mb-0">{{ profileForm.email }}</p>
                </div>
              </div>
              <button class="app-signout-btn d-flex align-items-center" @click="signOut">
                <i class="bi bi-box-arrow-right me-2"></i>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </Transition>

        <form @submit.prevent="updateProfile">
          <!-- Personal Information -->
          <Transition name="section-fade" appear>
            <div v-if="true" class="app-card" style="transition-delay: 0.1s;">
              <h3 class="app-card-title">Personal Information</h3>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="app-label">Username</label>
                  <input
                    type="text"
                    class="app-input"
                    v-model="profileForm.username"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div class="col-md-6">
                  <label class="app-label">Experience Level</label>
                  <select class="app-select" v-model="profileForm.experienceLevel" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Body Metrics -->
          <Transition name="section-fade" appear>
            <div v-if="true" class="app-card" style="transition-delay: 0.15s;">
              <h3 class="app-card-title">Body Metrics</h3>
              
              <!-- Height & Weight Inputs -->
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label class="app-label">Height</label>
                  <div class="app-input-group">
                    <input
                      type="number"
                      class="app-input"
                      v-model="profileForm.heightCm"
                      placeholder="160"
                      min="100"
                      max="250"
                      required
                    />
                    <span class="app-input-suffix">cm</span>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="app-label">Weight</label>
                  <div class="app-input-group">
                    <input
                      type="number"
                      class="app-input"
                      v-model="profileForm.weightKg"
                      placeholder="45"
                      min="30"
                      max="300"
                      step="0.1"
                      required
                    />
                    <span class="app-input-suffix">kg</span>
                  </div>
                </div>
              </div>

              <!-- BMI Display -->
              <div class="bmi-card">
                <div class="bmi-header-label">
                  <i class="bi bi-heart-pulse"></i>
                  <span>BODY MASS INDEX</span>
                </div>

                <div v-if="bmiData.value">
                  <div class="bmi-display">
                    <div class="bmi-value">{{ bmiData.value }}</div>
                    <span class="bmi-badge" :class="bmiData.categoryClass">
                      {{ bmiData.category }}
                    </span>
                  </div>

                  <!-- BMI Range Indicator -->
                  <div class="bmi-range">
                    <div class="bmi-bar">
                      <div class="bmi-bar-segment blue"></div>
                      <div class="bmi-bar-segment green"></div>
                      <div class="bmi-bar-segment orange"></div>
                      <div class="bmi-bar-segment red"></div>
                    </div>
                    <div class="bmi-pointer-container">
                      <div class="bmi-pointer" :style="{ left: bmiData.position + '%' }"></div>
                    </div>
                    <div class="bmi-labels">
                      <span>18.5</span>
                      <span>25</span>
                      <span>30</span>
                    </div>
                  </div>
                </div>

                <div v-else class="bmi-placeholder">
                  <p>Enter your height and weight to calculate BMI</p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Fitness Preferences -->
          <Transition name="section-fade" appear>
            <div v-if="true" class="app-card" style="transition-delay: 0.2s;">
              <h3 class="app-card-title">Fitness Preferences</h3>
              
              <div class="mb-3">
                <label class="app-label">Primary Goal</label>
                <select class="app-select" v-model="profileForm.goal" required>
                  <option value="general_fitness">General Fitness</option>
                  <option value="strength">Strength</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="endurance">Endurance</option>
                </select>
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="app-label">Preferred Intensity</label>
                  <select class="app-select" v-model="profileForm.preferredIntensity" required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="app-label">Workout Duration</label>
                  <div class="app-input-group">
                    <input
                      type="number"
                      class="app-input"
                      v-model="profileForm.preferredTimeMin"
                      placeholder="45"
                      min="10"
                      max="180"
                      required
                    />
                    <span class="app-input-suffix">min</span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Save Button -->
          <Transition name="section-fade" appear>
            <div v-if="true" style="transition-delay: 0.3s;">
              <button type="submit" class="app-save-btn" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
                {{ saving ? 'Saving Changes...' : 'Save Changes' }}
              </button>
            </div>
          </Transition>
        </form>
      </div>
    </div>

    <!-- Sign In Modal -->
    <Transition name="fade">
      <div v-if="showSignIn" class="app-modal-backdrop" @mousedown.self="showSignIn = false">
        <div class="app-modal">
          <div class="app-modal-header">
            <h5 class="app-modal-title">Sign In</h5>
            <button class="app-modal-close" @click="showSignIn = false">
              <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
            </button>
          </div>
          <div class="app-modal-body">
            <form @submit.prevent="signIn">
              <div class="form-group">
                <label class="app-label">Email</label>
                <input
                  type="email"
                  class="app-input"
                  v-model="signInForm.email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div class="form-group">
                <label class="app-label">Password</label>
                <input
                  type="password"
                  class="app-input"
                  v-model="signInForm.password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" class="app-modal-submit" :disabled="signingIn">
                <span v-if="signingIn" class="spinner-border spinner-border-sm me-2"></span>
                {{ signingIn ? 'Signing In...' : 'Sign In' }}
              </button>
              <div class="app-modal-footer">
                <p>
                  Don't have an account? 
                  <a href="#" @click.prevent="showSignUp = true; showSignIn = false">Sign up</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sign Up Modal -->
    <Transition name="fade">
      <div v-if="showSignUp" class="app-modal-backdrop" @mousedown.self="showSignUp = false">
        <div class="app-modal">
          <div class="app-modal-header">
            <h5 class="app-modal-title">Sign Up</h5>
            <button class="app-modal-close" @click="showSignUp = false">
              <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
            </button>
          </div>
          <div class="app-modal-body">
            <form @submit.prevent="signUp">
              <div class="form-group">
                <label class="app-label">Email</label>
                <input
                  type="email"
                  class="app-input"
                  v-model="signUpForm.email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div class="form-group">
                <label class="app-label">Password</label>
                <input
                  type="password"
                  class="app-input"
                  v-model="signUpForm.password"
                  placeholder="Choose a password"
                  required
                />
              </div>
              <div class="form-group">
                <label class="app-label">Username</label>
                <input
                  type="text"
                  class="app-input"
                  v-model="signUpForm.username"
                  placeholder="Your name"
                  required
                />
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <div class="form-group">
                    <label class="app-label">Height (cm)</label>
                    <input
                      type="number"
                      class="app-input"
                      v-model="signUpForm.heightCm"
                      placeholder="175"
                      required
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="app-label">Weight (kg)</label>
                    <input
                      type="number"
                      class="app-input"
                      v-model="signUpForm.weightKg"
                      placeholder="70"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <div class="form-group">
                    <label class="app-label">Goal</label>
                    <select class="app-select" v-model="signUpForm.goal" required>
                      <option value="weight_loss">Weight Loss</option>
                      <option value="muscle_gain">Muscle Gain</option>
                      <option value="endurance">Endurance</option>
                      <option value="strength">Strength</option>
                      <option value="general_fitness">General Fitness</option>
                    </select>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="app-label">Experience</label>
                    <select class="app-select" v-model="signUpForm.experienceLevel" required>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" class="app-modal-submit" :disabled="signingUp">
                <span v-if="signingUp" class="spinner-border spinner-border-sm me-2"></span>
                {{ signingUp ? 'Creating Account...' : 'Sign Up' }}
              </button>
              <div class="app-modal-footer">
                <p>
                  Already have an account? 
                  <a href="#" @click.prevent="showSignIn = true; showSignUp = false">Sign in</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

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
import { ref, onMounted, computed } from 'vue'
import { AuthService } from '../services/authService.js'
import { WorkoutService } from '../services/workoutService.js'
import { getErrorMessage } from '../utils/errorHandler.js'

const userProfile = ref(null)
const saving = ref(false)
const signingIn = ref(false)
const signingUp = ref(false)
const showSignIn = ref(false)
const showSignUp = ref(false)

// Toast notification
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const profileForm = ref({
  username: '',
  email: '',
  experienceLevel: 'beginner',
  heightCm: 175,
  weightKg: 70,
  goal: 'general_fitness',
  preferredIntensity: 'medium',
  preferredTimeMin: 45
})

const signInForm = ref({
  email: '',
  password: ''
})

const signUpForm = ref({
  email: '',
  password: '',
  username: '',
  heightCm: 175,
  weightKg: 70,
  goal: 'general_fitness',
  experienceLevel: 'beginner',
  preferredIntensity: 'medium',
  preferredTimeMin: 45
})

// BMI Calculation
const bmiData = computed(() => {
  const h = parseFloat(profileForm.value.heightCm)
  const w = parseFloat(profileForm.value.weightKg)
  
  if (!h || !w || h <= 0 || w <= 0) {
    return { value: null, category: '', categoryClass: '', position: 0 }
  }
  
  const heightInMeters = h / 100
  const bmi = w / (heightInMeters * heightInMeters)
  const bmiValue = bmi.toFixed(1)
  
  let category = ''
  let categoryClass = ''
  let position = 0
  
  if (bmi < 18.5) {
    category = 'Underweight'
    categoryClass = 'underweight'
    position = (bmi / 18.5) * 25 // 0-25% range
  } else if (bmi < 25) {
    category = 'Normal'
    categoryClass = 'normal'
    position = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25 // 25-50% range
  } else if (bmi < 30) {
    category = 'Overweight'
    categoryClass = 'overweight'
    position = 50 + ((bmi - 25) / (30 - 25)) * 25 // 50-75% range
  } else {
    category = 'Obese'
    categoryClass = 'obese'
    position = Math.min(75 + ((bmi - 30) / 10) * 25, 100) // 75-100% range
  }
  
  return {
    value: bmiValue,
    category,
    categoryClass,
    position
  }
})

onMounted(async () => {
  AuthService.onAuthStateChanged(async (user) => {
    if (user) {
      await new Promise(resolve => setTimeout(resolve, 500))
      await loadUserProfile()
    } else {
      userProfile.value = null
      profileForm.value = {
        username: '',
        email: '',
        experienceLevel: 'beginner',
        heightCm: 175,
        weightKg: 70,
        goal: 'general_fitness',
        preferredIntensity: 'medium',
        preferredTimeMin: 45
      }
    }
  })
  
  await loadUserProfile()
})

// Toast notification function
const showNotification = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const loadUserProfile = async () => {
  try {
    const currentUser = AuthService.getCurrentUser()
    
    if (!currentUser) {
      userProfile.value = null
      return
    }
    
    userProfile.value = await AuthService.getCurrentUserProfile()
    
    if (userProfile.value) {
      profileForm.value = { ...userProfile.value }
    } else {
      await createProfileForCurrentUser()
    }
  } catch (error) {
    console.error('Error loading user profile:', error)
    userProfile.value = null
  }
}

const updateProfile = async () => {
  saving.value = true
  try {
    await AuthService.updateProfile(profileForm.value)
    await loadUserProfile()
    showNotification('Profile saved successfully!', 'success')
  } catch (error) {
    console.error('Error updating profile:', error)
    showNotification(getErrorMessage(error, 'Error saving profile. Please try again.'), 'error')
  } finally {
    saving.value = false
  }
}

const signIn = async () => {
  signingIn.value = true
  try {
    await AuthService.signIn(signInForm.value.email, signInForm.value.password)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    await loadUserProfile()
    showSignIn.value = false
    signInForm.value = { email: '', password: '' }
    showNotification('Welcome back!', 'success')
  } catch (error) {
    console.error('Error signing in:', error)
    
    if (error.code === 'auth/user-not-found') {
      showNotification('No account found with this email.', 'error')
    } else if (error.code === 'auth/wrong-password') {
      showNotification('Incorrect password.', 'error')
    } else if (error.code === 'auth/invalid-email') {
      showNotification('Invalid email address.', 'error')
    } else if (error.code === 'auth/too-many-requests') {
      showNotification('Too many attempts. Try again later.', 'error')
    } else {
      showNotification('Error signing in. Please try again.', 'error')
    }
  } finally {
    signingIn.value = false
  }
}

const signUp = async () => {
  signingUp.value = true
  try {
    const userData = {
      username: signUpForm.value.username,
      experienceLevel: signUpForm.value.experienceLevel,
      heightCm: signUpForm.value.heightCm,
      weightKg: signUpForm.value.weightKg,
      goal: signUpForm.value.goal,
      preferredIntensity: signUpForm.value.preferredIntensity,
      preferredTimeMin: signUpForm.value.preferredTimeMin
    }
    
    await AuthService.signUp(signUpForm.value.email, signUpForm.value.password, userData)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    await loadUserProfile()
    
    if (userProfile.value) {
      showSignUp.value = false
      signUpForm.value = {
        email: '',
        password: '',
        username: '',
        heightCm: 175,
        weightKg: 70,
        goal: 'general_fitness',
        experienceLevel: 'beginner',
        preferredIntensity: 'medium',
        preferredTimeMin: 45
      }
      showNotification('Account created successfully!', 'success')
    }
  } catch (error) {
    console.error('Error signing up:', error)
    
    if (error.code === 'auth/email-already-in-use') {
      showNotification('Email already in use.', 'error')
    } else if (error.code === 'auth/weak-password') {
      showNotification('Password is too weak.', 'error')
    } else if (error.code === 'auth/invalid-email') {
      showNotification('Invalid email address.', 'error')
    } else {
      showNotification('Error creating account.', 'error')
    }
  } finally {
    signingUp.value = false
  }
}

const signOut = async () => {
  try {
    await AuthService.signOut()
    userProfile.value = null
    profileForm.value = {
      username: '',
      email: '',
      experienceLevel: 'beginner',
      heightCm: 175,
      weightKg: 70,
      goal: 'general_fitness',
      preferredIntensity: 'medium',
      preferredTimeMin: 45
    }
    showNotification('Signed out successfully.', 'success')
  } catch (error) {
    console.error('Error signing out:', error)
    showNotification('Error signing out.', 'error')
  }
}

const createProfileForCurrentUser = async () => {
  try {
    const currentUser = AuthService.getCurrentUser()
    if (!currentUser) {
      return
    }
    
    const defaultProfileData = {
      uid: currentUser.uid,
      email: currentUser.email,
      username: currentUser.email?.split('@')[0] || 'User',
      experienceLevel: 'beginner',
      heightCm: 175,
      weightKg: 70,
      goal: 'general_fitness',
      preferredIntensity: 'medium',
      preferredTimeMin: 45
    }
    
    await WorkoutService.createUserProfile(defaultProfileData)
    await loadUserProfile()
  } catch (error) {
    console.error('Error creating profile:', error)
  }
}
</script>

<style scoped>
/* Fade transition for modals and notifications */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
