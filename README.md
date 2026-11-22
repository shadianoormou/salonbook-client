# SalonBook — Client

A responsive salon appointment booking platform for Assignment 9, Category 002. Customers discover hair, beauty, and wellness services, request appointments, and pay after administrator confirmation. Administrators manage their salon through a separate dashboard.

## Project links

- Client: https://github.com/shadianoormou/salonbook-client
- Server: https://github.com/shadianoormou/salonbook-server
- Live website: https://salonbook-client-nu.vercel.app
- Live API: https://salonbook-server-beryl.vercel.app

## Features

- Original responsive salon interface, mobile navigation, reusable components, and accessible dialogs.
- Database-backed featured services and category discovery.
- Public service search, category filters, price sorting, and pagination.
- Better Auth credential registration and Google OAuth integration.
- Private service details, live slot availability, and appointment requests.
- Customer dashboard, appointment details, pending cancellation, and payment history.
- Admin service CRUD, file uploads, activation controls, appointment decisions, and customer blocking.
- Stripe Checkout, cancellation page, and webhook-confirmed payment status.
- Profile editing, image upload or image URL, and clear loading/error/empty states.

## Technology

Next.js App Router, React, TypeScript, Better Auth, Lucide, Sonner, and responsive CSS. The separate API uses Express, MongoDB, ImgBB, and Stripe.

## Local installation

Use Node.js 24 and pnpm 11. Install pnpm first if needed.

```sh
git clone https://github.com/shadianoormou/salonbook-client.git
cd salonbook-client
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Start the API using the server README, then open the Local URL printed by Next.js. The client proxies `/api/*` to Express, so authentication uses same-origin browser cookies. Keep the browser hostname consistent during testing.

## Environment variables

Required names, configured locally or in the hosting dashboard:

- `API_URL`: Express server origin; selected when building the API proxy.
- `NEXT_PUBLIC_APP_URL`: public application origin.

Never put database credentials, Better Auth secrets, Stripe secrets, Google OAuth secrets, or ImgBB keys in the client.

## Validation

```sh
pnpm typecheck
pnpm build
pnpm start
```

The server contains integration tests covering roles, ownership, booking conflicts, blocked users, and signed Stripe webhooks.

## Deploy

Import this repository into Vercel as Next.js. Configure the environment values before building. Set the API's client and Better Auth origins to the exact frontend origin. Configure Google's callback at that origin plus `/api/auth/callback/google`.

Do not use static export or GitHub Pages: the application needs its Next.js server and proxy. Verify private-route refresh, authentication, both roles, image uploads, and Stripe test-mode Checkout on the live deployment. Payment return pages never mark appointments paid; they wait for a verified webhook.

## Verification status

TypeScript and the optimized production build passed. Browser checks covered registration, role redirect, persistent sessions, service search, appointment request, admin confirmation, and mobile navigation. Production checks also passed for Google sign-in, administrator email sign-in, database-backed services, customer booking, administrator confirmation, session refresh, JWT access, ImgBB image delivery, Stripe test Checkout, and webhook-confirmed payment status. Google OAuth is published for basic profile/email access. Stripe test credentials remain private in Vercel.

Salon contact information and social destinations are demonstration details. Service photographs are served from Unsplash. Replace them with the salon's actual details before a business launch.
