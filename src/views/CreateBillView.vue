<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Trash2, ArrowRight, Receipt, CreditCard, Loader2 } from 'lucide-vue-next'
import { formatCurrency } from '@/composables/useInstantData'
import { useBillsStore } from '@/stores/bills.js'
import { useAuthStore } from '@/stores/auth.js'

const router = useRouter()
const store = useBillsStore()
const auth = useAuthStore()

const title = ref('')
const description = ref('')
const items = ref([
  { id: crypto.randomUUID(), name: '', amount: '', quantity: 1 },
])
const fees = ref('')
const submitting = ref(false)
const connecting = ref(false)

const needsStripe = computed(() => auth.isAuthenticated && !auth.merchant?.stripe_account_id)

async function startStripeConnect() {
  if (connecting.value) return
  connecting.value = true
  try {
    const url = await auth.getOnboardingLink()
    window.location.href = url
  } catch (err) {
    store.error = err.message || 'Failed to start Stripe Connect onboarding'
  } finally {
    connecting.value = false
  }
}

function newRow() {
  return { id: crypto.randomUUID(), name: '', amount: '', quantity: 1 }
}

const subtotal = computed(() =>
  items.value.reduce((s, r) => s + (parseFloat(r.amount) || 0) * (r.quantity || 1), 0)
)
const total = computed(() => subtotal.value + (parseFloat(fees.value) || 0))

function update(id, patch) {
  items.value = items.value.map((r) => (r.id === id ? { ...r, ...patch } : r))
}
function remove(id) {
  items.value = items.value.length === 1 ? items.value : items.value.filter((r) => r.id !== id)
}

