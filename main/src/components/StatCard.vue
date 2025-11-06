<template>
  <div class="card" :class="cardClass">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div>
          <h4>{{ value }}</h4>
          <p class="mb-0">{{ label }}</p>
        </div>
        <i :class="iconClass" class="display-4"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    required: true
  },
  cardClass: {
    type: String,
    default: 'bg-primary text-white'
  }
})
</script>

