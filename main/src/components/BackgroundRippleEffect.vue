<template>
  <div 
    class="background-ripple-effect" 
    :style="containerStyles"
    @click.stop
  >
    <div 
      class="ripple-grid"
      :style="{ ...gridStyles, ...gridContainerStyles }"
    >
      <div
        v-for="idx in cells"
        :key="`cell-${idx}`"
        class="ripple-cell"
        :class="{ 'ripple-active': clickedCell !== null }"
        :style="getCellStyle(idx)"
        @click.stop="handleCellClick(idx)"
        @mousedown.stop="handleCellClick(idx)"
        @touchstart.stop="handleCellClick(idx)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  rows: {
    type: Number,
    default: 8
  },
  cols: {
    type: Number,
    default: 27
  },
  cellSize: {
    type: Number,
    default: 56
  },
  borderColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.1)'
  },
  fillColor: {
    type: String,
    default: 'transparent'
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

const clickedCell = ref(null)
const rippleKey = ref(0)

const cells = computed(() => 
  Array.from({ length: props.rows * props.cols }, (_, idx) => idx)
)

const containerStyles = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
  pointerEvents: props.interactive ? 'auto' : 'none',
  zIndex: 0,
  overflow: 'hidden'
}))

const gridContainerStyles = computed(() => ({
  pointerEvents: props.interactive ? 'auto' : 'none'
}))

const gridStyles = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.cols}, ${props.cellSize}px)`,
  gridTemplateRows: `repeat(${props.rows}, ${props.cellSize}px)`,
  width: `${props.cols * props.cellSize}px`,
  height: `${props.rows * props.cellSize}px`,
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  minHeight: '100vh'
}))

const getCellStyle = (idx) => {
  const rowIdx = Math.floor(idx / props.cols)
  const colIdx = idx % props.cols
  
  // Calculate distance from clicked cell
  const distance = clickedCell.value
    ? Math.hypot(clickedCell.value.row - rowIdx, clickedCell.value.col - colIdx)
    : 0
  
  // Calculate delay and duration based on distance
  const delay = clickedCell.value ? Math.max(0, distance * 55) : 0 // ms
  const duration = 200 + distance * 80 // ms

  const style = {
    backgroundColor: props.fillColor,
    borderColor: props.borderColor,
    borderWidth: '0.5px',
    borderStyle: 'solid',
    cursor: props.interactive ? 'pointer' : 'default',
    pointerEvents: props.interactive ? 'auto' : 'none',
    opacity: '0.4',
    transition: 'opacity 0.15s',
    minWidth: '0',
    minHeight: '0',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1
  }

  // Add CSS custom properties for animation
  if (clickedCell.value) {
    style['--delay'] = `${delay}ms`
    style['--duration'] = `${duration}ms`
  }

  return style
}

const handleCellClick = (idx) => {
  if (!props.interactive) return
  
  const rowIdx = Math.floor(idx / props.cols)
  const colIdx = idx % props.cols
  
  // Reset and trigger new ripple
  clickedCell.value = null
  rippleKey.value++
  
  // Small delay to ensure the reset is processed
  setTimeout(() => {
    clickedCell.value = { row: rowIdx, col: colIdx }
    
    // Reset after animation completes (longest possible animation)
    const maxDistance = Math.hypot(props.rows, props.cols)
    const maxDuration = 200 + maxDistance * 80
    const maxDelay = maxDistance * 55
    
    setTimeout(() => {
      clickedCell.value = null
    }, maxDuration + maxDelay)
  }, 10)
}
</script>

<style scoped>
.background-ripple-effect {
  user-select: none;
}

.ripple-grid {
  position: relative;
  width: 100%;
  height: 100%;
}

.ripple-cell {
  position: relative;
  will-change: opacity;
  display: block;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.ripple-cell:hover {
  opacity: 0.8 !important;
}

.ripple-cell.ripple-active {
  animation: cell-ripple var(--duration, 200ms) ease-out var(--delay, 0ms);
  animation-fill-mode: none;
}

@keyframes cell-ripple {
  0% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.4;
  }
}
</style>