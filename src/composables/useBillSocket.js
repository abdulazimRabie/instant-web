import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth.js'
import { ref, onUnmounted } from 'vue'

const SOCKET_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://nodejs-instant-api-production.up.railway.app/api'
).replace(/\/api$/, '')

export function useBillSocket() {
  const socket = ref(null)
  const connected = ref(false)

  function connect(billId, handlers) {
    disconnect()

    const auth = useAuthStore()
    if (!auth.auth?.token) return

    socket.value = io(SOCKET_BASE, {
      auth: { jwt: auth.auth.token },
      transports: ['websocket', 'polling'],
    })

    socket.value.on('connect', () => {
      connected.value = true
      socket.value.emit('subscribe:bill', Number(billId))
    })

    socket.value.on('disconnect', () => {
      connected.value = false
    })

    socket.value.on('payment:initiated', (data) => {
      handlers.onPaymentInitiated?.(data)
    })

    socket.value.on('payment:succeeded', (data) => {
      handlers.onPaymentSucceeded?.(data)
    })

    socket.value.on('payment:cancelled', (data) => {
      handlers.onPaymentCancelled?.(data)
    })

    socket.value.on('bill:paid', (data) => {
      handlers.onBillPaid?.(data)
    })

    socket.value.on('error', (msg) => {
      console.error('Socket error:', msg)
    })
  }

  function disconnect() {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  onUnmounted(disconnect)

  return { connect, disconnect, connected }
}
