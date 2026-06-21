const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_URL = `${API_ORIGIN}/api/v1`;

export const fetchDrops = async () => {
  const res = await fetch(`${BASE_URL}/drop/get-drops`);
  if (!res.ok) {
    throw new Error("Failed to fetch drops");
  }
  const result = await res.json();
  return result.data;
};

export const reserveItem = async ({ dropId, userId }) => {
  const res = await fetch(`${BASE_URL}/reservation/drops/${dropId}/reserve`, {
    method: 'POST',
    headers: { 'x-user-id': userId },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Reservation failed');
  return data;
};

export const purchaseItem = async ({ dropId, userId }) => {
  const res = await fetch(`${BASE_URL}/drops/${dropId}/purchase`, {
    method: 'POST',
    headers: { 'x-user-id': userId },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Purchase failed');
  return data;
};
