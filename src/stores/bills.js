import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://nodejs-instant-api-production.up.railway.app/api'

function mapApiBillToFrontend(apiBill, localData = {}) {
  const items = (apiBill.items || []).map((item, idx) => ({
    id: `i${idx + 1}`,
    name: item.title,
    amount: item.price,
    qty: item.quantity,
  }))

  const total = parseFloat(apiBill.amount) || 0
  const fees = parseFloat(apiBill.fees) || 0
  const paidAmount = apiBill.paid_amount !== undefined ? parseFloat(apiBill.paid_amount) : 0
  const remaining = apiBill.remaining !== undefined ? parseFloat(apiBill.remaining) : total

  let status = 'active'
  if (apiBill.status === 'open') {
    if (remaining <= 0 && total > 0) {
      status = 'completed'
    } else if (apiBill.expires_at && new Date(apiBill.expires_at) < new Date()) {
      status = 'expired'
    } else {
      status = 'active'
    }
  }

  return {
    id: String(apiBill.id),
    title: localData.title || `Bill #${apiBill.id}`,
    description: localData.description || '',
    items,
    fees,
    total,
    collected: paidAmount,
    status,
    createdAt: apiBill.created_at,
    expiresAt: apiBill.expires_at,
    token: apiBill.token,
    qrUrl: apiBill.qr_url,
    contributors: localData.contributors || [],
    ...localData,
  }
}

export const useBillsStore = defineStore('bills', () => {
  const bills = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Load from localStorage
  try {
    const saved = localStorage.getItem('instant_bills')
    if (saved) {
      bills.value = JSON.parse(saved)
    }
  } catch {
    // ignore
  }

  function persist() {
    localStorage.setItem('instant_bills', JSON.stringify(bills.value))
  }

  function resolveMerchantId() {
    const auth = useAuthStore()
    if (auth.merchantId) return auth.merchantId
    // Fallback to legacy localStorage key for unauthenticated sessions
    const legacy = localStorage.getItem('instant_merchant_id')
    if (legacy) return Number(legacy)
    return 1
  }

  async function createBill(formData) {
    loading.value = true
    error.value = null

    try {
      const merchant_id = resolveMerchantId()

      const items = formData.items.map((item) => ({
        title: item.name,
        price: parseFloat(item.amount) || 0,
        quantity: item.quantity || 1,
      }))

      const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0)

      const payload = {
        merchant_id,
        amount: subtotal + (parseFloat(formData.fees) || 0),
        fees: parseFloat(formData.fees) || 0,
        currency: 'usd',
        items,
      }

      const response = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Failed to create bill: ${response.status}`)
      }

      const data = await response.json()
      const apiBill = data.bill

      const mapped = mapApiBillToFrontend(apiBill, {
        title: formData.title,
        description: formData.description,
      })

      bills.value.unshift(mapped)
      persist()

      return mapped
    } catch (err) {
      error.value = err.message || 'Failed to create bill'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBill(id, { token: explicitToken } = {}) {
    loading.value = true
    error.value = null

    try {
      const existing = bills.value.find((b) => b.id === String(id))
      const token = explicitToken || existing?.token

      if (!token) {
        throw new Error('Bill access token is required. Please scan the QR or use the share link.')
      }

      const url = `${API_BASE}/bills/${id}?token=${encodeURIComponent(token)}`

      const response = await fetch(url)
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Failed to fetch bill: ${response.status}`)
      }

      const apiBill = await response.json()

      const mapped = mapApiBillToFrontend(apiBill, {
        title: existing?.title,
        description: existing?.description,
        contributors: existing?.contributors,
      })

      // Preserve the token from existing local data if backend strips it
      if (existing?.token && !mapped.token) {
        mapped.token = existing.token
      }

      const idx = bills.value.findIndex((b) => b.id === String(id))
      if (idx >= 0) {
        bills.value[idx] = mapped
      } else {
        bills.value.unshift(mapped)
      }
      persist()

      return mapped
    } catch (err) {
      error.value = err.message || 'Failed to fetch bill'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMerchantBills(merchantId) {
    loading.value = true
    error.value = null

    const resolvedId = merchantId || resolveMerchantId()
    if (!resolvedId) {
      loading.value = false
      return []
    }

    try {
      const response = await fetch(`${API_BASE}/bills/merchant?merchant_id=${encodeURIComponent(resolvedId)}`)

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        // 404 from backend means "no bills" or "merchant not found" — treat as empty array
        if (response.status === 404) {
          return []
        }
        throw new Error(data.message || `Failed to fetch bills: ${response.status}`)
      }

      const apiBills = await response.json()
      const mapped = (Array.isArray(apiBills) ? apiBills : []).map((b) => mapApiBillToFrontend(b))

      // Merge with local data preserving title/description/contributors
      mapped.forEach((incoming) => {
        const idx = bills.value.findIndex((b) => b.id === incoming.id)
        if (idx >= 0) {
          const local = bills.value[idx]
          bills.value[idx] = {
            ...incoming,
            title: local.title || incoming.title,
            description: local.description || incoming.description,
            contributors: local.contributors || incoming.contributors,
          }
        } else {
          bills.value.push(incoming)
        }
      })

      // Remove local-only bills that no longer exist on the server for this merchant
      // (Only if we successfully fetched — don't clear on network error)
      const serverIds = new Set(mapped.map((b) => b.id))
      bills.value = bills.value.filter((b) => {
        // Keep bills that came from server OR have no merchant association
        return serverIds.has(b.id) || !b.merchantId
      })

      persist()
      return mapped
    } catch (err) {
      error.value = err.message || 'Failed to fetch merchant bills'
      throw err
    } finally {
      loading.value = false
    }
  }

  function getBill(id) {
    return bills.value.find((b) => b.id === String(id))
  }

  return { bills, loading, error, createBill, fetchBill, fetchMerchantBills, getBill }
})
