import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE = 'https://nodejs-instant-api.vercel.app/api'

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

  async function createBill(formData) {
    loading.value = true
    error.value = null

    try {
      const items = formData.items.map((item) => ({
        title: item.name,
        price: parseFloat(item.amount) || 0,
        quantity: item.quantity || 1,
      }))

      const subtotal = items.reduce((s, item) => s + item.price * item.quantity, 0)

      const payload = {
        merchant_id: 1,
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
        throw new Error(`Failed to create bill: ${response.status}`)
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

  async function fetchBill(id) {
    loading.value = true
    error.value = null

    try {
      const existing = bills.value.find((b) => b.id === String(id))
      const token = existing?.token

      const url = token
        ? `${API_BASE}/bills/${id}?token=${encodeURIComponent(token)}`
        : `${API_BASE}/bills/${id}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch bill: ${response.status}`)
      }

      const apiBill = await response.json()

      const mapped = mapApiBillToFrontend(apiBill, {
        title: existing?.title,
        description: existing?.description,
        contributors: existing?.contributors,
      })

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

  function getBill(id) {
    return bills.value.find((b) => b.id === String(id))
  }

  return { bills, loading, error, createBill, fetchBill, getBill }
})
