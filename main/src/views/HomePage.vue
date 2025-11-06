<template>
  <div class="home-page-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Background Gradient -->
      <div class="hero-background">
        <div class="gradient-blob blob-1"></div>
        <div class="gradient-blob blob-2"></div>
      </div>

      <!-- Grid Ripple Effect (only in dark mode) -->
      <BackgroundRippleEffect 
        v-if="isDark"
        :rows="20" 
        :cols="40" 
        :cell-size="48"
        border-color="rgba(255, 255, 255, 0.15)"
        fill-color="rgba(255, 255, 255, 0.04)"
        :interactive="true"
      />

      <!-- Hero Content -->
      <div class="hero-container">
        <Transition name="hero-fade">
          <div v-if="true" class="hero-content">
            <!-- Badge -->
            <Transition name="fade-up" appear>
              <div v-if="true" class="hero-badge">
                <i class="bi bi-heart-pulse"></i>
                <span>Your Personal Fitness Journey</span>
              </div>
            </Transition>

            <!-- Title -->
            <Transition name="fade-up" appear :style="{ 'transition-delay': '0.1s' }">
              <h1 v-if="true" class="hero-title">
                Train Smarter.
                <br />
                Reach Your Goals.
              </h1>
            </Transition>

            <!-- Description -->
            <Transition name="fade-up" appear :style="{ 'transition-delay': '0.2s' }">
              <p v-if="true" class="hero-description">
                Personalized workout plans and running routes designed for your fitness level. 
                Track your progress and stay motivated every step of the way.
              </p>
            </Transition>

            <!-- CTA Buttons -->
            <Transition name="fade-up" appear :style="{ 'transition-delay': '0.3s' }">
              <div v-if="true" class="hero-actions">
                <router-link to="/workout" class="btn-primary">
                  Get Started 
                </router-link>
                <a href="#personalized-workout" class="btn-secondary" @click.prevent="scrollToPersonalizedWorkout">
                  See How It Works
                </a>
              </div>
            </Transition>

            <!-- Trust Indicators -->
            <Transition name="fade-up" appear :style="{ 'transition-delay': '0.5s' }">
              <div v-if="true" class="trust-indicators">
                <div class="trust-item">
                  <i class="bi bi-check-circle"></i>
                  <span>Free to Start</span>
                </div>
                <div class="trust-item">
                  <i class="bi bi-bullseye"></i>
                  <span>Track Your Progress</span>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Features Grid Section -->
    <section class="features-section">
      <div class="features-container">
        <Transition name="fade-up" appear>
          <div v-if="true" class="section-header">
            <h2 class="section-title">Everything You Need</h2>
            <p class="section-subtitle">
              Powerful features designed to help you reach your fitness goals.
            </p>
          </div>
        </Transition>

        <div class="features-grid">
          <Transition
            v-for="(feature, index) in features"
            :key="feature.title"
            name="fade-up"
            appear
            :style="{ 'transition-delay': `${index * 0.1}s` }"
          >
            <div 
              v-if="true"
              class="feature-card"
              :class="feature.bgClass"
            >
              <div class="feature-icon" :class="feature.iconClass">
                <i :class="feature.icon"></i>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Product Showcase Section -->
    <section id="personalized-workout" class="showcase-section">
      <div class="showcase-container">
        <!-- Workout Plans Showcase -->
        <div class="showcase-item">
          <Transition name="fade-up" appear>
            <div v-if="true" class="showcase-content">
              <div class="showcase-badge">
                <i class="bi bi-heart-pulse"></i>
                <span>Custom Workouts</span>
              </div>
              <h2 class="showcase-title">Personalized Workout Plans</h2>
              <p class="showcase-description">
                Get workout routines matched to your fitness level, goals, and available equipment. 
                Every exercise is carefully selected to help you progress safely and effectively.
              </p>
              <div class="showcase-features">
                <div 
                  v-for="(item, index) in workoutFeatures"
                  :key="index"
                  class="showcase-feature-item"
                >
                  <div class="feature-check">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="fade-up" appear :style="{ 'transition-delay': '0.2s' }">
            <div v-if="true" class="showcase-image">
              <div class="image-card">
                <div class="image-placeholder workout-image">
                  <div class="image-overlay"></div>
                  <div class="profile-summary-card">
                    <div class="app-header-profile">
                      <div class="d-flex align-items-center gap-3">
                        <div class="app-avatar-profile">
                          <i class="bi bi-person"></i>
                        </div>
                        <div>
                          <h1 class="app-username-profile mb-0">Ah Gong</h1>
                          <p class="app-email-profile mb-0">ahgong@gmail.com</p>
                        </div>
                      </div>
                    </div>
                    <div class="profile-stats">
                      <div class="stat-item">
                        <div class="stat-value">22.5</div>
                        <div class="stat-label">BMI</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-value">Intermediate</div>
                        <div class="stat-label">Experience</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-value">Strength</div>
                        <div class="stat-label">Goal</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Route Discovery Showcase -->
        <div class="showcase-item reverse">
          <Transition name="fade-up" appear>
            <div v-if="true" class="showcase-image">
              <div class="image-card">
                <div class="image-placeholder route-image">
                  <div class="image-overlay"></div>
                  <div class="route-card-example">
                    <div class="route-content-example">
                      <h3 class="route-name-example">Route 1</h3>
                      <div class="route-badges-example">
                        <span class="route-badge-example distance">5.0 km</span>
                        <span class="route-badge-example type loop">Loop</span>
                        <span class="route-badge-example elevation">
                          <i class="bi bi-graph-up-arrow"></i>
                          <span>12m</span>
                        </span>
                      </div>
                      <div class="route-meta-example">
                        <div class="route-meta-item-example">
                          <i class="bi bi-geo-alt"></i>
                          <span>178902</span>
                        </div>
                        <div class="route-meta-item-example">
                          <i class="bi bi-clock"></i>
                          <span>30 minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="fade-up" appear :style="{ 'transition-delay': '0.2s' }">
            <div v-if="true" class="showcase-content">
              <div class="showcase-badge">
                <i class="bi bi-signpost-split"></i>
                <span>Running Routes</span>
              </div>
              <h2 class="showcase-title">Discover Perfect Routes</h2>
              <p class="showcase-description">
                Find the best running and cycling routes near you. Get detailed information 
                about distance, terrain, and difficulty to match your fitness level.
              </p>
              <div class="showcase-features">
                <div 
                  v-for="(item, index) in routeFeatures"
                  :key="index"
                  class="showcase-feature-item"
                >
                  <div class="feature-check">
                    <i class="bi bi-check-circle"></i>
                  </div>
                  <span>{{ item }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="stats-section" class="stats-section">
      <div class="stats-container">
        <Transition name="fade-up" appear>
          <div v-if="true" class="stats-header">
            <h2 class="stats-title">Where Everyday Athletes Level Up</h2>
            <p class="stats-subtitle">
              A growing community of fitness enthusiasts achieving their goals every day.
            </p>
          </div>
        </Transition>

        <div class="stats-grid">
          <Transition
            v-for="(stat, index) in stats"
            :key="stat.label"
            name="fade-up"
            appear
            :style="{ 'transition-delay': `${index * 0.1}s` }"
          >
            <div v-if="true" class="stat-card">
              <div class="stat-value">{{ formatStatValue(stat.value, index) }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </Transition>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="testimonials-container">
        <Transition name="fade-up" appear>
          <div v-if="true" class="section-header">
            <h2 class="section-title">What People Say</h2>
            <p class="section-subtitle">
              Real stories from users transforming their fitness journey.
            </p>
          </div>
        </Transition>

        <Transition name="fade-up" appear :style="{ 'transition-delay': '0.2s' }">
          <TestimonialCarousel v-if="true" :testimonials="testimonials" />
        </Transition>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="final-cta-section">
      <div class="cta-container">
        <Transition name="fade-up" appear>
          <div v-if="true" class="cta-content">
            <h2 class="cta-title">Start Your Fitness Journey</h2>
            <p class="cta-description">
              Join thousands of users achieving their fitness goals with personalized 
              workouts and curated route recommendations.
            </p>
            <div class="cta-actions">
              <router-link to="/profile" class="btn-primary">
                Start Your Journey
                <i class="bi bi-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BackgroundRippleEffect from '../components/BackgroundRippleEffect.vue'
import TestimonialCarousel from '../components/TestimonialCarousel.vue'
import { useTheme } from '../composables/useTheme'

const { theme } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const features = [
  {
    icon: 'bi bi-heart-pulse',
    title: 'Personalized Workouts',
    description: 'Get workout plans tailored to your fitness level, goals, and available equipment.',
    bgClass: 'feature-blue',
    iconClass: 'icon-blue'
  },
  {
    icon: 'bi bi-signpost-split',
    title: 'Route Discovery',
    description: 'Find running and cycling routes near you with detailed distance and terrain information.',
    bgClass: 'feature-indigo',
    iconClass: 'icon-indigo'
  },
  {
    icon: 'bi bi-bullseye',
    title: 'Progress Tracking',
    description: 'Monitor your workouts with detailed analytics and celebrate your achievements.',
    bgClass: 'feature-green',
    iconClass: 'icon-green'
  },
  {
    icon: 'bi bi-lightning-charge',
    title: 'Quick Sessions',
    description: 'Short on time? Access efficient workouts that fit into your busy schedule.',
    bgClass: 'feature-orange',
    iconClass: 'icon-orange'
  }
]

const workoutFeatures = [
  'Adapts to your fitness level',
  'Preference-based recommendations',
  'Progressive difficulty scaling',
  'Track every workout session'
]

const routeFeatures = [
  'Location-based recommendations',
  'Route type selections',
  'Distance and elevation data',
  'Variety of choices'
]

const stats = [
  { value: '15K+', label: 'Calories Burned Weekly' },
  { value: '63', label: 'Exercises Available' },
  { value: '1000', label: 'Routes Discovered' },
  { value: '50.0', label: 'Average Rating' }
]

const testimonials = [
  {
    name: 'Ong Jianyong',
    role: 'Beginner Fitness Enthusiast',
    image: 'https://images.unsplash.com/photo-1607286908165-b8b6a2874fc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    quote: 'Finally, an app that understands my fitness level. The personalized workouts are perfect for my goals.',
    rating: 5
  },
  {
    name: 'Dr Keith Fwa',
    role: 'WAD2 Professor',
    image: 'https://images.unsplash.com/photo-1678875524808-78e1d24b6597?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    quote: 'The route recommendations are incredible. I\'ve discovered so many great running paths I never knew existed.',
    rating: 5
  },
  {
    name: 'Alvin Tay',
    role: 'WAD2 Instructor',
    image: 'https://images.unsplash.com/photo-1554885730-e5d7a39e0d50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    quote: 'The app adapts to my changing fitness journey. It\'s like having a personal trainer in my pocket.',
    rating: 5
  }
]

const countUpStats = ref([0, 0, 0, 0])

const formatStatValue = (value, index) => {
  if (value.includes('K') || value.includes('M')) {
    const num = countUpStats.value[index]
    return `${num}${value.replace(/[0-9.]/g, '')}`
  } else if (value.includes('.')) {
    return (countUpStats.value[index] / 10).toFixed(1)
  }
  return countUpStats.value[index]
}



const scrollToPersonalizedWorkout = () => {
  const element = document.getElementById('personalized-workout')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Count up animation for stats
onMounted(() => {
  const statsElement = document.getElementById('stats-section')
  if (statsElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stats.forEach((stat, index) => {
              const target = parseInt(stat.value.replace(/[^0-9.]/g, ''))
              let current = 0
              const increment = target / 50
              const timer = setInterval(() => {
                current += increment
                if (current >= target) {
                  current = target
                  clearInterval(timer)
                }
                countUpStats.value[index] = Math.floor(current)
              }, 30)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(statsElement)
  }
})
</script>