async function generate(e) {
  e.preventDefault()
  if (submitting.value) return

  submitting.value = true
  try {
    const bill = await store.createBill({
      title: title.value,
      description: description.value,
      items: items.value,
      fees: fees.value,
    })
    router.push(`/app/bill/${bill.id}`)
  } catch {
    // Error is stored in store.error
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
    <!-- Form -->
    <div class="anim-fade-up">
      <div class="flex items-center gap-3">
        <span class="grid h-9 w-9 place-items-center rounded-xl bg-success-bg text-success-fg">
          <Receipt class="h-4 w-4" />
        </span>
        <div>
          <h1 class="font-display text-2xl font-extrabold tracking-tight">Create a bill</h1>
          <p class="text-xs text-text-secondary">
            Add line items, set fees, and we'll generate a shareable QR.
          </p>
        </div>
      </div>

      <!-- Stripe connect prompt (non-blocking) -->
      <div v-if="needsStripe" class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
        <div class="flex items-start gap-3">
          <CreditCard class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div class="flex-1">
            <p class="font-semibold">Connect Stripe to accept payments</p>
            <p class="mt-0.5 text-xs text-amber-700">
              You can still create and preview bills. Guests won't be able to pay until you connect a Stripe account.
            </p>
          </div>
          <button
            type="button"
            @click="startStripeConnect"
            :disabled="connecting"
            class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50"
          >
            <Loader2 v-if="connecting" class="h-3.5 w-3.5 animate-spin" />
            <span v-else>Connect</span>
          </button>
        </div>
      </div>

      <div v-else>
          <!-- Bill creation form -->
          <form @submit="generate" class="mt-6 space-y-5 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8">
            <label class="block">
              <span class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Bill title
              </span>
              <input
                v-model="title"
                required
                placeholder="e.g. Table 14 · Friday Dinner"
                class="h-11 w-full rounded-xl border border-border bg-input-bg px-4 text-sm font-medium outline-none transition focus:border-foreground focus:bg-surface"
              />
            </label>

            <label class="block">
              <span class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Description (optional)
              </span>
              <textarea
                v-model="description"
                rows="2"
                placeholder="A short note everyone will see."
                class="w-full resize-none rounded-xl border border-border bg-input-bg px-4 py-3 text-sm outline-none transition focus:border-foreground focus:bg-surface"
              />
            </label>

            <div>
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Line items
                </label>
                <button
                  type="button"
                  @click="items = [...items, newRow()]"
                  class="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-[11px] font-semibold text-primary-foreground transition hover:bg-ink-soft"
                >
                  <Plus class="h-3.5 w-3.5" />
                  Add item
                </button>
              </div>

              <div class="mt-3 divide-y divide-divider rounded-2xl border border-border bg-input-bg/50">
                <div
                  v-for="(row, idx) in items"
                  :key="row.id"
                  class="grid grid-cols-[auto_1fr_80px_120px_auto] items-center gap-3 px-3 py-2.5"
                >
                  <span class="grid h-7 w-7 place-items-center rounded-lg bg-surface text-[11px] font-bold text-text-secondary">
                    {{ idx + 1 }}
                  </span>
                  <input
                    v-model="row.name"
                    placeholder="Item name"
                    class="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 text-sm font-medium outline-none transition focus:border-border focus:bg-surface"
                  />
                  <input
                    type="number"
                    min="1"
                    inputmode="numeric"
                    :value="row.quantity"
                    @input="update(row.id, { quantity: Math.max(1, parseInt($event.target.value) || 1) })"
                    placeholder="Qty"
                    class="h-9 w-full rounded-lg border border-transparent bg-transparent px-2 text-center text-sm font-medium outline-none transition focus:border-border focus:bg-surface"
                  />
                  <div class="relative">
                    <span class="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-xs text-text-muted">
                      $
                    </span>
                    <input
                      inputmode="decimal"
                      :value="row.amount"
                      @input="update(row.id, { amount: $event.target.value.replace(/[^0-9.]/g, '') })"
                      placeholder="0.00"
                      class="h-9 w-full rounded-lg border border-transparent bg-transparent pl-6 pr-2 text-right text-sm font-semibold outline-none transition focus:border-border focus:bg-surface"
                    />
                  </div>
                  <button
                    type="button"
                    @click="remove(row.id)"
                    :disabled="items.length === 1"
                    class="grid h-8 w-8 place-items-center rounded-lg text-text-muted transition hover:bg-surface hover:text-destructive disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove item"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <label class="block">
              <span class="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Fees / service charge
              </span>
              <div class="relative">
                <span class="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-xs text-text-muted">
                  $
                </span>
                <input
                  inputmode="decimal"
                  v-model="fees"
                  @input="fees = $event.target.value.replace(/[^0-9.]/g, '')"
                  placeholder="0.00"
                  class="h-11 w-full rounded-xl border border-border bg-input-bg pl-8 pr-4 text-sm font-semibold outline-none transition focus:border-foreground focus:bg-surface"
                />
              </div>
            </label>

          <button
            type="submit"
            :disabled="submitting"
            class="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:bg-ink-soft disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting">Generating…</span>
            <template v-else>
              Generate Bill
              <ArrowRight class="h-4 w-4" />
            </template>
          </button>

          <p v-if="store.error" class="mt-3 text-center text-sm text-destructive">
            {{ store.error }}
          </p>
        </form>
      </div>

      
    </div>

    <!-- Live summary -->
    <aside v-if="!needsStripe" class="lg:sticky lg:top-24 lg:self-start anim-fade-up">
      <div class="rounded-3xl border border-border bg-dark-grad p-7 text-primary-foreground shadow-pop">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
          Bill preview
        </p>
        <h2 class="font-display mt-2 text-xl font-bold">{{ title || 'Untitled bill' }}</h2>
        <p v-if="description" class="mt-1 text-xs text-primary-foreground/70">{{ description }}</p>

        <div class="mt-6 space-y-2 text-sm">
          <div
            v-for="i in items.filter((i) => i.name || i.amount)"
            :key="i.id"
            class="flex justify-between text-primary-foreground/80"
          >
            <span class="truncate pr-4">
              {{ i.name || 'Item' }}
              <span v-if="(i.quantity || 1) > 1" class="text-primary-foreground/50">×{{ i.quantity || 1 }}</span>
            </span>
            <span class="font-semibold tabular-nums">
              {{ formatCurrency((parseFloat(i.amount) || 0) * (i.quantity || 1)) }}
            </span>
          </div>
        </div>

        <div class="mt-6 space-y-1.5 border-t border-white/10 pt-4 text-xs text-primary-foreground/70">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span class="font-medium tabular-nums text-primary-foreground">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Fees</span>
            <span class="font-medium tabular-nums text-primary-foreground">{{ formatCurrency(parseFloat(fees) || 0) }}</span>
          </div>
        </div>

        <div class="mt-4 flex items-end justify-between border-t border-white/10 pt-4">
          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground/60">
            Total
          </span>
          <span class="font-display text-3xl font-extrabold tabular-nums">
            {{ formatCurrency(total) }}
          </span>
        </div>
      </div>
      <p class="mt-4 text-center text-[11px] text-text-muted">
        Bill ID, QR code, and shareable link are generated on submit.
      </p>
    </aside>
  </div>
</template>
