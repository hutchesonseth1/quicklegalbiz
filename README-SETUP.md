# Setup / Run

## Install
```bash
npm ci
```

## Env
Copy `.env.example` to `.env.local` and fill values:
- NEXTAUTH_SECRET, NEXTAUTH_URL
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## Dev
```bash
npm run dev
```

If you see module path errors for `@/...`, ensure `tsconfig.json` contains:
```json
"baseUrl": ".",
"paths": { "@/*": ["*"] }
```

## Production
```bash
npm run build && npm start
```
