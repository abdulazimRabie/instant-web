// Centralized mock data for the Instant merchant app.
export const BillStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
}

export const merchant = {
  name: "Olive & Ash",
  tagline: "Bistro · Downtown",
  initials: "OA",
};

export const bills = [
  {
    id: "INS-2K9F4D",
    title: "Table 14 · Friday Dinner",
    description: "Group of 6 — split however you'd like",
    items: [
      { id: "i1", name: "Truffle Pasta", amount: 24, qty: 2 },
      { id: "i2", name: "Wagyu Burger", amount: 32, qty: 1 },
      { id: "i3", name: "Caesar Salad", amount: 14, qty: 2 },
      { id: "i4", name: "House Red (bottle)", amount: 48, qty: 1 },
      { id: "i5", name: "Tiramisu", amount: 12, qty: 3 },
    ],
    fees: 8.5,
    total: 198.5,
    collected: 122.0,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
    contributors: [
      { id: "c1", name: "Maya R.", amount: 35, paidAt: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
      { id: "c2", name: null, amount: 22, paidAt: new Date(Date.now() - 1000 * 60 * 9).toISOString() },
      { id: "c3", name: "Jordan P.", amount: 40, paidAt: new Date(Date.now() - 1000 * 60 * 14).toISOString() },
      { id: "c4", name: "Sam K.", amount: 25, paidAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
    ],
  },
  {
    id: "INS-7H3M1A",
    title: "Birthday Brunch · Sara",
    items: [
      { id: "i1", name: "Brunch Set", amount: 28, qty: 8 },
      { id: "i2", name: "Mimosas", amount: 9, qty: 6 },
    ],
    fees: 12,
    total: 290,
    collected: 290,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    contributors: [
      { id: "c1", name: "Sara M.", amount: 40, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
      { id: "c2", name: "Leo D.", amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
      { id: "c3", name: null, amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
      { id: "c4", name: "Ines V.", amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "c5", name: "Theo C.", amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "c6", name: "Rhea S.", amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
      { id: "c7", name: "Noor A.", amount: 35, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString() },
      { id: "c8", name: "Kai L.", amount: 35, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() },
    ],
  },
  {
    id: "INS-4Q8X2P",
    title: "Office Lunch Order",
    items: [
      { id: "i1", name: "Bowl Combo", amount: 18, qty: 12 },
    ],
    fees: 6,
    total: 222,
    collected: 144,
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    contributors: [
      { id: "c1", name: "Priya N.", amount: 18, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { id: "c2", name: "Alex W.", amount: 18, paidAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
      { id: "c3", name: null, amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
      { id: "c4", name: "Mei T.", amount: 18, paidAt: new Date(Date.now() - 1000 * 60 * 50).toISOString() },
      { id: "c5", name: "Diego F.", amount: 18, paidAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
      { id: "c6", name: null, amount: 36, paidAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    ],
  },
  {
    id: "INS-9C1Z6E",
    title: "Wine Tasting · Group",
    items: [{ id: "i1", name: "Tasting Flight", amount: 45, qty: 5 }],
    fees: 10,
    total: 235,
    collected: 90,
    status: "expired",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    contributors: [
      { id: "c1", name: "Owen B.", amount: 45, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString() },
      { id: "c2", name: "Lila J.", amount: 45, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString() },
    ],
  },
  {
    id: "INS-3B5W8R",
    title: "Coffee Run · Studio",
    items: [{ id: "i1", name: "Latte", amount: 6, qty: 7 }],
    fees: 0,
    total: 42,
    collected: 42,
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    contributors: [
      { id: "c1", name: "Eli H.", amount: 6, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString() },
      { id: "c2", name: "Tova R.", amount: 6, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString() },
      { id: "c3", name: null, amount: 12, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString() },
      { id: "c4", name: "June Q.", amount: 6, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString() },
      { id: "c5", name: "Ravi M.", amount: 12, paidAt: new Date(Date.now() - 1000 * 60 * 60 * 69).toISOString() },
    ],
  },
];

export function getBill(id) {
  return bills.find((b) => b.id === id);
}

export function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function initialOf(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}
