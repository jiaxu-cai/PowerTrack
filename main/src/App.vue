<template>
  <div id="app">
    <AppNavbar />  
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in" appear>
          <div :key="route.path" v-if="Component" class="page-wrapper">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from './components/AppNavbar.vue'
import { useTheme } from './composables/useTheme'

// Initialize theme - the composable handles initialization
useTheme()
</script>

<style>
@import './styles/main.css';

#app {
  min-height: 100vh;
  background: #ffffff;
  transition: background 0.3s ease;
}

.dark #app {
  background: #000000;
}

.main-content {
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
  background: transparent;
  transition: background 0.3s ease;
  overflow-x: hidden;
  position: relative;
}

@media (max-width: 991px) {
  .main-content {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 575px) {
  .main-content {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>