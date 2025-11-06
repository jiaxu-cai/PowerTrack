<template>
  <div class="running-routes-view">
    <div class="routes-container">
      
      <Transition name="header-fade">
        <div v-if="true" class="page-header">
          <h1 class="page-title">Running Routes</h1>
          <p class="page-subtitle">Find the perfect running route based on your distance and location</p>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.1s">
        <div v-if="true" class="preferences-card">
          <h2 class="preferences-title">Route Preferences</h2>
          
              <form @submit.prevent="findRoutes">
            <div class="preferences-grid">
              
              <div class="preference-group">
                <label for="postalCode" class="preference-label">
                  Postal Code
                    </label>
                    <input 
                      type="text" 
                  class="preference-input" 
                      id="postalCode"
                  placeholder="123456"
                      v-model="searchForm.postalCode"
                      @keyup.enter="findRoutes"
                      required
                    >
                <p class="preference-helper">We'll find routes starting from this location</p>
                  </div>

              
              <div class="preference-group">
                <label for="distance" class="preference-label">
                  Distance
                    </label>
                <select class="preference-select" id="distance" v-model="searchForm.distance">
                      <option value="1">1 km</option>
                      <option value="2">2 km</option>
                      <option value="3">3 km</option>
                      <option value="5">5 km</option>
                      <option value="10">10 km</option>
                      <option value="15">15 km</option>
                      <option value="20">20 km</option>
                    </select>
                  </div>

              
              <div class="preference-group">
                <label for="routeType" class="preference-label">
                  Route Type
                    </label>
                <select class="preference-select" id="routeType" v-model="searchForm.routeType">
                      <option value="all">All</option>
                      <option value="loop">Loop</option>
                      <option value="point-to-point">Point to Point</option>
                    </select>
                  </div>
                </div>
                
                  <button 
              class="search-button" 
                    type="submit"
                    :disabled="loading || !searchForm.postalCode"
                  >
              <i class="bi bi-search"></i>
              {{ loading ? 'Searching...' : 'Find Running Routes' }}
                  </button>
              </form>
            </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.2s">
        <div v-if="routes.length > 0 || searchPerformed || loading">
          <div class="results-header">
            <h2 class="results-title">Route Results</h2>
            <p v-if="routes.length > 0" class="results-subtitle">Found {{ routes.length }} Route{{ routes.length !== 1 ? 's' : '' }}</p>
      </div>

              
          <div v-if="loading" class="loading-state">
            <div class="spinner-border" role="status"></div>
            <p>Finding the best running routes for you...</p>
              </div>

              
          <div v-else-if="error" class="error-state">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ error }}</span>
              </div>

          
          <div v-else-if="routes.length > 0" class="routes-grid">
            <TransitionGroup name="route-card">
              <div 
                v-for="(route, index) in routes" 
                :key="index" 
                class="route-card"
                :style="{ '--transition-delay': (0.1 * (index + 2)) + 's' }"
              >
                
                <div class="route-map-preview">
                  
                  <div v-if="!getMapLoadedState(index)" class="map-placeholder" style="z-index: 1;">
                    <div class="spinner-border spinner-border-sm" role="status" style="width: 1.5rem; height: 1.5rem; border-width: 2px; color: rgba(0, 0, 0, 0.3); margin-bottom: 0.5rem;">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    <p style="font-size: 0.8125rem; opacity: 0.5; color: #030213; margin: 0;">Loading map...</p>
                </div>
                
                  
                  <div 
                    :id="`map-preview-${index}`" 
                    class="map-container"
                    v-show="getMapLoadedState(index)"
                  ></div>
                      </div>
                      
                
                <div class="route-content">
                  
                  <h3 class="route-name">{{ getRouteName(route, index) }}</h3>

                  
                  <div class="route-badges">
                    <span class="route-badge distance">{{ formatDistance(route.distance || 0) }}</span>
                    <span class="route-badge type" :class="(route.routeType || 'loop').replace('_', '-')">{{ getRouteTypeLabel(route.routeType || 'loop') }}</span>
                    <span class="route-badge elevation">
                      <i class="bi bi-graph-up-arrow"></i>
                      <span>{{ getRouteElevation(route) }}</span>
                    </span>
                      </div>

                  
                  <div class="route-meta">
                    <div class="route-meta-item">
                      <i class="bi bi-geo-alt"></i>
                      <span>{{ route.startLocation }}</span>
                            </div>
                    <div class="route-meta-item">
                      <i class="bi bi-clock"></i>
                      <span>{{ calculateTiming(route.distance) }}</span>
                        </div>
                      </div>

                  
                  <div class="route-actions">
                    <button 
                      class="route-action-btn outline"
                      @click="viewOnMap(route)"
                    >
                      <i class="bi bi-arrows-fullscreen"></i>
                      Full View
                        </button>
                    <button 
                      class="route-action-btn primary"
                      @click="startRoute(route)"
                    >
                      <i class="bi bi-play-fill"></i>
                      Start Route
                        </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
              </div>

              
          <div v-else-if="!loading && searchPerformed" class="empty-state">
            <i class="bi bi-geo-alt"></i>
            <h4>No routes available</h4>
            <p>No routes found within ±30% of your selected distance. Try adjusting your distance or postal code.</p>
          </div>
        </div>
      </Transition>

      
      <Transition name="section-fade" style="--transition-delay: 0.2s">
        <div v-if="!loading && !searchPerformed && routes.length === 0" class="empty-state">
          <i class="bi bi-geo-alt"></i>
          <h4>Ready to find your perfect route?</h4>
          <p>Enter your postal code and desired distance to get started</p>
      </div>
      </Transition>
    </div>

    
    <Transition name="fade">
      <div v-if="selectedRoute" class="user-profile-view">
        <div class="app-modal-backdrop" @click.self="closeMapModal">
          <div class="app-modal" style="max-width: 90vw; width: 1200px;">
            <div class="app-modal-header">
              <h5 class="app-modal-title">Route Map</h5>
              <button class="app-modal-close" @click="closeMapModal">
                <i class="bi bi-x-lg" style="font-size: 0.875rem;"></i>
              </button>
            </div>
            <div class="app-modal-body" style="padding: 0;">
              <div id="map" style="height: 500px; width: 100%; border-radius: 0 0 1rem 1rem; overflow: hidden;"></div>
          </div>
            <div class="app-modal-footer" style="display: flex; gap: 0.75rem; padding: 1rem 1.5rem;">
              <button 
                type="button" 
                class="app-input" 
                style="flex: 1; height: 3rem; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; font-weight: 500;"
                @click="closeMapModal"
              >
                Close
              </button>
              <button 
                type="button" 
                class="app-input"
                style="flex: 1; height: 3rem; background: #030213; color: white; cursor: pointer; font-weight: 500; border: none;"
                @click="startRouteFromModal"
              >
                Start This Route
              </button>
          </div>
          </div>
        </div>
      </div>
    </Transition>

    
    <ActiveWorkoutModal 
      :show="showActiveWorkoutModal" 
      @cancel="handleCancelActiveWorkout"
      @end-workout="handleEndActiveWorkout"
    />

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { mapsService } from '../services/mapsService.js'
import { WorkoutStateService } from '../services/workoutStateService.js'
import ActiveWorkoutModal from '../components/ActiveWorkoutModal.vue'


