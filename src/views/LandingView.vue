<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  QrCode,
  Receipt,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  LogIn,
  UserPlus,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()

const checks = ['Free to start', 'No setup fees', 'Cancel anytime']
const logoNames = ['OLIVE & ASH', 'BLUE BOTTLE', 'ROAM PIZZA', 'KAYA BAR', 'NORTH BREW', 'ORLO BISTRO']

const steps = [
  {
    n: '01',
    icon: Receipt,
    title: 'Merchant creates the bill',
    body: 'Add the items, fees, and total. One tap generates a Bill ID, QR code, and shareable link.',
  },
  {
    n: '02',
    icon: ScanLine,
    title: 'Everyone scans and pays',
    body: 'Each person scans the QR, chooses their amount on the numpad, and pays with Stripe — instantly.',
  },
  {
    n: '03',
    icon: Zap,
    title: 'Everyone sees it live',
    body: 'The remaining balance updates in real time. Merchant gets notified. Bill closes itself when paid.',
  },
]

const features = [
  { icon: QrCode, t: 'QR + Shareable Link', b: 'Print, project, or share digitally. Works on any phone camera.' },
  { icon: Users, t: 'Quick Split', b: 'Anyone can scan and pay their share in seconds. Simple, fast, and hassle-free.' },
  { icon: Zap, t: 'Real-time Balance', b: 'Watch contributions land live. Merchant gets push notifications.' },
  { icon: ShieldCheck, t: 'Stripe-powered', b: 'PCI-compliant payments routed straight to your merchant account.' },
  { icon: Receipt, t: 'Bill History', b: 'Filter active, completed, and expired bills. Export anytime.' },
  { icon: Sparkles, t: 'Beautifully simple', b: 'One screen to create. One screen to track. That\'s it.' },
]

