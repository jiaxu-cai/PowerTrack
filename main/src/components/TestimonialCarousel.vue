<template>
  <div class="testimonial-carousel">
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div class="testimonials-slider">
          <Transition name="testimonial-slide" mode="out-in">
            <div
              v-if="currentTestimonial"
              :key="`testimonial-${currentIndex}`"
              class="testimonial-card"
            >
              <div class="testimonial-header">
                <img 
                  :src="currentTestimonial.image" 
                  :alt="currentTestimonial.name"
                  class="testimonial-avatar"
                  @error="handleImageError"
                />
                <div class="testimonial-info">
                  <div class="testimonial-name">{{ currentTestimonial.name }}</div>
                  <div class="testimonial-role">{{ currentTestimonial.role }}</div>
                </div>
              </div>
              <p class="testimonial-quote">"{{ currentTestimonial.quote }}"</p>
              <div class="testimonial-rating">
                <i 
                  v-for="i in 5" 
                  :key="i"
                  class="bi bi-star-fill"
                  :class="{ 'star-active': i <= currentTestimonial.rating }"
                ></i>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button 
        class="carousel-nav carousel-prev"
        @click="previousTestimonial"
        :disabled="testimonials.length <= 1"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <button 
        class="carousel-nav carousel-next"
        @click="nextTestimonial"
        :disabled="testimonials.length <= 1"
      >
        <i class="bi bi-chevron-right"></i>
      </button>

      <!-- Indicators -->
      <div class="carousel-indicators" v-if="testimonials.length > 1">
        <button
          v-for="(testimonial, index) in testimonials"
          :key="`indicator-${index}`"
          class="indicator"
          :class="{ 'indicator-active': currentIndex === index }"
          @click="currentIndex = index"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  testimonials: {
    type: Array,
    required: true,
    default: () => []
  },
  autoPlay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  }
})

const currentIndex = ref(0)
let autoPlayTimer = null

const currentTestimonial = computed(() => {
  if (!props.testimonials || props.testimonials.length === 0) {
    return null
  }
  return props.testimonials[currentIndex.value]
})

const nextTestimonial = () => {
  currentIndex.value = (currentIndex.value + 1) % props.testimonials.length
}

const previousTestimonial = () => {
  currentIndex.value = currentIndex.value === 0 
    ? props.testimonials.length - 1 
    : currentIndex.value - 1
}

const handleImageError = (e) => {
  // Fallback to a placeholder if image fails to load
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="30" fill="%23e5e5e5"/%3E%3Cpath d="M32 20c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="%23ccc"/%3E%3C/svg%3E'
}

const startAutoPlay = () => {
  if (props.autoPlay && props.testimonials.length > 1) {
    autoPlayTimer = setInterval(() => {
      nextTestimonial()
    }, props.interval)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.testimonial-carousel {
  position: relative;
  width: 100%;
}

.carousel-container {
  position: relative;
  padding: 0 4rem;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
}

.testimonials-slider {
  position: relative;
  min-height: 300px;
}

.testimonial-card {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.dark .testimonial-card {
  background: #1a1a1a;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.testimonial-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.testimonial-info {
  flex: 1;
}

.testimonial-name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #030213;
  margin-bottom: 0.25rem;
}

.dark .testimonial-name {
  color: #ffffff;
}

.testimonial-role {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.5);
}

.dark .testimonial-role {
  color: rgba(255, 255, 255, 0.6);
}

.testimonial-quote {
  font-size: 1.125rem;
  font-style: italic;
  color: #030213;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  flex: 1;
}

.dark .testimonial-quote {
  color: #ffffff;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
}

.testimonial-rating .bi-star-fill {
  font-size: 1.25rem;
  color: #e5e5e5;
}

.testimonial-rating .bi-star-fill.star-active {
  color: #fbbf24;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dark .carousel-nav {
  background: rgba(26, 26, 26, 0.9);
  border-color: rgba(255, 255, 255, 0.2);
}

.carousel-nav:hover:not(:disabled) {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .carousel-nav:hover:not(:disabled) {
  background: rgba(26, 26, 26, 1);
  border-color: rgba(255, 255, 255, 0.3);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-prev {
  left: 0;
}

.carousel-next {
  right: 0;
}

.carousel-nav i {
  font-size: 1rem;
  color: #030213;
}

.dark .carousel-nav i {
  color: #ffffff;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.dark .indicator {
  background: rgba(255, 255, 255, 0.2);
}

.indicator:hover {
  background: rgba(0, 0, 0, 0.4);
}

.dark .indicator:hover {
  background: rgba(255, 255, 255, 0.4);
}

.indicator-active {
  background: rgba(0, 0, 0, 0.6);
  width: 1.5rem;
  border-radius: 0.25rem;
}

.dark .indicator-active {
  background: rgba(255, 255, 255, 0.6);
}

/* Transitions */
.testimonial-slide-enter-active,
.testimonial-slide-leave-active {
  transition: opacity 0.3s ease;
}

.testimonial-slide-enter-from {
  opacity: 0;
}

.testimonial-slide-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .carousel-container {
    padding: 0 3rem;
  }

  .testimonial-card {
    padding: 2rem;
    min-height: 250px;
  }

  .carousel-nav {
    width: 2rem;
    height: 2rem;
  }

  .carousel-prev {
    left: -1rem;
  }

  .carousel-next {
    right: -1rem;
  }
}
</style>

