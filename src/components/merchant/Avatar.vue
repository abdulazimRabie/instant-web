<script setup>
const props = defineProps({
  initial: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'success',
    validator: (v) => ['success', 'muted'].includes(v),
  },
})

const classes =
  props.tone === 'success'
    ? 'bg-success-bg text-success-fg'
    : 'bg-input-bg text-text-secondary'
</script>

<template>
  <div :class="`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold ${classes}`">
    {{ initial }}
  </div>
</template>
