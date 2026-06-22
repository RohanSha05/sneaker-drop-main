# 👟 Sneaker Drop — Real-Time Inventory System

A full-stack web application for **limited-edition sneaker drops** with **real-time inventory updates**.

Users can reserve sneakers, complete checkout within **60 seconds**, and see stock changes instantly across all active sessions.

## ✨ Features

* ⏱️ 60-second reservation window
* 📦 Live inventory tracking
* 🔄 Real-time stock synchronization
* 🛒 Reservation → Purchase flow
* ⚡ Instant UI updates via WebSocket
* 📱 Responsive interface

---

## 🛠 Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React, Zustand, React Query, DaisyUI, Socket.io Client |
| Backend    | Node.js, Express, Socket.io                            |
| Database   | PostgreSQL, Prisma ORM                                 |
| Deployment | Vercel, Neon                                           |

---

## 🚀 Run Locally

### Prerequisites

* Node.js 18+
* PostgreSQL 14+

### Clone & Install

```bash
git clone https://github.com/your-username/sneaker-drop.git
cd sneaker-drop

# backend
cd server
npm install

# frontend
cd ../client
npm install
```

### Configure Environment

Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/sneaker_drop
CLIENT_URL=http://localhost:3000
RESERVATION_TIMEOUT=60
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

### Setup Database

```bash
cd server
npx prisma migrate dev
npx prisma generate
```

### Start Application

```bash
# backend
npm run dev

# frontend
npm run dev
```

---

## 🏗 Architecture

The system follows a **real-time reservation architecture**.

* React manages UI and reservation state
* Express handles reservation and inventory logic
* PostgreSQL + Prisma ensure data consistency
* Socket.io pushes stock updates instantly to connected users

The focus was maintaining **accurate inventory with real-time feedback**.

---

## ⏱ 60-Second Expiration Logic

When a user reserves an item, I create a reservation with an expiration time set to **60 seconds**.

A background job runs every **15 seconds** and:

* Finds expired active reservations
* Marks them expired
* Restores stock automatically
* Broadcasts updated inventory via WebSocket

### Flow

Reserve
→ Start 60s Timer
→ Background Check
→ Expire Reservation
→ Restore Stock
→ Update Clients

I used a database-driven approach instead of in-memory timers so expiration continues working even after server restarts.

---

## 🔒 Concurrency Handling

To prevent multiple users from reserving the same last item, I used two safeguards:

### 1. Serializable Transactions

Each reservation runs inside a PostgreSQL **Serializable transaction**, ensuring conflicting requests execute safely.

### 2. Atomic Stock Update

Stock is reduced only if inventory still exists, preventing race conditions.

### Retry Logic

If PostgreSQL detects a conflict, the reservation automatically retries before failing.

### Result

✅ No overselling
✅ One reservation per stock unit
✅ Automatic stock recovery
✅ Real-time inventory consistency

---

## 🌐 Deployment

* Frontend — Vercel - link : sneaker-drop-main.vercel.app
* Backend — Vercel - link : sneaker-drop-main-server.vercel.app
* Database — Neon
