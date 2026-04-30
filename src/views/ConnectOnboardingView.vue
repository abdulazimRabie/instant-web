<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { CheckCircle, ArrowRight, Receipt } from 'lucide-vue-next'

const router = useRouter()

function goToCreateBill() {
  router.push('/app/create')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-md text-center">
      <div class="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-bg text-success-fg">
        <CheckCircle class="h-8 w-8" />
      </div>
      <h1 class="font-display mt-6 text-2xl font-extrabold tracking-tight">Account connected</h1>
      <p class="mt-2 text-sm text-text-secondary">
        Your Stripe account is now linked. It may take a few moments to activate — you can start creating bills right away.
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
    </div>
  </div>
</template>
