<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const localLoading = ref(false)
const localError = ref(null)

async function onSubmit() {
  localLoading.value = true
  localError.value = null
  try {
    await auth.loginMerchant({ email: email.value, password: password.value })
    const redirect = route.query.redirect
    router.replace(redirect && typeof redirect === 'string' ? redirect : '/app/create')
  } catch (err) {
    localError.value = err.message
  } finally {
    localLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm">
      <div class="text-center">
        <span class="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
          ⌁
        </span>
        <h1 class="font-display mt-4 text-2xl font-extrabold tracking-tight">Welcome back</h1>
        <p class="mt-1 text-sm text-text-secondary">Log in to your merchant console.</p>
      </div>

      <form @submit.prevent="onSubmit" class="mt-8 space-y-4">
        <label class="block">
          <span class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">Email</span>
          <input
            v-model="email"
            type="email"
            required
            placeholder="merchant@example.com"
            class="h-11 w-full rounded-xl border border-border bg-input-bg px-4 text-sm font-medium outline-none transition focus:border-foreground focus:bg-surface"
          />
        </label>

        <label class="block">
          <span class="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">Password</span>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="h-11 w-full rounded-xl border border-border bg-input-bg px-4 text-sm font-medium outline-none transition focus:border-foreground focus:bg-surface"
          />
        </label>

        <button
          type="submit"
          :disabled="localLoading"
          class="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50"
        >
          <Loader2 v-if="localLoading" class="h-4 w-4 animate-spin" />
          <span v-else>Log in</span>
        </button>

        <p v-if="localError" class="text-center text-sm text-destructive">{{ localError }}</p>
      </form>

      <div class="mt-6 flex items-center justify-between text-sm">
        <RouterLink to="/signup" class="font-medium text-text-secondary transition hover:text-foreground">
          Create an account
        </RouterLink>
        <RouterLink to="/" class="inline-flex items-center gap-1 text-text-secondary transition hover:text-foreground">
          <ArrowLeft class="h-3.5 w-3.5" /> Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