const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- SiteNav -->
    <header class="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <RouterLink to="/" class="flex items-center gap-2.5">
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-primary text-2xl font-bold text-primary-foreground">
            ⌁
          </span>
          <span class="font-display text-lg font-bold tracking-tight">Instant</span>
        </RouterLink>
        <nav class="hidden items-center gap-8 text-sm text-text-secondary sm:flex">
          <a href="#how" class="transition hover:text-foreground">How it works</a>
          <a href="#features" class="transition hover:text-foreground">Features</a>
          <a href="#story" class="transition hover:text-foreground">Why Instant</a>
        </nav>
        <RouterLink
          v-if="auth.isAuthenticated"
          to="/app/bills"
          class="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:bg-ink-soft"
        >
          Open console
          <ArrowUpRight class="h-3.5 w-3.5" />
        </RouterLink>
        <RouterLink
          v-else
          to="/login"
          class="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-xs font-semibold text-foreground transition hover:bg-input-bg"
        >
          <LogIn class="h-3.5 w-3.5" />
          Log in
        </RouterLink>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-hero" aria-hidden />
      <div class="absolute inset-0 grid-bg opacity-[0.35]" aria-hidden />
      <div class="relative mx-auto grid max-w-6xl gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-32">
        <div class="flex flex-col justify-center anim-fade-up">
          <span class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
            <span class="h-1.5 w-1.5 rounded-full bg-success" />
            Live · Sending & Receiving Money
          </span>
          <h1 class="font-display mt-6 text-balance text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-[80px]">
            Shared bills,
            <br />
            <span class="relative inline-block">
              <span class="relative z-10 italic text-brand">paid in seconds.</span>
              <span class="absolute inset-x-0 bottom-1 -z-0 h-3 bg-brand-tint/80" aria-hidden />
            </span>
          </h1>
          <p class="mt-6 max-w-xl text-balance text-base text-text-secondary sm:text-lg">
            Instant lets merchants generate a shared bill, display a QR code, and let everyone scan,
            choose their amount, and pay via Stripe. No "I'll pay you back". Just done.
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <RouterLink
              v-if="auth.isAuthenticated"
              to="/app/bills"
              class="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-ink-soft"
            >
              Open the console
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
            <template v-else>
              <RouterLink
                to="/signup"
                class="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-ink-soft"
              >
                <UserPlus class="h-4 w-4" />
                Create account
              </RouterLink>
              <RouterLink
                to="/login"
                class="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-semibold text-foreground transition hover:bg-input-bg"
              >
                <LogIn class="h-4 w-4" />
                Log in
              </RouterLink>
            </template>
          </div>

          <dl class="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8 max-w-md">
            <div>
              <dt class="font-display text-2xl font-bold tracking-tight text-foreground">&lt; 5s</dt>
              <dd class="mt-1 text-xs text-text-secondary">To generate a bill</dd>
            </div>
            <div>
              <dt class="font-display text-2xl font-bold tracking-tight text-foreground">0</dt>
              <dd class="mt-1 text-xs text-text-secondary">Setup fees</dd>
            </div>
            <div>
              <dt class="font-display text-2xl font-bold tracking-tight text-foreground">Live</dt>
              <dd class="mt-1 text-xs text-text-secondary">Real-time updates</dd>
            </div>
          </dl>
        </div>

        <!-- HeroBillMock -->
        <div class="relative mx-auto w-full max-w-md anim-fade-up">
          <!-- Background card (ledger feel) -->
          <div class="absolute -right-6 top-10 hidden h-[360px] w-[260px] rotate-6 rounded-3xl bg-dark-grad shadow-pop sm:block" aria-hidden>
            <div class="p-6 text-primary-foreground/80">
              <p class="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-70">Last bill</p>
              <p class="font-display mt-2 text-3xl font-bold">$290.00</p>
              <p class="mt-1 text-xs opacity-70">Birthday Brunch · Sara</p>
              <div class="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div class="h-full w-full bg-success" />
              </div>
              <p class="mt-2 text-[10px] opacity-60">8 contributors · Completed</p>
            </div>
          </div>

          <!-- Foreground bill card -->
          <div class="relative rounded-3xl border border-border bg-surface p-6 shadow-pop">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Bill · INS-2K9F4D
                </p>
                <h3 class="font-display mt-1 text-lg font-bold">Table 14 · Friday Dinner</h3>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-medium text-success-fg">
                <span class="h-1.5 w-1.5 rounded-full bg-success anim-pulse-soft" />
                Active
              </span>
            </div>

            <div class="mt-5 grid grid-cols-[auto_1fr] items-center gap-5">
              <div class="rounded-2xl border border-border bg-surface p-3 shadow-card">
                <QrcodeVue
                  value="https://instant.app/p/INS-2K9F4D"
                  :size="108"
                  background="#ffffff"
                  foreground="#1A1A1A"
                  level="M"
                  :margin="0"
                />
              </div>
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Remaining
                </p>
                <p class="font-display mt-1 text-4xl font-extrabold tracking-tight">$76.50</p>
                <p class="mt-1 text-xs text-text-secondary">$122.00 of $198.50 collected</p>
                <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-divider">
                  <div class="h-full rounded-full bg-success" style="width: 61%" />
                </div>
              </div>
            </div>

            <div class="mt-5 space-y-2.5">
              <div class="flex items-center justify-between rounded-2xl bg-input-bg px-3 py-2.5">
                <div class="flex items-center gap-3">
                  <div class="grid h-8 w-8 place-items-center rounded-full bg-success-bg text-xs font-bold text-success-fg">M</div>
                  <div class="leading-tight">
                    <p class="text-xs font-semibold">Maya R.</p>
                    <p class="text-[11px] text-text-muted">paid 4m ago</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-foreground">$35</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-input-bg px-3 py-2.5">
                <div class="flex items-center gap-3">
                  <div class="grid h-8 w-8 place-items-center rounded-full bg-success-bg text-xs font-bold text-success-fg">?</div>
                  <div class="leading-tight">
                    <p class="text-xs font-semibold">Anonymous</p>
                    <p class="text-[11px] text-text-muted">paid 9m ago</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-foreground">$22</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-input-bg px-3 py-2.5">
                <div class="flex items-center gap-3">
                  <div class="grid h-8 w-8 place-items-center rounded-full bg-success-bg text-xs font-bold text-success-fg">J</div>
                  <div class="leading-tight">
                    <p class="text-xs font-semibold">Jordan P.</p>
                    <p class="text-[11px] text-text-muted">paid 14m ago</p>
                  </div>
                </div>
                <span class="text-sm font-bold text-foreground">$40</span>
              </div>
            </div>
          </div>

          <!-- Floating chip -->
          <div class="absolute -left-3 -top-3 hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 shadow-card sm:inline-flex anim-float">
            <Sparkles class="h-3.5 w-3.5 text-brand" />
            <span class="text-[11px] font-semibold">+ $40 from Jordan</span>
          </div>
        </div>
      </div>
    </section>

    <!-- LogoStrip -->
    <div class="border-y border-border bg-surface">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-10 gap-y-4 px-5 py-6 text-text-muted sm:px-8">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em]">Trusted by merchants</p>
        <span
          v-for="n in logoNames"
          :key="n"
          class="font-display text-sm font-bold tracking-[0.2em] opacity-70"
        >
          {{ n }}
        </span>
      </div>
    </div>

    <!-- StorySection -->
    <section id="story" class="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div class="grid items-start gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">The story</p>
          <h2 class="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            "Who's paying for the tea?"
          </h2>
        </div>
        <div class="space-y-6 text-base leading-relaxed text-text-secondary sm:text-lg">
          <p class="text-foreground">
            You're at a restaurant with friends. The bill comes. Nobody wants to do the math. Someone
            puts a card down. The Venmo requests start the next morning.
          </p>
          <p>
            With Instant, the merchant generates a shared bill in five seconds. Each person scans the QR,
            picks their amount, and pays — directly via Stripe. The bill updates live, the merchant gets
            notified, and everyone sees the remaining balance shrink in real time.
          </p>
          <p class="font-medium text-foreground">No friction. No "I'll pay you back."</p>
        </div>
      </div>
    </section>

    <!-- HowItWorks -->
    <section id="how" class="border-y border-border bg-primary text-primary-foreground">
      <div class="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-2xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-lime">
              How it works
            </p>
            <h2 class="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Three steps. Simple and fast.
            </h2>
          </div>
          <RouterLink
            v-if="auth.isAuthenticated"
            to="/app/bills"
            class="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 text-xs font-semibold text-foreground transition hover:bg-brand-tint"
          >
            Try it now
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
          <RouterLink
            v-else
            to="/signup"
            class="inline-flex h-11 items-center gap-2 rounded-full bg-surface px-5 text-xs font-semibold text-foreground transition hover:bg-brand-tint"
          >
            Get started
            <ArrowRight class="h-4 w-4" />
          </RouterLink>
        </div>

        <div class="mt-14 grid gap-5 md:grid-cols-3">
          <div
            v-for="s in steps"
            :key="s.n"
            class="rounded-3xl border border-white/10 bg-ink-soft/60 p-7 transition hover:bg-ink-soft"
          >
            <div class="flex items-center justify-between">
              <span class="font-display text-xs font-bold tracking-[0.3em] text-brand-lime">
                {{ s.n }}
              </span>
              <span class="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                <component :is="s.icon" class="h-5 w-5" />
              </span>
            </div>
            <h3 class="font-display mt-8 text-xl font-bold">{{ s.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-primary-foreground/70">{{ s.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FeatureGrid -->
    <section id="features" class="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <div class="max-w-2xl">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">Features</p>
        <h2 class="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Everything you need.
          <br />
          <span class="text-text-secondary">Nothing you don't.</span>
        </h2>
      </div>
      <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="f in features"
          :key="f.t"
          class="group rounded-3xl border border-border bg-surface p-7 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
        >
          <span class="grid h-11 w-11 place-items-center rounded-2xl bg-success-bg text-success-fg">
            <component :is="f.icon" class="h-5 w-5" />
          </span>
          <h3 class="font-display mt-6 text-lg font-bold">{{ f.t }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-text-secondary">{{ f.b }}</p>
        </div>
      </div>
    </section>

    <!-- BigCTA -->
    <section class="mx-auto max-w-6xl px-5 pb-24 sm:px-8 sm:pb-32">
      <div class="relative overflow-hidden rounded-[36px] bg-brand-grad p-10 text-primary-foreground sm:p-16">
        <div class="absolute inset-0 grid-bg opacity-[0.18]" aria-hidden />
        <div class="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-2xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Ready when you are
            </p>
            <h2 class="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Generate your first shared bill in under a minute.
            </h2>
            <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <li v-for="c in checks" :key="c" class="inline-flex items-center gap-2">
                <Check class="h-4 w-4" />
                {{ c }}
              </li>
            </ul>
          </div>
          <RouterLink
            v-if="auth.isAuthenticated"
            to="/app/bills"
            class="inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-surface px-7 text-sm font-bold text-foreground shadow-pop transition hover:bg-brand-tint"
          >
            Open the console
            <ArrowUpRight class="h-4 w-4" />
          </RouterLink>
          <RouterLink
            v-else
            to="/signup"
            class="inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-surface px-7 text-sm font-bold text-foreground shadow-pop transition hover:bg-brand-tint"
          >
            Get started free
            <ArrowUpRight class="h-4 w-4" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- SiteFooter -->
    <footer class="border-t border-border bg-surface">
      <div class="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div class="flex items-center gap-2.5">
          <span class="grid h-7 w-7 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            ⌁
          </span>
          <span class="font-display text-sm font-bold">Instant</span>
          <span class="text-xs text-text-muted">© {{ currentYear }}</span>
        </div>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-text-secondary">
          <a href="#how" class="hover:text-foreground">How it works</a>
          <a href="#features" class="hover:text-foreground">Features</a>
          <RouterLink v-if="auth.isAuthenticated" to="/app/bills" class="hover:text-foreground">Console</RouterLink>
          <span class="text-text-muted">Built for the payments industry.</span>
        </div>
      </div>
    </footer>
  </div>
</template>
