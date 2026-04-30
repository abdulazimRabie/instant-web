<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { CheckCircle, ArrowRight, Receipt } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const verifying = ref(true)
const verified = ref(false)

onMounted(async () => {
  // In the future: call backend to verify Stripe Connect onboarding completion
  // and update the merchant record with stripe_account_id.
  // For now, simulate a brief verification.
  try {
    await new Promise((r) => setTimeout(r, 800))
    verified.value = true
  } finally {
    verifying.value = false
  }
})

function goToCreateBill() {
  router.push('/app/create')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md text-center">
      <!-- Loading state -->
      <template v-if="verifying">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-input-bg">
          <div class="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
        <h1 class="font-display mt-6 text-2xl font-extrabold tracking-tight">Verifying connection…</h1>
        <p class="mt-2 text-sm text-text-secondary">Please wait while we confirm your Stripe account.</p>
      </template>

      <!-- Success state -->
      <template v-else-if="verified">
        <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-bg text-success-fg">
          <CheckCircle class="h-8 w-8" />
        </div>
        <h1 class="font-display mt-6 text-2xl font-extrabold tracking-tight">Account connected</h1>
        <p class="mt-2 text-sm text-text-secondary">
          Your Stripe account is now linked. You can start creating bills and accepting payments immediately.
        </p>

        <div class="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            @click="goToCreateBill"
            class="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-ink-soft"
          >
            <Receipt class="h-4 w-4" />
            Create your first bill
            <ArrowRight class="h-4 w-4" />
          </button>
          <RouterLink
            to="/app/bills"
            class="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition hover:bg-input-bg"
          >
            Go to bills
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>
