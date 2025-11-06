// google maps api service for running routes

class MapsService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    this.isLoaded = false
    this.geocoder = null
    this.directionsService = null
    this.directionsRenderer = null
    
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.')
    }
  }

  async loadGoogleMaps() {
    if (this.isLoaded) return Promise.resolve()
    
    if (!this.apiKey) {
      throw new Error('Google Maps API key is required. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.')
    }

    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        this.isLoaded = true
        this.initializeServices()
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places,geometry`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        this.isLoaded = true
        this.initializeServices()
        resolve()
      }
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API. Please check your API key and internet connection.'))
      }
      
      document.head.appendChild(script)
    })
  }

  initializeServices() {
    if (window.google && window.google.maps) {
      this.geocoder = new window.google.maps.Geocoder()
      this.directionsService = new window.google.maps.DirectionsService()
      this.directionsRenderer = new window.google.maps.DirectionsRenderer()
    }
  }

  async geocodePostalCode(postalCode) {
    if (!this.geocoder) {
      throw new Error('Geocoder not initialized')
    }

    return new Promise((resolve, reject) => {
      this.geocoder.geocode(
        { address: postalCode },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location
            resolve({
              lat: location.lat(),
              lng: location.lng(),
              formattedAddress: results[0].formatted_address
            })
          } else {
            reject(new Error(`Geocoding failed: ${status}`))
          }
        }
      )
    })
  }

  async findNearbyParks(center, radius = 2000) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

      const request = {
        location: new window.google.maps.LatLng(center.lat, center.lng),
        radius: radius,
        type: 'park'
      }

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results.map(place => ({
            name: place.name,
            location: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            },
            rating: place.rating,
            vicinity: place.vicinity
          })))
        } else {
          reject(new Error(`Places search failed: ${status}`))
        }
      })
    })
  }

  async generateRunningRoute(postalCode, distance, routeType) {
    try {
      const startLocation = await this.geocodePostalCode(postalCode)
      
      let parks = []
      if (routeType === 'park' || routeType === 'mixed') {
        parks = await this.findNearbyParks(startLocation, distance * 1000)
      }

      const routes = await this.createRouteVariations(startLocation, distance, routeType, parks)
      
      return routes
    } catch (error) {
      console.error('Error generating running route:', error)
      throw error
    }
  }

  async createRouteVariations(startLocation, distance, routeType, parks) {
    const routes = []
    const variations = this.getRouteVariations(distance, routeType, parks, startLocation)

    const minDistance = distance * 0.7  // -30%
    const maxDistance = distance * 1.3   // +30%

    for (let i = 0; i < variations.length; i++) {
      const variation = variations[i]
      try {
        const route = await this.calculateRoute(startLocation, variation)
        if (route) {
          if (route.distance >= minDistance && route.distance <= maxDistance) {
            const actualRouteType = variation.type
            
            routes.push({
              id: `route_${i + 1}`,
              distance: route.distance,
              duration: route.duration,
              startLocation: startLocation.formattedAddress,
              description: this.generateRouteDescription(actualRouteType, distance, variation, i),
              highlights: this.generateRouteHighlights(actualRouteType),
              coordinates: route.coordinates,
              routeType: actualRouteType,
              estimatedTime: this.formatDuration(route.duration)
            })
          }
        }
      } catch (error) {
        console.warn(`Failed to generate route variation ${i + 1}:`, error)
      }
    }

    return routes
  }

  getRouteVariations(distance, routeType, parks, startLocation) {
    const variations = []
    const baseRadius = (distance * 1000) / 2

    switch (routeType) {
      case 'loop':
        for (let i = 0; i < 3; i++) {
          variations.push({
            type: 'loop',
            waypoints: this.generateLoopWaypoints(baseRadius, i, startLocation),
            radius: baseRadius,
            avoidHighways: true,
            avoidTolls: true,
            isLoop: true
          })
        }
        break

      case 'point-to-point':
        for (let i = 0; i < 3; i++) {
          variations.push({
            type: 'point-to-point',
            waypoints: this.generatePointToPointWaypoints(baseRadius, i, startLocation),
            radius: baseRadius,
            avoidHighways: false,
            avoidTolls: true,
            isLoop: false
          })
        }
        break

      case 'all':
        for (let i = 0; i < 2; i++) {
          variations.push({
            type: 'loop',
            waypoints: this.generateLoopWaypoints(baseRadius, i, startLocation),
            radius: baseRadius,
            avoidHighways: true,
            avoidTolls: true,
            isLoop: true
          })
        }
        
        for (let i = 0; i < 2; i++) {
          variations.push({
            type: 'point-to-point',
            waypoints: this.generatePointToPointWaypoints(baseRadius, i, startLocation),
            radius: baseRadius,
            avoidHighways: false,
            avoidTolls: true,
            isLoop: false
          })
        }
        break
    }

    return variations
  }

  generateLoopWaypoints(radius, variation, startLocation) {
    const angle = (variation * 120) * (Math.PI / 180)
    const distance = radius * 0.8
    
    const latOffset = Math.cos(angle) * (distance / 111000)
    const lngOffset = Math.sin(angle) * (distance / 111000)
    
    return [{
      lat: startLocation.lat + latOffset,
      lng: startLocation.lng + lngOffset
    }]
  }

  generatePointToPointWaypoints(radius, variation, startLocation) {
    const angle = (variation * 120) * (Math.PI / 180)
    const distance = radius * 1.2
    
    const latOffset = Math.cos(angle) * (distance / 111000)
    const lngOffset = Math.sin(angle) * (distance / 111000)
    
    return [{
      lat: startLocation.lat + latOffset,
      lng: startLocation.lng + lngOffset
    }]
  }

  async calculateRoute(startLocation, variation) {
    if (!this.directionsService) {
      throw new Error('Directions service not initialized')
    }

    return new Promise((resolve, reject) => {
      let destination
      if (variation.isLoop) {
        destination = new window.google.maps.LatLng(startLocation.lat, startLocation.lng)
      } else {
        destination = new window.google.maps.LatLng(variation.waypoints[0].lat, variation.waypoints[0].lng)
      }

      const request = {
        origin: new window.google.maps.LatLng(startLocation.lat, startLocation.lng),
        destination: destination,
        waypoints: variation.waypoints.map(wp => ({
          location: new window.google.maps.LatLng(wp.lat, wp.lng),
          stopover: true
        })),
        travelMode: window.google.maps.TravelMode.WALKING,
        avoidHighways: variation.avoidHighways,
        avoidTolls: variation.avoidTolls,
        optimizeWaypoints: true
      }

      this.directionsService.route(request, (result, status) => {
        if (status === 'OK' && result.routes[0]) {
          const route = result.routes[0]
          
          resolve({
            distance: Math.round(route.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000 * 10) / 10,
            duration: route.legs.reduce((total, leg) => total + leg.duration.value, 0),
            coordinates: {
              start: { lat: startLocation.lat, lng: startLocation.lng },
              waypoints: variation.waypoints,
              end: { lat: startLocation.lat, lng: startLocation.lng }
            }
          })
        } else {
          reject(new Error(`Route calculation failed: ${status}`))
        }
      })
    })
  }

  generateRouteDescription(routeType, distance, variation, index) {
    const descriptions = {
      loop: [
        `A ${distance}km circular route that starts and ends at the same location.`,
        `Perfect for runners who prefer to return to their starting point on this ${distance}km loop.`,
        `This ${distance}km loop route offers a complete circuit with varied scenery.`
      ],
      'point-to-point': [
        `A ${distance}km linear route from point A to point B with different start and end locations.`,
        `Ideal for one-way runs, this ${distance}km point-to-point route offers a journey experience.`,
        `This ${distance}km route takes you from one location to another with scenic views along the way.`
      ],
      all: [
        `A ${distance}km route offering flexibility with both loop and point-to-point options.`,
        `This ${distance}km route provides variety with different running patterns and destinations.`,
        `Experience diverse running styles on this ${distance}km route with multiple route types.`
      ]
    }
    
    return descriptions[routeType][index % descriptions[routeType].length]
  }

  generateRouteHighlights(routeType) {
    const highlights = {
      loop: ['Circular Route', 'Return to Start', 'Complete Circuit', 'Familiar Endpoint', 'Easy Navigation'],
      'point-to-point': ['Linear Journey', 'Different Endpoint', 'One-Way Route', 'Adventure Feel', 'New Destination'],
      all: ['Route Variety', 'Flexible Options', 'Multiple Patterns', 'Diverse Experience', 'Choice of Style']
    }
    
    const routeHighlights = highlights[routeType]
    return routeHighlights.slice(0, Math.floor(Math.random() * 3) + 2)
  }

  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    } else {
      return `${minutes} minutes`
    }
  }

  initializeMapWithRoute(mapElement, route) {
    if (!window.google || !window.google.maps) {
      throw new Error('Google Maps not loaded')
    }

    const map = new window.google.maps.Map(mapElement, {
      zoom: 14,
      center: route.coordinates.start,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP
    })

    const isLoop = route.routeType === 'loop'
    const destination = isLoop 
      ? route.coordinates.start 
      : (route.coordinates.waypoints && route.coordinates.waypoints.length > 0 
          ? route.coordinates.waypoints[0] 
          : route.coordinates.start)

    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true
    })

    const request = {
      origin: route.coordinates.start,
      destination: destination,
      waypoints: route.coordinates.waypoints && route.coordinates.waypoints.length > 0
        ? route.coordinates.waypoints.map(wp => ({
            location: wp,
            stopover: true
          }))
        : [],
      travelMode: window.google.maps.TravelMode.WALKING,
      optimizeWaypoints: true
    }

    const directionsService = new window.google.maps.DirectionsService()
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        this.addCustomRouteMarkers(map, route, result)
      }
    })

    return map
  }

  addCustomRouteMarkers(map, route, directionsResult) {
    if (!window.google || !window.google.maps) return

    const isLoop = route.routeType === 'loop'
    
    const routePath = directionsResult.routes[0]
    if (!routePath || !routePath.legs || routePath.legs.length === 0) return

    const startLocation = routePath.legs[0].start_location
    const endLocation = routePath.legs[routePath.legs.length - 1].end_location

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
  }
}

// Export singleton instance
export const mapsService = new MapsService()
export default mapsService
