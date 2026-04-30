<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Bell, Plus, Receipt, Loader2, LogOut, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'

const route = useRoute()
const auth = useAuthStore()
const showAuthPanel = ref(false)

const loginForm = ref({ email: '', password: '' })
const signupForm = ref({ name: '', email: '', password: '', stripe_account_id: '' })
const authTab = ref('login')
const localLoading = ref(false)
const localError = ref(null)

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

async function onLogin() {
  localLoading.value = true
  localError.value = null
  try {
    await auth.loginMerchant({ ...loginForm.value })
    showAuthPanel.value = false
    loginForm.value = { email: '', password: '' }
  } catch (err) {
    localError.value = err.message
  } finally {
    localLoading.value = false
  }
}

async function onSignup() {
  localLoading.value = true
  localError.value = null
  try {
    await auth.signupMerchant({ ...signupForm.value })
    showAuthPanel.value = false
    signupForm.value = { name: '', email: '', password: '', stripe_account_id: '' }
  } catch (err) {
    localError.value = err.message
  } finally {
    localLoading.value = false
  }
}

function onLogout() {
  auth.logout()
  showAuthPanel.value = false
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

        <!-- Auth avatar / dropdown trigger -->
        <div class="relative">
          <button
            type="button"
            @click="showAuthPanel = !showAuthPanel"
            class="grid h-10 w-10 place-items-center rounded-full text-xs font-bold transition"
            :class="auth.isAuthenticated ? 'bg-success-bg text-success-fg' : 'bg-input-bg text-text-muted border border-border'"
            :aria-label="auth.isAuthenticated ? 'Account menu' : 'Log in'"
          >
            <template v-if="auth.isAuthenticated">{{ auth.initials }}</template>
            <User v-else class="h-4 w-4" />
          </button>

          <!-- Auth panel -->
          <div
            v-if="showAuthPanel"
            class="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border bg-surface p-5 shadow-pop"
          >
            <div v-if="auth.isAuthenticated">
              <p class="font-display text-sm font-bold">{{ auth.merchant?.name || 'Merchant' }}</p>
              <p class="mt-0.5 text-xs text-text-secondary">{{ auth.merchant?.email }}</p>
              <button
                type="button"
                @click="onLogout"
                class="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-border text-xs font-semibold text-text-secondary transition hover:bg-input-bg"
              >
                <LogOut class="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>

            <div v-else>
              <div class="flex rounded-xl border border-border bg-input-bg p-0.5">
                <button
                  type="button"
                  @click="authTab = 'login'"
                  :class="['flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition', authTab === 'login' ? 'bg-surface text-foreground shadow-sm' : 'text-text-secondary']"
                >
                  Log in
                </button>
                <button
                  type="button"
                  @click="authTab = 'signup'"
                  :class="['flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition', authTab === 'signup' ? 'bg-surface text-foreground shadow-sm' : 'text-text-secondary']"
                >
                  Sign up
                </button>
              </div>

              <form v-if="authTab === 'login'" @submit.prevent="onLogin" class="mt-3 space-y-2.5">
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="Email"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  placeholder="Password"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <button
                  type="submit"
                  :disabled="localLoading"
                  class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50"
                >
                  <Loader2 v-if="localLoading" class="h-3.5 w-3.5 animate-spin" />
                  <span v-else>Log in</span>
                </button>
              </form>

              <form v-else @submit.prevent="onSignup" class="mt-3 space-y-2.5">
                <input
                  v-model="signupForm.name"
                  type="text"
                  placeholder="Business name"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <input
                  v-model="signupForm.email"
                  type="email"
                  required
                  placeholder="Email"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <input
                  v-model="signupForm.password"
                  type="password"
                  required
                  placeholder="Password"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <input
                  v-model="signupForm.stripe_account_id"
                  type="text"
                  required
                  placeholder="Stripe account ID"
                  class="h-9 w-full rounded-lg border border-border bg-input-bg px-3 text-xs font-medium outline-none transition focus:border-foreground"
                />
                <button
                  type="submit"
                  :disabled="localLoading"
                  class="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50"
                >
                  <Loader2 v-if="localLoading" class="h-3.5 w-3.5 animate-spin" />
                  <span v-else>Create account</span>
                </button>
              </form>

              <p v-if="localError" class="mt-2 text-center text-[11px] text-destructive">{{ localError }}</p>
            </div>
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
