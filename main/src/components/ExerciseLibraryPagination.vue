<template>
  <div class="exercise-pagination">
    <div class="pagination-content">
      <!-- Previous Button -->
      <button
        class="pagination-button pagination-nav"
        :class="{ disabled: currentPage === 1 }"
        @click="handlePrevious"
        :disabled="currentPage === 1"
      >
        <i class="bi bi-chevron-left"></i>
        Previous
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, index) in pageNumbers" :key="index">
        <button
          v-if="typeof page === 'number'"
          class="pagination-button pagination-page"
          :class="{ active: currentPage === page }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
        <span v-else class="pagination-ellipsis">...</span>
      </template>

      <!-- Next Button -->
      <button
        class="pagination-button pagination-nav"
        :class="{ disabled: currentPage === totalPages }"
        @click="handleNext"
        :disabled="currentPage === totalPages"
      >
        Next
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['pageChange'])

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5

  if (props.totalPages <= maxVisible) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (props.currentPage > 3) {
      pages.push('ellipsis1')
    }

    // Show pages around current page
    const start = Math.max(2, props.currentPage - 1)
    const end = Math.min(props.totalPages - 1, props.currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (props.currentPage < props.totalPages - 2) {
      pages.push('ellipsis2')
    }

    // Always show last page
    pages.push(props.totalPages)
  }

  return pages
})

const handlePageChange = (page) => {
  emit('pageChange', page)
}

const handlePrevious = () => {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

const handleNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('pageChange', props.currentPage + 1)
  }
}
</script>

<style>
/* Global styles - not scoped so dark mode works */
.exercise-pagination {
  margin-top: 3rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.pagination-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  color: #030213;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.2s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  cursor: pointer;
  outline: none;
}

.pagination-button:hover:not(.disabled) {
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Navigation Buttons (Previous/Next) */
.pagination-nav {
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 9999px;
  gap: 0.375rem;
}

.pagination-nav i {
  font-size: 0.875rem;
}

/* Page Number Buttons */
.pagination-page {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
}

.pagination-page.active {
  background: #030213;
  color: #ffffff;
  border-color: #030213;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-page.active:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Ellipsis */
.pagination-ellipsis {
  color: rgba(3, 2, 19, 0.4);
  padding: 0 0.5rem;
  font-size: 0.9375rem;
  transition: color 0.3s ease;
}
</style>

