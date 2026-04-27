<script setup>
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
})

const pct = Math.min(100, Math.max(0, props.value))
</script>

<template>
  <div :class="`h-1.5 w-full overflow-hidden rounded-full bg-divider ${className}`">
    <div
      class="h-full rounded-full bg-success transition-[width] duration-500"
      :style="{ width: `${pct}%` }"
    />
  </div>
</template>
