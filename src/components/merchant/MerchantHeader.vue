<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Bell, Plus, Receipt } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { to: '/app/create', label: 'Create Bill' },
  { to: '/app/bills', label: 'Bills' },
]

function isActive(item) {
  if (route.path.startsWith(item.to)) return true
  if (item.to === '/app/bills' && route.path.includes('/app/bill/')) return true
  return false
}

function mobileActive(to, matchPrefix) {
  if (matchPrefix) {
    return matchPrefix.some((p) => route.path.startsWith(p))
  }
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
      <RouterLink to="/app/create" class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
          ⌁
        </span>
        <div class="flex flex-col leading-none">
          <span class="font-display text-base font-bold tracking-tight text-foreground">
            Instant
          </span>
          <span class="text-[11px] font-medium text-text-secondary">Merchant Console</span>
        </div>
      </RouterLink>

      <nav class="hidden items-center gap-1 rounded-full border border-border bg-input-bg p-1 sm:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
            isActive(item)
              ? 'bg-primary text-primary-foreground'
              : 'text-text-secondary hover:text-foreground',
          ]"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:bg-input-bg"
          aria-label="Notifications"
        >
          <Bell class="h-4 w-4" />
        </button>
        <RouterLink
          to="/app/create"
          class="hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft sm:inline-flex"
        >
          <Plus class="h-4 w-4" />
          New bill
        </RouterLink>
        <div class="grid h-10 w-10 place-items-center rounded-full bg-success-bg text-xs font-bold text-success-fg">
          OA
        </div>
      </div>
    </div>

    <!-- Mobile tab bar -->
    <nav class="flex items-center gap-1 border-t border-border px-3 py-2 sm:hidden">
      <RouterLink
        to="/app/create"
        :class="[
          'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition',
          mobileActive('/app/create') ? 'bg-primary text-primary-foreground' : 'text-text-secondary',
        ]"
      >
        <Plus class="h-4 w-4" />
        Create
      </RouterLink>
      <RouterLink
        to="/app/bills"
        :class="[
          'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition',
          mobileActive('/app/bills', ['/app/bills', '/app/bill/']) ? 'bg-primary text-primary-foreground' : 'text-text-secondary',
        ]"
      >
        <Receipt class="h-4 w-4" />
        Bills
      </RouterLink>
    </nav>
  </header>
</template>
