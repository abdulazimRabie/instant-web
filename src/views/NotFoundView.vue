<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="max-w-md text-center">
      <p class="text-xs font-medium uppercase tracking-[0.2em] text-brand">Instant</p>
      <h1 class="mt-3 text-7xl font-bold tracking-tight text-foreground">404</h1>
      <h2 class="mt-2 text-xl font-semibold text-foreground">Page not found</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="mt-6">
        <RouterLink
          to="/"
          class="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-ink-soft"
        >
          Back to Instant
        </RouterLink>
      </div>
    </div>
  </div>
</template>
