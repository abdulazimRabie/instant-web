<script setup>
import { BillStatus } from '@/composables/useInstantData'

defineProps({
  status: {
    type: String,
    required: true,
    validator: (v) => ['active', 'completed', 'expired'].includes(v),
  },
  dot: {
    type: Boolean,
    default: true,
  },
})

const styles = {
  active: { bg: 'bg-success-bg', fg: 'text-success-fg', label: 'Active' },
  completed: { bg: 'bg-success-bg', fg: 'text-success-fg', label: 'Completed' },
  expired: { bg: 'bg-expired-bg', fg: 'text-expired-fg', label: 'Expired' },
}

function dotClass(status) {
  if (status === 'active') return 'bg-success anim-pulse-soft'
  if (status === 'completed') return 'bg-success'
  return 'bg-text-muted'
}
</script>

<template>
  <span :class="`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[status].bg} ${styles[status].fg}`">
    <span v-if="dot" :class="`h-1.5 w-1.5 rounded-full ${dotClass(status)}`" />
    {{ styles[status].label }}
  </span>
</template>
