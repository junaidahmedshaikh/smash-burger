# 🍔 SMASH'D Craft Burger Co. — Premium E-Commerce Platform

A production-ready, ultra-premium gourmet burger e-commerce platform inspired by the visual ambition, storytelling, motion design, and interaction quality of **CRAV Burgers**.

---

## 🌟 Key Highlights & Experience

* **Editorial Brutalist & Gourmet Aesthetic:** Smoked obsidian (`#09090B`) and fiery paprika red (`#E6392E`) aesthetic with ultra-crisp typography (Syne & Plus Jakarta Sans).
* **Cinematic Loading Sequence:** Fast preloader with animated progress counter (0% → 100%) and flickering brand flame.
* **Continuous Kinetic Marquees:** Smooth scrolling dual-direction typographic strips.
* **Interactive Exploding Burger Anatomy:** Scroll-triggered layered burger assembly animation with an interactive ingredient inspector.
* **Live Product Customizer:** Dynamic modifier matrix (Patty count, Wisconsin smoked cheese, artisanal buns, gourmet bacon & balsamic onions) with real-time price updates.
* **Full Cart & Promo Engine:** Persistent cart drawer with free delivery progress meter and coupon validation (`FIRSTBITE20`, `SMASHD100`).
* **Multi-Step Checkout:** Address validation, customer details, instructions, and payment provider adapter (Razorpay & instant card mock).
* **Real-Time Live Order Tracker:** Visual stage stepper (`Received` → `Preparing` → `Iron Grilling 450°F` → `Packed Ready` → `Out for Delivery` → `Delivered`) with auto-polling.
* **Command Center Admin Portal:** Executive dashboard with today's revenue, order volumes, average order value, 7-day trend charts, product stock manager, and live kitchen dispatch line.

---

## 🏗️ Monorepo Architecture

```text
burger-king/
├── apps/
│   ├── web/                    # Next.js 15 App Router Frontend (React 19, Tailwind, Lenis, Framer Motion)
│   └── api/                    # Express.js + Mongoose TypeScript Backend (Clean Service-Controller Architecture)
├── packages/
│   ├── types/                  # Shared TypeScript Interfaces (@smashd/types)
│   ├── validation/             # Shared Zod Schemas (@smashd/validation)
│   └── config/                 # Shared base TSConfig & tooling configs
├── package.json                # Root NPM Workspaces configuration
└── README.md
```

---

## 🚀 Quick Start & Development

### 1. Prerequisites
* Node.js v20+
* MongoDB running locally (or a MongoDB Atlas URI in `apps/api/.env`)

### 2. Install Dependencies & Build Packages
```bash
npm install
npm run build
```

### 3. Seed Gourmet Menu & Demo Accounts
```bash
npm run seed
```

This seeds:
* 10+ gourmet smashed burgers, buttermilk crispy chicken, loaded truffle fries, and handspun gelato shakes
* Customization matrices for patties, cheeses, buns, and toppings
* Active promo codes:
  * `FIRSTBITE20` — 20% off (min ₹399)
  * `SMASHD100` — ₹100 flat discount (min ₹499)
* Pre-configured evaluation accounts:
  * **Admin:** `admin@smashd.com` / `SmashdAdmin@2026`
  * **Customer:** `customer@gmail.com` / `Customer@2026`

### 4. Start Development Servers
```bash
npm run dev
```

* **Storefront Web App:** `http://localhost:3000`
* **Admin Dashboard:** `http://localhost:3000/admin`
* **Backend REST API:** `http://localhost:5000/api/v1`
* **API Health Check:** `http://localhost:5000/api/v1/health`

---

## 🛡️ Security & Reliability

* **Strict Server Pricing:** Client-submitted prices are never trusted. All subtotals, item modifiers, GST taxes (5%), and coupon limits are calculated server-side.
* **Authentication:** JWT Access Tokens paired with HTTP-Only Refresh Cookies and Role-Based Access Control (`customer`, `manager`, `admin`).
* **Security Headers:** Helmet, rate limiting, and CORS whitelist protection.
* **Type Safety:** 100% end-to-end TypeScript strict mode shared between frontend and backend.
