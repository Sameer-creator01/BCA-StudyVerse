# BCA StudyVerse 3.1 — Android PWA + Learning Academy

This is an upgraded version of the supplied StudyVerse project. Existing React learning content and RPG/quiz experiences are retained.

## Included in this revision
- Vite + React + TypeScript project configuration.
- Tailwind CSS entry and PostCSS configuration.
- Android PWA manifest, app icons, service worker, install prompt handling in the app.
- Service worker does not cache cross-origin API/AI responses; navigation has an offline fallback.
- PDF text extraction uses PDF.js (scanned/image-only PDFs still require OCR and will report an extraction error rather than pretending to parse them).
- AI provider selector supports Gemini and OpenAI through a server-side proxy request. `api/ai-teacher.ts` is a Vercel serverless example.
- Direct Gemini sandbox key is excluded from local persistence and backup exports. Prefer the server proxy.
- Supabase SQL uses authenticated per-user UUID ownership and restrictive RLS. Cloud sync requires a real Supabase Auth session/JWT; the current legacy email-only REST sync UI is not a completed authenticated sync implementation.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## AI proxy (Vercel)
Set server-side environment variables from `.env.example` in the hosting provider. Do not use `VITE_` prefixes and do not commit real keys. Configure the app's AI Proxy Endpoint URL to `/api/ai-teacher` on the deployed origin. The provider dropdown selects Gemini or OpenAI.

## Supabase
Run `supabase/schema.sql` in the Supabase SQL editor. This schema intentionally requires Supabase Auth and denies anonymous access. The supplied frontend's legacy cloud sync is not yet wired to Supabase Auth; do not expect cloud sync to work until an authenticated session and user-scoped upsert are added.

## Deploy and install on Android
Deploy the production `dist/` directory to an HTTPS host (Vercel, Netlify, Cloudflare Pages, etc.). Open the HTTPS URL in Chrome on Android and use the in-app install action or Chrome menu > Install app / Add to Home screen. Service workers require HTTPS, except on localhost.

## Important limitations
- I could not run `npm install` or `npm run build` in this environment because npm registry DNS/network access failed (`EAI_AGAIN`). Build status is therefore **not verified**.
- PDF.js extracts selectable text; image-only scans need OCR.
- Live AI requires configured provider credentials on a server-side proxy and internet.
- Supabase schema security is corrected, but frontend Supabase Auth and cross-device sync are not complete.
- Local progress is browser/device storage. Export backups before clearing browser data or uninstalling the PWA.
