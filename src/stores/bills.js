import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://nodejs-instant-api-production.up.railway.app/api'

function deriveTitle(apiBill) {
  const items = Array.isArray(apiBill.items) ? apiBill.items : []
  if (items.length === 0) return `Bill ${apiBill.id}`
  const first = items[0]?.title
  if (!first) return `Bill ${apiBill.id}`
  if (items.length === 1) return first
  return `${first} +${items.length - 1} more`
}

function parseItems(itemsField) {
  if (Array.isArray(itemsField)) return itemsField
  if (typeof itemsField === 'string') {
    try {
      const parsed = JSON.parse(itemsField)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function mapApiBillToFrontend(apiBill, localData = {}) {
  const rawItems = parseItems(apiBill.items)
  const items = rawItems.map((item, idx) => ({
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
    merchantId: apiBill.merchant_id != null ? String(apiBill.merchant_id) : undefined,
    title: apiBill.title || deriveTitle(apiBill),
    description: apiBill.description || '',
    items,
    fees,
    total,
    collected: paidAmount,
    status,
    createdAt: apiBill.created_at,
    expiresAt: apiBill.expires_at,
    token: apiBill.token,
    qrUrl: apiBill.qr_url,
    contributorsCount: apiBill.contributors_count ?? 0,
    contributors: localData.contributors || [],
    ...localData,
  }
}

export const useBillsStore = defineStore('bills', () => {
  const bills = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function createBill(formData) {
    loading.value = true
    error.value = null

    try {
      const auth = useAuthStore()
      if (!auth.auth?.token) {
        throw new Error('Authentication required. Please log in.')
      }

      const items = formData.items.map((item) => ({
        title: item.name,
        price: parseFloat(item.amount) || 0,
        quantity: item.quantity || 1,
      }))

      const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0)

      const payload = {
        title: formData.title,
        amount: subtotal + (parseFloat(formData.fees) || 0),
        fees: parseFloat(formData.fees) || 0,
        currency: 'usd',
        items,
      }

      const response = await fetch(`${API_BASE}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.auth.token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || `Failed to create bill: ${response.status}`)
      }

      const data = await response.json()
      const apiBill = data.bill

      const mapped = mapApiBillToFrontend(apiBill)

      bills.value.unshift(mapped)

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
      const mapped = mapApiBillToFrontend(apiBill)

      // Preserve token from existing store entry
      if (existing?.token && !mapped.token) {
        mapped.token = existing.token
      }

      const idx = bills.value.findIndex((b) => b.id === String(id))
      if (idx >= 0) {
        bills.value[idx] = mapped
      } else {
        bills.value.unshift(mapped)
      }

      return mapped
    } catch (err) {
      error.value = err.message || 'Failed to fetch bill'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMerchantBills() {
    loading.value = true
    error.value = null

    try {
      const auth = useAuthStore()
      if (!auth.auth?.token) {
        bills.value = []
        return []
      }

      const response = await fetch(`${API_BASE}/bills/merchant`, {
        headers: {
          Authorization: `Bearer ${auth.auth.token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        if (response.status === 404) {
          bills.value = []
          return []
        }
        throw new Error(data.message || `Failed to fetch bills: ${response.status}`)
      }

      const apiBills = await response.json()
      bills.value = (Array.isArray(apiBills) ? apiBills : []).map((b) => mapApiBillToFrontend(b))

      return bills.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch merchant bills'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchContributors(billId) {
    const auth = useAuthStore()
    if (!auth.auth?.token) return []

    const response = await fetch(`${API_BASE}/payments/${billId}`, {
      headers: {
        Authorization: `Bearer ${auth.auth.token}`,
      },
    })

    if (!response.ok) {
      // 401 = not authenticated, 403 = not a merchant, 404 = no payments yet
      if (response.status === 401 || response.status === 403 || response.status === 404) {
        return []
      }
      const data = await response.json().catch(() => ({}))
      throw new Error(data.message || `Failed to fetch contributors: ${response.status}`)
    }

    const payments = await response.json()
    return (Array.isArray(payments) ? payments : []).map((p) => ({
      id: String(p.id),
      name: p.user_name || 'Anonymous',
      amount: parseFloat(p.amount) || 0,
      paidAt: p.paid_at || p.created_at,
    }))
  }

  function getBill(id) {
    return bills.value.find((b) => b.id === String(id))
  }

  return { bills, loading, error, createBill, fetchBill, fetchMerchantBills, getBill, fetchContributors }
})
