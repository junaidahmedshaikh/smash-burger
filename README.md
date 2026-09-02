<div align="center">

# 🍔 SMASH BURGER
### *Unapologetic Flavor. Smashed Fresh at 450°F.*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.3-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.10.1-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

<br />

A production-grade, editorial gourmet burger e-commerce ecosystem inspired by the design precision of high-end culinary visualizers and the brutalist energy of street food culture.

[Explore Features](#-signature-features) • [Quick Start](#-quick-start) • [Architecture](#-monorepo-architecture) • [Demo Accounts](#-demo-accounts--promo-codes) • [Deployment](#-production-deployment)

---

</div>

<br />

## 🌟 The Experience

Smash Burger is built around the culinary philosophy of the **Maillard Reaction** — searing freshly ground, 100% prime Angus chuck against a screaming **450°F cast-iron flat top** within 12 seconds to lock in caramelized savory crusts and molten cheddar richness.

Every pixel, motion transition, and telemetry indicator on the frontend reflects this craft.

---

## 🎯 Signature Features

### 📐 1. Precision Blueprint Radar Hero
* **Live Vector Telemetry**: Dynamic SVG connector lines with animated photon pulses link technical specification cards directly to suspended burger layers (*Brioche Crown, Crisp Onions & Pickles, Vine Tomatoes, Fire-Seared Angus Patty, Greens & Heel*).
* **3D Mouse Gyro Parallax**: Spring-physics parallax tracking tilts the high-resolution burger assembly in real-time response to desktop cursor movement.
* **Interactive Layer Spotlight**: Hovering over any specification card triggers an animated gold radar ping that pinpoints the exact ingredient.

### 🧪 2. 450°F Burger Lab Customizer (`/customizer`)
* **Real-Time Telemetry Matrix**: Live monitors track sear temperature (450°F), projected calorie count, and dynamic pricing as you construct your burger.
* **Granular Component Selection**:
  * **Artisan Buns**: Toasted Sesame Brioche, Potato Roll, Black Garlic Charcoal, or Crisp Lettuce Wrap.
  * **Smashed Angus Patties**: Single, Double, Triple, or Quadruple 450°F seared patties.
  * **Molten Cheeses**: Sharp Wisconsin Cheddar, Smoked Gouda, Pepper Jack, or Blue Cheese Crumble.
  * **Crunch & Pickles**: Crinkle-cut dill pickles, sweet white onion rings, charred jalapeños, crispy smoked bacon.
  * **Scratch Sauces**: Smashed Secret Sauce, Smoked Truffle Mayo, Ghost Pepper Glaze.
* **Celebration Engine**: Instant cart staging with full-screen confetti bursts upon burger finalization.

### 📜 3. Editorial Gourmet Menu & Storefront (`/menu`)
* **Category Filtering**: Seamless switching between Smashed Burgers, Crispy Buttermilk Chicken, Loaded Truffle Fries, Drinks & Handspun Shakes.
* **Chef Spice Telemetry**: Visual indicator tags for spice levels from `0 (Sweet / None)` to `3 (Fiery Ghost Reaper)`.
* **Instant Modifier Modal**: Tailor individual items with add-ons, patty counts, and special cooking instructions.

### 🛒 4. Frictionless Cart & Smart Promo Engine
* **Slide-Over Cart Drawer**: Real-time free delivery threshold progress bar (Free shipping unlocked at ₹499).
* **Coupon Validation Engine**: Instant discount verification (`FIRSTBITE20` for 20% off, `SMASHD100` for flat ₹100 discount).
* **Zero-Trust Server Pricing**: All calculations, tax subtotals (5% GST), and discount deductions are strictly verified on the backend.

### 📍 5. Real-Time Live Order Tracker (`/orders/[id]`)
* **Visual Stage Stepper**:
  `Order Received` ➔ `Kitchen Prep` ➔ `450°F Cast-Iron Sear` ➔ `Quality Packed` ➔ `Out for Delivery` ➔ `Delivered`
* **Real-Time Polling**: Automatic background status refreshing with estimated arrival timer and rider contact details.

### ⚡ 6. Command Center Admin Dashboard (`/admin`)
* **Executive Metrics**: Today's Gross Revenue, Total Order Volumes, Average Order Value (AOV), and Active Customers.
* **7-Day Revenue Trends**: Interactive chart analytics for financial performance tracking.
* **Live Kitchen Dispatch Line**: Kitchen managers can advance order statuses in real-time (`preparing` ➔ `cooking` ➔ `ready` ➔ `dispatched`).
* **Menu Stock Switcher**: One-click toggles to mark products as featured or out of stock.

---

## 🏗️ Monorepo Architecture

The codebase is engineered as a clean, decoupled **NPM Workspaces monorepo**:

```text
smash-burger/
├── apps/
│   ├── web/                    # Next.js 15 App Router Frontend
│   │   ├── src/
│   │   │   ├── app/            # App Router (Home, Menu, Customizer, Checkout, Admin, Orders)
│   │   │   ├── components/     # BlueprintBurgerHero, CartDrawer, Nav, UI Library
│   │   │   ├── context/        # CartContext, AuthContext, ToastProvider
│   │   │   └── lib/            # API client, animation helpers, currency formatters
│   │   └── public/             # Optimized burger photography and vector assets
│   │
│   └── api/                    # Node.js + Express + Mongoose Backend
│       ├── src/
│       │   ├── controllers/    # Auth, Product, Order, Coupon, Analytics controllers
│       │   ├── models/         # Mongoose schemas (User, Product, Order, Coupon, StoreSettings)
│       │   ├── routes/         # Versioned REST endpoints (/api/v1/...)
│       │   ├── services/       # Core business logic & database transactions
│       │   └── scripts/        # Database seeders (seed.ts)
│       └── tsconfig.json       # NodeNext strict TypeScript configuration
│
├── packages/
│   ├── types/                  # Shared TypeScript Interfaces (@smashd/types)
│   │   └── src/index.ts        # IUser, IProduct, IOrder, ICoupon, ICustomizationOption
│   │
│   └── validation/             # Shared Zod Validation Schemas (@smashd/validation)
│       └── src/index.ts        # LoginSchema, CreateOrderSchema, ProductFilterSchema
│
├── package.json                # Root workspaces orchestration
└── README.md
```

---

## 🎨 Design System & Visual Identity

| Token | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Obsidian** | `#09090B` | Deep background canvas and cinematic contrast |
| **Dark Surface** | `#141417` | Elevated cards, navigation header, and interactive modals |
| **Paprika Red** | `#E6392E` | Primary call-to-actions, brand accents, and active status states |
| **Searing Gold** | `#FFA700` | 450°F temperature badges, telemetry pinpoints, and glowing highlights |
| **Brioche Cream**| `#FFF8F0` | High-contrast editorial typography and hero headlines |

* **Typography**: Clean display font headers paired with high-legibility geometric body text.
* **Smooth Physics**: Hardware-accelerated smooth scrolling powered by **Lenis** with silky UI choreographies by **Framer Motion**.

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js**: v20.x or higher
* **NPM**: v10.x or higher
* **MongoDB**: A running local instance (`mongodb://localhost:27017/smashd`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

### 2. Clone and Install
```bash
git clone https://github.com/junaidahmedshaikh/smash-burger.git
cd smash-burger
npm install
```

### 3. Configure Environment Variables

**Backend (`apps/api/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smashd
JWT_SECRET=super_secret_smash_jwt_key_2026_dev
JWT_REFRESH_SECRET=super_secret_smash_refresh_key_2026_dev
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`apps/web/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 4. Seed Database
Seed the database with gourmet burgers, sides, drinks, promo codes, and demo accounts:
```bash
npm run seed
```

### 5. Launch Development
Start both the frontend and backend concurrently with one command:
```bash
npm run dev
```

| Application | URL | Description |
| :--- | :--- | :--- |
| **Storefront Web App** | `http://localhost:3000` | Full consumer storefront & 450°F Burger Lab |
| **Admin Dashboard** | `http://localhost:3000/admin` | Live kitchen dispatch & analytics console |
| **Backend REST API** | `http://localhost:5000/api/v1` | Express API endpoints |
| **API Health Check** | `http://localhost:5000/api/v1/health`| Health and database connection monitor |

---

## 🔑 Demo Accounts & Promo Codes

### Pre-configured Login Accounts
| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin / Manager** | `admin@smashd.com` | `SmashdAdmin@2026` | Full administrative control, kitchen dispatch, analytics |
| **Customer** | `customer@gmail.com` | `Customer@2026` | Standard customer browsing, cart, checkout, tracking |

### Active Promo Codes
* **`FIRSTBITE20`** — **20% OFF** entire order (minimum subtotal: ₹399).
* **`SMASHD100`** — **₹100 FLAT DISCOUNT** (minimum subtotal: ₹499).

---

## 📦 Production Deployment

### 🌐 Frontend (Vercel)
1. Import your repository into [Vercel](https://vercel.com).
2. Set **Root Directory** to:
   ```text
   apps/web
   ```
3. Add Environment Variable:
   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
   ```
4. Click **Deploy**. Vercel will automatically build shared workspace packages and compile Next.js 15.

### ⚙️ Backend API (Railway / Render / Fly.io / VPS)
1. Deploy the backend from the root or `apps/api`.
2. **Build Command**:
   ```bash
   npm run build:api
   ```
3. **Start Command**:
   ```bash
   npm run start --workspace=@smashd/api
   ```
4. Set production environment variables (`MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`).

---

## 🛡️ Engineering & Security Standards

* **Maillard Zero-Trust Pricing**: Client-side totals are treated purely as UI previews. All product base rates, customization deltas, coupon validity, and GST taxes are verified cryptographically and calculated server-side.
* **Dual-Token Authentication**: Ephemeral 15-minute JWT access tokens paired with rotation-enabled HTTP-Only `SameSite` refresh cookies.
* **Unified Strict Validation**: Zod schemas shared directly between client forms (`react-hook-form`) and Express route middleware.
* **Defensive Middleware**: Comprehensive protection using `helmet`, rate limiting, and origin whitelisting.

---

<div align="center">

Crafted with dedication to culinary science and software craft.

**Smash Burger © 2026** • *Smashed Hot. Built Fast.*

</div>
