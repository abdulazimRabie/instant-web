<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Bell, Plus, Receipt, LogOut, User, CreditCard } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const showAccountMenu = ref(false)

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

function onLogout() {
  auth.logout()
  showAccountMenu.value = false
  router.push('/')
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
          v-if="!auth.isAuthenticated"
          to="/login"
          class="hidden h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-semibold text-foreground transition hover:bg-input-bg sm:inline-flex"
        >
          <User class="h-3.5 w-3.5" />
          Log in
        </RouterLink>

        <!-- Authenticated account dropdown -->
        <div v-else class="relative">
          <button
            type="button"
            @click="showAccountMenu = !showAccountMenu"
            class="grid h-10 w-10 place-items-center rounded-full text-xs font-bold transition"
            :class="auth.merchant?.stripe_account_id ? 'bg-success-bg text-success-fg' : 'bg-amber-50 text-amber-600 border border-amber-200'"
            :title="auth.merchant?.stripe_account_id ? 'Account connected' : 'Stripe not connected'"
            aria-label="Account menu"
          >
            {{ auth.initials }}
          </button>

          <div
            v-if="showAccountMenu"
            class="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-surface p-5 shadow-pop"
          >
            <p class="font-display text-sm font-bold">{{ auth.merchant?.name || 'Merchant' }}</p>
            <p class="mt-0.5 text-xs text-text-secondary">{{ auth.merchant?.email }}</p>

            <div
              v-if="!auth.merchant?.stripe_account_id"
              class="mt-3 space-y-2"
            >
              <div class="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                <CreditCard class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>Connect a Stripe account to start creating bills.</span>
              </div>
              <button
                type="button"
                :disabled="auth.loading"
                class="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50"
                @click="async () => { showAccountMenu = false; const url = await auth.getOnboardingLink(); window.location.href = url }"
              >
                <CreditCard class="h-3.5 w-3.5" />
                {{ auth.loading ? 'Connecting…' : 'Connect now' }}
              </button>
            </div>
            <div
              v-else
              class="mt-3 flex items-center gap-2 rounded-xl bg-success-bg px-3 py-2 text-[11px] font-medium text-success-fg"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-success" />
              Stripe connected
            </div>

            <button
              type="button"
              @click="onLogout"
              class="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-semibold text-text-secondary transition hover:bg-input-bg"
            >
              <LogOut class="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
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