const router = useRouter()

const searchForm = reactive({
  postalCode: '',
  distance: '5',
  routeType: 'all'
})

const loading = ref(false)
const error = ref('')
const searchPerformed = ref(false)
const routes = ref([])
const selectedRoute = ref(null)
const showActiveWorkoutModal = ref(false)
const pendingRouteData = ref(null)

const DRAFT_SEARCH_KEY = 'draftRunningRoutesSearch'
const DRAFT_ROUTES_KEY = 'draftRunningRoutesResults'

// helper labels
const getRouteTypeLabel = (routeType) => {
  const labels = {
    'loop': 'Loop',
    'point-to-point': 'Point to Point'
  }
  return labels[routeType] || 'Loop'
}

const calculateTiming = (distance) => {
  const pacePerKm = 6
  const totalMinutes = Math.round(distance * pacePerKm)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes} minutes`
  }
}

const formatDistance = (distance) => {
  if (distance === null || distance === undefined) return '0 km'
  const numDistance = typeof distance === 'number' ? distance : parseFloat(distance)
  if (isNaN(numDistance)) return '0 km'
  return `${numDistance.toFixed(1)} km`
}

const getRouteName = (route, index) => {
  return `Route ${index + 1}`
}

const getRouteElevation = (route) => {
  if (route.elevation) {
    return `${route.elevation}m`
  }
  
  
  const baseElevation = Math.round((route.distance || 5) * 2.4)
  const variation = Math.floor(Math.random() * 20) - 10
  const elevation = Math.max(5, baseElevation + variation)
  return `${elevation}m`
}

const mapLoadedStates = ref({})

const getMapLoadedState = (index) => {
  return mapLoadedStates.value[`map-${index}`] === true
}

const markMapAsLoaded = (index) => {
  mapLoadedStates.value[`map-${index}`] = true
}

const loadDraftState = () => {
  try {
    const savedSearch = localStorage.getItem(DRAFT_SEARCH_KEY)
    if (savedSearch) {
      const searchData = JSON.parse(savedSearch)
      Object.assign(searchForm, searchData)
    }

    const savedRoutes = localStorage.getItem(DRAFT_ROUTES_KEY)
    if (savedRoutes) {
      const routesData = JSON.parse(savedRoutes)
      routes.value = routesData.routes || []
      searchPerformed.value = routesData.searchPerformed || false
    }
  } catch (error) {
    console.error('Error loading draft state:', error)
  }
}

const saveDraftState = () => {
  try {
    // Save search form
    localStorage.setItem(DRAFT_SEARCH_KEY, JSON.stringify(searchForm))
    
    // Save routes results
    localStorage.setItem(DRAFT_ROUTES_KEY, JSON.stringify({
      routes: routes.value,
      searchPerformed: searchPerformed.value
    }))
  } catch (error) {
    console.error('Error saving draft state:', error)
  }
}

const findRoutes = async () => {
  if (!searchForm.postalCode.trim()) {
    return
  }

  loading.value = true
  error.value = ''
  searchPerformed.value = true

  try {
    await mapsService.loadGoogleMaps()
    
    routes.value = await mapsService.generateRunningRoute(
      searchForm.postalCode,
      parseInt(searchForm.distance),
      searchForm.routeType
    )
    
    if (routes.value.length === 0) {
      error.value = 'No routes available within ±30% of your selected distance. Try adjusting your distance or postal code.'
    }
    
    saveDraftState()
    
    mapLoadedStates.value = {}
    
    await nextTick()
    setTimeout(() => {
      initializeMapPreviews()
    }, 500)
  } catch (err) {
    error.value = 'Failed to find routes. Please check your postal code and try again.'
    console.error('Error finding routes:', err)
  } finally {
    loading.value = false
  }
}



const viewOnMap = (route) => {
  selectedRoute.value = route
    setTimeout(() => {
      initializeMap(route)
  }, 100)
}

const closeMapModal = () => {
  selectedRoute.value = null
}

const startRouteFromModal = () => {
  if (selectedRoute.value) {
    startRoute(selectedRoute.value)
    closeMapModal()
  }
}

const initializeMap = async (route) => {
  try {
    await mapsService.loadGoogleMaps()
    
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapsService.initializeMapWithRoute(mapElement, route)
    }
  } catch (error) {
    console.error('Error initializing map:', error)
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapElement.innerHTML = `
        <div class="d-flex align-items-center justify-content-center h-100 bg-light">
          <div class="text-center">
            <i class="bi bi-exclamation-triangle display-1 text-muted"></i>
            <p class="mt-3">Unable to load map</p>
            <p class="text-muted">Route: ${route.distance}km ${route.routeType} route</p>
          </div>
        </div>
      `
    }
  }
}

const startRoute = (route) => {
  closeMapModal()
  
  if (WorkoutStateService.checkActiveWorkout()) {
    pendingRouteData.value = {
      workoutData: {
        title: `${route.distance}km Running Route`,
        exercises: [{
          name: 'Running',
          description: route.description,
          duration: route.estimatedTime,
          distance: route.distance * 1000,
          distanceKm: route.distance,
          routeType: route.routeType
        }],
        totalTimeMin: Math.floor(route.distance * 7),
        sourceType: 'running-route'
      },
      routeData: {
        distance: route.distance,
        routeType: route.routeType,
        description: route.description,
        estimatedTime: route.estimatedTime,
        startLocation: route.startLocation,
        coordinates: route.coordinates,
        highlights: route.highlights
      }
    }
    
    showActiveWorkoutModal.value = true
    return
  }
  
  proceedWithRoute(route)
}

const proceedWithRoute = (route) => {
  const workoutData = {
    title: `${route.distance}km Running Route`,
    exercises: [{
      name: 'Running',
      description: route.description,
      duration: route.estimatedTime,
      distance: route.distance * 1000,
      distanceKm: route.distance,
      routeType: route.routeType
    }],
    totalTimeMin: Math.floor(route.distance * 7),
    sourceType: 'running-route'
  }
  
  const routeData = {
    distance: route.distance,
    routeType: route.routeType,
    description: route.description,
    estimatedTime: route.estimatedTime,
    startLocation: route.startLocation,
    coordinates: route.coordinates,
    highlights: route.highlights
  }
  
  router.push({
    path: '/workout-tracking',
    query: {
      workoutData: JSON.stringify(workoutData),
      routeData: JSON.stringify(routeData),
      sourceType: 'running-route'
    }
  })
}

const handleCancelActiveWorkout = () => {
  showActiveWorkoutModal.value = false
  pendingRouteData.value = null
}

const handleEndActiveWorkout = async () => {
  showActiveWorkoutModal.value = false
  
  WorkoutStateService.clearActiveWorkout()
  
  if (pendingRouteData.value) {
    router.push({
      path: '/workout-tracking',
      query: {
        workoutData: JSON.stringify(pendingRouteData.value.workoutData),
        routeData: JSON.stringify(pendingRouteData.value.routeData),
        sourceType: 'running-route'
      }
    })
    
    pendingRouteData.value = null
  }
}

watch(searchForm, () => {
  saveDraftState()
}, { deep: true })

watch(routes, () => {
  saveDraftState()
}, { deep: true })

watch(searchPerformed, () => {
  saveDraftState()
})

watch(routes, async (newRoutes) => {
  if (newRoutes && newRoutes.length > 0) {
    mapLoadedStates.value = {}
    
    await nextTick()
    setTimeout(() => {
      initializeMapPreviews()
    }, 500)
  } else {
    mapLoadedStates.value = {}
  }
}, { deep: true })

const initializeMapPreviews = async () => {
  try {
    await mapsService.loadGoogleMaps()
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    routes.value.forEach((route, index) => {
      const mapElement = document.getElementById(`map-preview-${index}`)
      if (!mapElement) {
        console.warn(`Map element not found for route ${index}`)
        return
      }
      
      if (!window.google || !window.google.maps) {
        console.warn('Google Maps not loaded')
        return
      }
      
      try {
        const placeholder = mapElement.parentElement.querySelector('.map-placeholder')
        if (placeholder) {
          placeholder.style.display = 'none'
        }
        
          const map = new window.google.maps.Map(mapElement, {
            zoom: 13,
            center: route.coordinates.start,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
          zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          })

          const directionsRenderer = new window.google.maps.DirectionsRenderer({
            map: map,
          suppressMarkers: true,
            polylineOptions: {
            strokeColor: '#4285F4',
              strokeWeight: 4,
              strokeOpacity: 0.8
            }
          })

          const request = {
            origin: route.coordinates.start,
            destination: route.routeType === 'loop' 
              ? route.coordinates.start 
              : (route.coordinates.waypoints && route.coordinates.waypoints.length > 0 
                ? route.coordinates.waypoints[route.coordinates.waypoints.length - 1]
                  : route.coordinates.start),
          waypoints: route.routeType === 'loop' 
            ? (route.coordinates.waypoints && route.coordinates.waypoints.length > 0
                ? route.coordinates.waypoints.map(wp => ({ location: wp, stopover: true }))
                : [])
            : (route.coordinates.waypoints && route.coordinates.waypoints.length > 0
                ? route.coordinates.waypoints.slice(0, -1).map(wp => ({ location: wp, stopover: true }))
                : []),
            travelMode: window.google.maps.TravelMode.WALKING,
          optimizeWaypoints: route.routeType === 'loop'
          }

          const directionsService = new window.google.maps.DirectionsService()
          directionsService.route(request, (result, status) => {
            if (status === 'OK') {
              directionsRenderer.setDirections(result)
              
            const routeResult = result.routes[0]
            const isLoop = route.routeType === 'loop'
            
            const startLocation = routeResult.legs[0].start_location
            const endLocation = routeResult.legs[routeResult.legs.length - 1].end_location
            
            if (isLoop) {
              new window.google.maps.Marker({
                position: startLocation,
                map: map,
                label: {
                  text: 'S/E',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                },
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: '#007bff',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3
                }
              })
            } else {
              new window.google.maps.Marker({
                position: startLocation,
                map: map,
                label: {
                  text: 'S',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 'bold'
                },
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: '#28a745',
                  fillOpacity: 1,
                  strokeColor: '#ffffff',
                  strokeWeight: 3
                }
              })
              
              const startLat = startLocation.lat()
              const startLng = startLocation.lng()
              const endLat = endLocation.lat()
              const endLng = endLocation.lng()
              
              const distance = Math.sqrt(
                Math.pow((endLat - startLat) * 111000, 2) + 
                Math.pow((endLng - startLng) * 111000 * Math.cos(startLat * Math.PI / 180), 2)
              )
              
              if (distance > 10) {
                new window.google.maps.Marker({
                  position: endLocation,
                  map: map,
                  label: {
                    text: 'E',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  },
                  icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: '#dc3545',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3
                  }
                })
              }
            }
            
            const bounds = new window.google.maps.LatLngBounds()
            
            routeResult.legs.forEach(leg => {
              bounds.extend(leg.start_location)
              bounds.extend(leg.end_location)
              leg.steps.forEach(step => {
                bounds.extend(step.start_location)
                bounds.extend(step.end_location)
              })
            })
            
            map.fitBounds(bounds, {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            })
            
            markMapAsLoaded(index)
            
            } else {
              console.warn(`Failed to get directions for route ${index}:`, status)
            }
          })
        } catch (error) {
          console.warn(`Failed to initialize map preview ${index}:`, error)
      }
    })
  } catch (error) {
    console.error('Error initializing map previews:', error)
  }
}

onMounted(() => {
  loadDraftState()
  if (routes.value.length > 0) {
    mapLoadedStates.value = {}
    setTimeout(() => {
      initializeMapPreviews()
    }, 500)
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

.route-card-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--transition-delay, 0.1s);
}

.route-card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
