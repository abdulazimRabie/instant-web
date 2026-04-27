<script setup>
import MerchantHeader from '@/components/merchant/MerchantHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-background">
    <MerchantHeader />
    <main class="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
      <RouterView />
    </main>
  </div>
</template>
