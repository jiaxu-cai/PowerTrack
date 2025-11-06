<template>
  <div class="exercise-row group">
    <!-- Header row: index, title+description, delete button -->
    <div class="exercise-header">
      <div class="index-badge">{{ displayIndex }}</div>
      <div class="info">
        <p class="name">{{ exerciseName }}</p>
        <p class="category">{{ exerciseDescription }}</p>
      </div>
      <button type="button" class="remove-btn" @click="$emit('remove')" aria-label="Remove exercise">×</button>
    </div>
    
    <!-- Fields row: sets, reps, rest -->
    <div class="exercise-fields">
      <div class="field-group">
        <label class="field-label">Sets</label>
        <input
          type="number"
          class="ctrl-input"
          :value="sets"
          @input="$emit('update:sets', parseInt($event.target.value))"
          min="1"
          max="20"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Reps</label>
        <input
          type="text"
          class="ctrl-input"
          :value="reps"
          @input="$emit('update:reps', $event.target.value)"
          placeholder="8-12"
        >
      </div>
      <div class="field-group">
        <label class="field-label">Rest</label>
        <input
          type="number"
          class="ctrl-input"
          :value="restSeconds"
          @input="$emit('update:restSeconds', parseInt($event.target.value))"
          min="0"
          max="300"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  exerciseName: {
    type: String,
    required: true
  },
  exerciseDescription: {
    type: String,
    default: ''
  },
  sets: {
    type: Number,
    required: true
  },
  reps: {
    type: [Number, String],
    required: true
  },
  restSeconds: {
    type: Number,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

defineEmits(['update:sets', 'update:reps', 'update:restSeconds', 'remove'])

const displayIndex = computed(() => (props.index ?? 0) + 1)
</script>
<style scoped>
.exercise-row {
  padding: 16px;
  border-radius: 16px;
  background: var(--muted);
  border: 1px solid var(--border);
  transition: background-color 0.2s ease;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercise-row:hover {
  background: var(--accent);
}

.exercise-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exercise-fields {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.index-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(3,2,19,0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #111;
  flex-shrink: 0;
}

.info { 
  flex: 1; 
  min-width: 0;
}

.name { 
  margin: 0; 
  font-size: 15px;
  font-weight: 500;
}

.category { 
  margin: 0; 
  font-size: 13px; 
  opacity: 0.6; 
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.field-label {
  font-size: 11px;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  font-weight: 600;
}

.ctrl-input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: var(--input-background);
  padding: 0 12px;
  font-size: 14px;
}

.ctrl-input:focus { 
  outline: none; 
  box-shadow: 0 0 0 2px var(--ring); 
}

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--destructive);
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}

.group:hover .remove-btn { opacity: 1; }
.remove-btn:hover { background: rgba(212, 24, 61, 0.08); }

/* Mobile responsive styles */
@media (max-width: 991px) {
  .exercise-row {
    gap: 10px;
  }

  .exercise-header {
    gap: 10px;
  }

  .exercise-fields {
    gap: 8px;
  }

  .index-badge {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .remove-btn {
    opacity: 1;
    width: 28px;
    height: 28px;
    font-size: 18px;
  }

  .field-label {
    font-size: 10px;
  }

  .ctrl-input {
    height: 38px;
  }

  .name {
    font-size: 14px;
  }

  .category {
    font-size: 12px;
  }
}

@media (max-width: 575px) {
  .exercise-row {
    padding: 12px;
    gap: 8px;
  }

  .exercise-header {
    gap: 8px;
  }

  .exercise-fields {
    gap: 6px;
  }

  .name {
    font-size: 13px;
  }

  .category {
    font-size: 11px;
  }

  .ctrl-input {
    font-size: 13px;
    height: 36px;
  }
}
</style>
