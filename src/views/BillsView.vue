<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Receipt, Search, Plus } from 'lucide-vue-next'
import { formatCurrency, timeAgo } from '@/composables/useInstantData'
import { useBillsStore } from '@/stores/bills.js'
import StatusBadge from '@/components/merchant/StatusBadge.vue'
import ProgressBar from '@/components/merchant/ProgressBar.vue'

const store = useBillsStore()
const q = ref('')
const filter = ref('all')

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'expired', label: 'Expired' },
]

const counts = computed(() => ({
  all: store.bills.length,
  active: store.bills.filter((b) => b.status === 'active').length,
  completed: store.bills.filter((b) => b.status === 'completed').length,
  expired: store.bills.filter((b) => b.status === 'expired').length,
}))

const filtered = computed(() => {
  return store.bills
    .filter((b) => (filter.value === 'all' ? true : b.status === filter.value))
    .filter((b) =>
      q.value.trim()
        ? (b.title + ' ' + b.id).toLowerCase().includes(q.value.trim().toLowerCase())
        : true
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})
</script>

<template>
  <div class="anim-fade-up">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Bills history
        </h1>
        <p class="mt-1.5 text-sm text-text-secondary">
          All shared bills you've created. Tap one to see live progress.
        </p>
      </div>
      <RouterLink
        to="/app/create"
        class="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft"
      >
        <Plus class="h-4 w-4" /> New bill
      </RouterLink>
    </div>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          v-model="q"
          placeholder="Search by title or bill ID…"
          class="h-12 w-full rounded-2xl border border-border bg-input-bg pl-11 pr-4 text-sm outline-none transition focus:border-foreground focus:bg-surface"
        />
      </div>
      <div class="flex flex-wrap gap-1.5 overflow-x-auto">
        <button
          v-for="f in FILTERS"
          :key="f.id"
          type="button"
          @click="filter = f.id"
          :class="[
            'inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition',
            filter === f.id
              ? 'bg-primary text-primary-foreground'
              : 'border border-border bg-surface text-text-secondary hover:text-foreground',
          ]"
        >
          {{ f.label }}
          <span :class="[
            'rounded-full px-1.5 text-[10px] tabular-nums',
            filter === f.id ? 'bg-white/15' : 'bg-input-bg text-text-muted'
          ]">
            {{ counts[f.id] }}
          </span>
        </button>
      </div>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <RouterLink
        v-for="b in filtered"
        :key="b.id"
        :to="`/app/bill/${b.id}`"
        class="group rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h3 class="font-display truncate text-base font-bold">{{ b.title }}</h3>
            <p class="mt-0.5 text-[11px] font-mono tracking-wider text-text-muted">{{ b.id }}</p>
          </div>
          <StatusBadge :status="b.status" />
        </div>

        <div class="mt-5 flex items-end justify-between">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Collected
            </p>
            <p class="font-display mt-1 text-2xl font-extrabold tabular-nums">
              {{ formatCurrency(b.collected) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-[11px] text-text-muted">of</p>
            <p class="text-sm font-semibold text-text-secondary tabular-nums">
              {{ formatCurrency(b.total) }}
            </p>
          </div>
        </div>

        <div class="mt-3">
          <ProgressBar :value="(b.collected / b.total) * 100" />
          <div class="mt-2 flex justify-between text-[11px] text-text-secondary">
            <span>{{ b.contributors.length }} contributors · {{ timeAgo(b.createdAt) }}</span>
            <span class="font-semibold text-foreground">{{ Math.round((b.collected / b.total) * 100) }}%</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-if="filtered.length === 0" class="mt-10 rounded-3xl border border-dashed border-border bg-surface p-12 text-center shadow-card">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-input-bg text-text-muted">
        <Receipt class="h-6 w-6" />
      </span>
      <h3 class="font-display mt-4 text-lg font-bold">No bills found</h3>
      <p class="mx-auto mt-1.5 max-w-sm text-sm text-text-secondary">
        Try a different filter, or create a fresh bill to get started.
      </p>
      <RouterLink
        to="/app/create"
        class="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-primary-foreground"
      >
        <Plus class="h-4 w-4" /> Create a bill
      </RouterLink>
    </div>
  </div>
</template>
