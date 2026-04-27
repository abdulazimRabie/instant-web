<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { ArrowLeft, Check, Copy, Share2, X } from 'lucide-vue-next'
import {
  formatCurrency,
  getBill,
  initialOf,
  timeAgo,
} from '@/composables/useInstantData'
import StatusBadge from '@/components/merchant/StatusBadge.vue'
import ProgressBar from '@/components/merchant/ProgressBar.vue'
import Avatar from '@/components/merchant/Avatar.vue'

const route = useRoute()
const id = route.params.id
const bill = getBill(id)

const copied = ref(null)

const remaining = computed(() => (bill ? Math.max(0, bill.total - bill.collected) : 0))
const pct = computed(() => (bill ? (bill.collected / bill.total) * 100 : 0))
const sortedContribs = computed(() =>
  bill ? [...bill.contributors].sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()) : []
)
const link = computed(() => (bill ? `https://instant.app/p/${bill.id}` : ''))

function copy(kind, value) {
  navigator.clipboard?.writeText(value).then(() => {
    copied.value = kind
    setTimeout(() => (copied.value = null), 1600)
  })
}
</script>

<template>
  <div v-if="!bill" class="rounded-3xl border border-border bg-surface p-10 text-center shadow-card">
    <h1 class="font-display text-xl font-bold">Bill not found</h1>
    <p class="mt-2 text-sm text-text-secondary">This bill ID doesn't exist.</p>
    <RouterLink
      to="/app/bills"
      class="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
    >
      Back to bills
    </RouterLink>
  </div>

  <div v-else class="anim-fade-up">
    <RouterLink
      to="/app/bills"
      class="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary transition hover:text-foreground"
    >
      <ArrowLeft class="h-3.5 w-3.5" /> All bills
    </RouterLink>

    <div class="mt-4 flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {{ bill.title }}
          </h1>
          <StatusBadge :status="bill.status" />
        </div>
        <button
          type="button"
          @click="copy('id', bill.id)"
          class="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold text-text-secondary transition hover:bg-input-bg"
        >
          <span class="font-mono tracking-wider text-foreground">{{ bill.id }}</span>
          <Check v-if="copied === 'id'" class="h-3 w-3 text-success" />
          <Copy v-else class="h-3 w-3" />
        </button>
        <p v-if="bill.description" class="mt-3 max-w-xl text-sm text-text-secondary">{{ bill.description }}</p>
      </div>
      <button
        v-if="bill.status === 'active'"
        type="button"
        class="inline-flex h-11 items-center gap-2 rounded-full border border-destructive bg-transparent px-5 text-xs font-semibold text-destructive transition hover:bg-destructive/5"
      >
        <X class="h-4 w-4" /> Close bill
      </button>
    </div>

    <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <!-- QR card -->
      <div class="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Scan to pay
          </p>
          <span class="text-[11px] font-semibold text-text-secondary">instant.app</span>
        </div>
        <div class="mt-5 grid place-items-center rounded-2xl bg-input-bg p-6">
          <div class="rounded-2xl bg-surface p-4 shadow-soft">
            <QrcodeVue
              :value="link"
              :size="216"
              level="M"
              background="#ffffff"
              foreground="#1A1A1A"
              :margin="0"
            />
          </div>
        </div>
        <div class="mt-5 grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            @click="copy('link', link)"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface text-xs font-semibold transition hover:bg-input-bg"
          >
            <Check v-if="copied === 'link'" class="h-4 w-4 text-success" />
            <Copy v-else class="h-4 w-4" />
            {{ copied === 'link' ? 'Copied!' : 'Copy link' }}
          </button>
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft"
          >
            <Share2 class="h-4 w-4" /> Share
          </button>
        </div>
        <p class="mt-3 truncate text-center text-[11px] text-text-muted">{{ link }}</p>
      </div>

      <!-- Progress + contributors -->
      <div class="space-y-6">
        <div class="rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Remaining
          </p>
          <div class="mt-2 flex items-end justify-between gap-3">
            <p class="font-display text-5xl font-extrabold tracking-tight tabular-nums">
              {{ formatCurrency(remaining) }}
            </p>
            <p class="pb-1.5 text-xs text-text-secondary">
              of {{ formatCurrency(bill.total) }}
            </p>
          </div>
          <div class="mt-5">
            <ProgressBar :value="pct" className="h-2" />
            <div class="mt-2 flex justify-between text-[11px] text-text-secondary">
              <span>
                <span class="font-semibold text-foreground">{{ formatCurrency(bill.collected) }}</span> collected
              </span>
              <span>{{ Math.round(pct) }}%</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3 border-t border-divider pt-5 text-center">
            <div>
              <p class="font-display text-base font-bold tabular-nums">{{ String(bill.contributors.length) }}</p>
              <p class="mt-0.5 text-[11px] text-text-secondary">Contributors</p>
            </div>
            <div>
              <p class="font-display text-base font-bold tabular-nums">{{ formatCurrency(bill.collected / Math.max(1, bill.contributors.length)) }}</p>
              <p class="mt-0.5 text-[11px] text-text-secondary">Avg. payment</p>
            </div>
            <div>
              <p class="font-display text-base font-bold tabular-nums">{{ timeAgo(bill.createdAt) }}</p>
              <p class="mt-0.5 text-[11px] text-text-secondary">Created</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-border bg-surface shadow-card">
          <div class="flex items-center justify-between border-b border-divider px-6 py-4">
            <h2 class="font-display text-base font-bold">Contributors</h2>
            <span class="text-[11px] font-semibold text-text-secondary">
              Newest first · {{ bill.contributors.length }}
            </span>
          </div>
          <ul class="divide-y divide-divider">
            <li
              v-for="c in sortedContribs"
              :key="c.id"
              class="flex items-center justify-between px-6 py-3.5"
            >
              <div class="flex items-center gap-3">
                <Avatar
                  :initial="initialOf(c.name)"
                  :tone="c.name ? 'success' : 'muted'"
                />
                <div class="leading-tight">
                  <p class="text-sm font-semibold">{{ c.name ?? 'Anonymous' }}</p>
                  <p class="text-[11px] text-text-muted">paid {{ timeAgo(c.paidAt) }}</p>
                </div>
              </div>
              <span class="font-display text-base font-bold tabular-nums">
                {{ formatCurrency(c.amount) }}
              </span>
            </li>
            <li v-if="sortedContribs.length === 0" class="px-6 py-10 text-center text-sm text-text-secondary">
              No payments yet. Share the QR to get started.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
