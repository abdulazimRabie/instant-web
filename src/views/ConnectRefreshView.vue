<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { AlertTriangle, RefreshCcw, ArrowLeft, HelpCircle } from 'lucide-vue-next'

const retrying = ref(false)

async function onRetry() {
  retrying.value = true
  // In the future: hit the backend Stripe Connect onboarding endpoint again
  // and redirect the user to Stripe.
  try {
    await new Promise((r) => setTimeout(r, 600))
    // Placeholder — window.location.href = onboardingUrl
    alert('Stripe Connect onboarding endpoint is not yet implemented on the backend.')
  } finally {
    retrying.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md text-center">
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle class="h-8 w-8" />
      </div>

      <h1 class="font-display mt-6 text-2xl font-extrabold tracking-tight">Connection interrupted</h1>
      <p class="mt-2 text-sm text-text-secondary">
        We couldn't complete your Stripe account setup. This can happen if the session expired or the onboarding was not finished.
      </p>

      <div class="mt-8 space-y-3">
        <button
          type="button"
          @click="onRetry"
          :disabled="retrying"
          class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50 sm:w-auto"
        >
          <RefreshCcw v-if="retrying" class="h-4 w-4 animate-spin" />
          <RefreshCcw v-else class="h-4 w-4" />
          {{ retrying ? 'Retrying…' : 'Try again' }}
        </button>

        <RouterLink
          to="/app/create"
          class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-6 text-sm font-semibold text-foreground transition hover:bg-input-bg sm:w-auto"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to console
        </RouterLink>
      </div>

      <div class="mt-8 rounded-2xl border border-border bg-surface p-4 text-left">
        <div class="flex items-start gap-3">
          <HelpCircle class="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
          <div>
            <p class="text-xs font-semibold text-foreground">Why am I seeing this?</p>
            <p class="mt-1 text-xs text-text-secondary leading-relaxed">
              Stripe requires merchants to complete a one-time onboarding to verify identity and set up payout details. If you exited early or the session timed out, you'll need to restart the process.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
