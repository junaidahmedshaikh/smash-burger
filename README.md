<div align="center">

# Smash Burger

**Production-grade gourmet burger e-commerce platform & interactive 450°F builder.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-black?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

[Live Demo](https://smash-burger-web.vercel.app) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Deployment](#deployment)

</div>

---

## Overview

Smash Burger is an end-to-end full-stack e-commerce application designed for artisanal food ordering. It features an interactive SVG blueprint visualizer, a real-time burger customization lab, persistent cart and coupon engine, live order tracking, and an administrative dispatch dashboard.

---

## Features

- **Interactive Blueprint Hero**: Dynamic SVG vector telemetry HUD with 3D mouse parallax tracking.
- **450°F Burger Lab (`/customizer`)**: Real-time layer-by-layer burger builder with live calorie, temperature, and price calculation.
- **Gourmet Storefront (`/menu`)**: Category filtering, spice level indicators, and modifier selection.
- **Cart & Promo Engine**: Slide-over drawer with free shipping progress bar and server-validated coupons (`FIRSTBITE20`, `SMASHD100`).
- **Live Order Tracking (`/orders/[id]`)**: Stage stepper with auto-polling order status from kitchen sear to delivery.
- **Admin Command Center (`/admin`)**: Financial telemetry, revenue charts, live kitchen dispatch, and menu inventory controls.
- **Zero-Trust Security**: Server-enforced pricing, JWT authentication with HTTP-only cookies, and shared Zod validation.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Framer Motion, Lenis Scroll, Lucide Icons |
| **Backend** | Node.js, Express.js, Mongoose (MongoDB), TypeScript, JWT, Helmet |
| **Shared Packages** | `@smashd/types` (TypeScript interfaces), `@smashd/validation` (Zod schemas) |
| **Tooling** | NPM Workspaces, Concurrently, TSX |

---

## Architecture

```text
smash-burger/
├── apps/
│   ├── web/               # Next.js 15 App Router frontend
│   └── api/               # Express.js REST API
├── packages/
│   ├── types/             # Shared TypeScript models & interfaces
│   └── validation/        # Shared Zod validation schemas
└── package.json           # Root workspace configuration
```

---

## Getting Started

### Prerequisites

- Node.js `20.x` or later
- MongoDB instance (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/junaidahmedshaikh/smash-burger.git
cd smash-burger

# Install all dependencies
npm install

# Build shared workspace packages
npm run build:packages
```

### Environment Configuration

Create `.env` in `apps/api/`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smashd
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
CORS_ORIGIN=http://localhost:3000
```

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Seed & Run

```bash
# Seed initial menu, customizations, and demo accounts
npm run seed

# Start both frontend and backend concurrently
npm run dev
```

The applications will be accessible at:
- **Frontend**: `http://localhost:3000`
- **Admin Portal**: `http://localhost:3000/admin`
- **Backend API**: `http://localhost:5000/api/v1`

---

## Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@smashd.com` | `SmashdAdmin@2026` |
| **Customer** | `customer@gmail.com` | `Customer@2026` |

**Promo Codes**: `FIRSTBITE20` (20% off), `SMASHD100` (₹100 off).

---

## Deployment

### Vercel (Frontend)

1. Import the repository into Vercel.
2. In **Project Settings** > **General**, set **Root Directory** to `apps/web`.
3. Add `NEXT_PUBLIC_API_URL` to Environment Variables.
4. Deploy.

### Render / Railway (Backend API)

1. Deploy using repository root.
2. **Build Command**: `npm run build:api`
3. **Start Command**: `npm run start --workspace=@smashd/api`

---

## License

This project is licensed under the [MIT License](LICENSE).
