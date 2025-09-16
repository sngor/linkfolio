# Linkfolio — Digital Business Card

A customizable, installable digital business card for networking. Share a QR, let people save your contact (vCard), and link to your socials. Works locally without auth; add AWS Cognito to enable sign-in and a protected dashboard for editing your card.

## Quickstart

Prereqs: Node.js 18+ and npm.

1. Install dependencies

```
npm install
```

2. Run dev server

```
npm run dev
```

You’ll see a URL in the terminal (often http://localhost:3000; if busy, it will use 3001). Open it to preview.

3. Optional: Customize defaults in `src/lib/profile.ts` (name, role, company, links)

## Scripts

- dev: Start Next.js dev server
- build: Production build
- start: Start production server
- lint: Lint with ESLint
- format: Format with Prettier
- test: Run unit tests (Vitest)

## Customization

- Profile defaults: `src/lib/profile.ts`
- Main card UI: `src/app/page.tsx` (glass card + animated gradient)
- Public page UI: `src/app/p/[id]/page.tsx`
- vCard endpoint: `src/app/api/vcard/route.ts`
- Theme: global CSS in `src/styles/globals.css` (glass/animations) and Tailwind palette in `tailwind.config.ts`
- Avatar (optional): add `public/avatar.jpg` and uncomment the `<img>` in `src/app/page.tsx`

### Public share and QR

- Public profile URL: `/p/<id>` (by default `<id>` is your email when signed in)
- The QR on the card points to your public URL
- vCard download: `/api/vcard?id=<id>` (falls back to default profile without `id`)

## PWA

Manifest at `public/manifest.json` and service worker via `next-pwa` (enabled in production). Replace placeholder icons in `public/icons/` with real PNGs.

Notes:

- PWA is disabled during `npm run dev` (expected)
- Theme color and app name can be updated in `public/manifest.json`

## Deployment

Works great on Vercel or AWS Amplify Hosting. After pushing, set `NEXT_PUBLIC_SITE_URL` if needed.

## Authentication and Dashboard

- Auth: AWS Cognito via AWS Amplify (`src/lib/amplifyClient.ts` + `src/components/AmplifyProvider.tsx`)
- Routes: `/login` to sign in, `/dashboard` to edit your card (protected by Amplify Authenticator)
- API: `/api/profile` (POST to init/get current user, PUT to save), `/api/profile/[id]` (public GET)
- Storage: File-based JSON at `data/profiles.json` (consider DynamoDB for production)

You can preview and use the public pages without Cognito. For personalized editing and per-user profiles, configure Cognito as below.

### Configure AWS Cognito

1. In AWS Cognito, create a User Pool and an App Client (public client with no secret).
2. Configure a Hosted UI domain for the user pool.
3. (Optional) Create an Identity Pool if you plan to use Federated Identities.
4. Create a `.env.local` in the project root with:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-xxxx_xxxxx
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-xxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN=your-domain.auth.us-region.amazoncognito.com

# Optional server-only variants used by jwt verifier (if different):
COGNITO_USER_POOL_ID=us-xxxx_xxxxx
COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

5. Restart the dev server, visit `/login` to sign in, then go to `/dashboard` to edit your card.

## API endpoints

- `POST /api/profile` → Init+get current user profile (requires Authorization: Bearer <id_token>)
- `PUT /api/profile` → Save current user profile (requires Authorization)
- `GET /api/profile/[id]` → Public profile by id
- `GET /api/vcard?id=<id>` → vCard download for profile id (falls back to default if missing)

## Build, lint, and test

```
npm run lint
npm run test
npm run build
```

Troubleshooting:

- If port 3000 is in use, dev will start at 3001 (shown in terminal)
- PWA disabled in dev by design; it activates on production builds
- Using Next.js App Router typed routes—avoid passing invalid handler signatures in API routes/pages

## Authentication and Dashboard

- Auth: AWS Cognito via AWS Amplify (`src/lib/amplifyClient.ts` + `src/components/AmplifyProvider.tsx`)
- Routes: `/login` to sign in, `/dashboard` to edit your card (protected by Amplify Authenticator)
- API: `/api/profile` (POST to init/get current user, PUT to save), `/api/profile/[id]` (public GET)
- Storage: File-based JSON at `data/profiles.json` (use DynamoDB or RDS for production)

Environment variables:

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COGNITO_USER_POOL_ID=us-xxxx_xxxxx
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-xxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_COGNITO_OAUTH_DOMAIN=your-domain.auth.us-region.amazoncognito.com

# Optional server-only variants used by jwt verifier (if different):
COGNITO_USER_POOL_ID=us-xxxx_xxxxx
COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```
