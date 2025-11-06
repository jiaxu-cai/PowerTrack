<template>
  <div class="exercise-item mb-3">
    <div class="card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h6>{{ exerciseName }}</h6>
            <p class="text-muted mb-0">{{ exerciseDescription }}</p>
          </div>
          <div class="col-md-6">
            <div class="row text-center">
              <div class="col-4">
                <strong>{{ sets }}</strong><br>
                <small>Sets</small>
              </div>
              <div class="col-4">
                <strong>{{ reps }}</strong><br>
                <small>Reps</small>
              </div>
              <div class="col-4">
                <strong>{{ restTimeSec }}s</strong><br>
                <small>Rest</small>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  exerciseName: {
    type: String,
    required: true
  },
  exerciseDescription: {
    type: String,
    default: ''
  },
  sets: {
    type: [Number, String],
    required: true
  },
  reps: {
    type: [Number, String],
    required: true
  },
  restTimeSec: {
    type: Number,
    required: true
  },
  
})
</script>

