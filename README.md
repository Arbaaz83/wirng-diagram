# Arbaaz's Diagram

A workshop web app for **wiring diagrams**, **workshop manuals** and **VIN lookup** — inspired by the SUPERETKA / ELSA reference concept (color-coded electrics + repair manuals + VIN-based data for the automotive workshop).

## Features

- **Hero + VIN / vehicle search** — enter a VIN or vehicle name to jump into the library.
- **Wiring diagrams** — SVG-rendered, color-coded schematics (battery/ground, ECU, sensors, modules) with click-to-inspect components and pin-level wire highlighting.
- **Workshop manuals** — step-by-step procedures with torque specs, tools and difficulty ratings.
- **Vehicle library** — per-vehicle diagrams and procedures.
- **Full-text search** — across diagrams, wires, components and procedures.

## Subscription content access

All diagrams, workshop manuals and the TPI diagnostic database are **subscriber-only**:

- **Locked** (`🔒 Subscriber content`) when no active subscription — with CTA to `#/pricing`.
- **Unlocked** when subscription status is `active` (set via Google Pay / demo mode).

- **TPI** (`#/tpi`) — fault-code database (`TPI_DB`: P0300, P0171, P0400, P0455, P0087 …) with diagnostic protocols.

- **Account** (`#/account`) — subscription status, plan, renews date.

## Tech

Plain HTML + CSS + vanilla JS (no build step). Run by opening `index.html` in a browser, or serve the folder over HTTP.

## Content

Demo/illustrative content for a few workshop vehicles (Golf Mk5, A4 B5, A3 8P, Octavia Mk3).

## Google Pay subscription (published with paid plans)

- Pricing page: `#/pricing` — renders a Google Pay PayButton per plan.
- Order creation: `POST /api/create-google-pay-order` → `{ plan: "monthly" | "yearly" }` → returns `{ id, clientSecret, amount, plan }` (Google Pay payment order via `payments.googleapis.com/v1/paymentOrders`).
- Payment verification: `POST /api/verify-payment` → `{ orderId, clientSecret, paymentData }` → returns `{ active, orderId }` (confirms the order with Google Pay `paymentOrders/<id>:confirm`).

Required environment variables (e.g. on Vercel):

```
GOOGLE_PAY_API_KEY=...
GOOGLE_PAY_MERCHANT_ID=...
GOOGLE_PAY_CLIENT_ID=...        # Google Pay client ID used in the frontend PayButton
APP_URL=https://yourdomain.com
```

Plans: Monthly $10 / Yearly $50 (mirrors the reference product).

## Deploy (Vercel)

The repo is ready for Vercel deployment with the Google Pay API functions:

1. Push to GitHub.
2. Import into Vercel → framework preset: **Other** / zero-config static.
3. Add env vars: `GOOGLE_PAY_API_KEY`, `GOOGLE_PAY_MERCHANT_ID`, `GOOGLE_PAY_CLIENT_ID`, `APP_URL`.
4. Deploy → register a Google Pay merchant in the Google Pay Business Console and obtain `GOOGLE_PAY_MERCHANT_ID` / `GOOGLE_PAY_CLIENT_ID` / `GOOGLE_PAY_API_KEY`.
5. Set `GOOGLE_PAY_API_BASE` in `app.js` to the deployed API origin (empty string = same-origin on Vercel).

## Local preview server

Any static file server works, e.g.:

```bash
npx serve .
# or
python -m http.server 8099
```

then open http://localhost:8099/index.html
