<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  pending: {
    type: Number,
    default: 0,
  },
  className: {
    type: String,
    default: '',
  },
})

const pct = computed(() => Math.min(100, Math.max(0, props.value)))
const pendingPct = computed(() => Math.min(100 - pct.value, Math.max(0, props.pending)))
</script>

<template>
  <div :class="`relative h-1.5 w-full overflow-hidden rounded-full bg-divider ${className}`">
    <div
      class="absolute inset-y-0 left-0 rounded-full bg-success transition-[width] duration-500"
      :style="{ width: `${pct}%` }"
    />
    <div
      class="absolute inset-y-0 rounded-full bg-pending transition-[left,width] duration-500"
      :style="{ left: `${pct}%`, width: `${pendingPct}%` }"
    />
  </div>
</template>
