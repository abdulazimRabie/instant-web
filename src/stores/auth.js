import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://nodejs-instant-api-production.up.railway.app/api'

const AUTH_KEY = 'instant_merchant_auth'

function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveAuth(payload) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  const auth = ref(loadAuth())
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!auth.value?.token)
  const merchant = computed(() => auth.value?.merchant ?? null)
  const merchantId = computed(() => merchant.value?.id ?? null)
  const initials = computed(() => {
    const name = merchant.value?.name || merchant.value?.email || 'M'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  })

  async function loginMerchant({ email, password }) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/auth/merchant/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Login failed: ${response.status}`)
      }

      const data = await response.json()
      auth.value = { token: data.token, merchant: data.merchant }
      saveAuth(auth.value)
      return data
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function signupMerchant({ name, email, password, stripe_account_id }) {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE}/auth/merchant/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, stripe_account_id }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Signup failed: ${response.status}`)
      }

      const data = await response.json()
      auth.value = { token: data.token, merchant: data.merchant }
      saveAuth(auth.value)
      return data
    } catch (err) {
      error.value = err.message || 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    auth.value = null
    clearAuth()
  }

  return {
    auth,
    loading,
    error,
    isAuthenticated,
    merchant,
    merchantId,
    initials,
    loginMerchant,
    signupMerchant,
    logout,
  }
})
