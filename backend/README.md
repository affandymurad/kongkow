# Kongkow — Backend (Express Dev Server)

Server Express ini dipakai **khusus untuk test lokal** tanpa perlu install Netlify CLI.

## Cara Pakai

### 1. Install dependencies backend
```bash
cd backend
npm install
```

### 2. Set environment variable
Di root project, pastikan file `.env` sudah ada:
```
GEMINI_API_KEY=your_key_here
```

### 3. Jalankan

**Opsi A — Keduanya sekaligus (dari root project):**
```bash
npm run dev:local
# Vite frontend: http://localhost:5173
# Express backend: http://localhost:3001
```

**Opsi B — Terpisah (dua terminal):**
```bash
# Terminal 1 — Frontend
npm run dev:frontend

# Terminal 2 — Backend
npm run dev:backend
```

**Opsi C — Netlify dev (butuh Netlify CLI):**
```bash
netlify dev
# Semua jalan di satu port, /api/* → netlify functions
```

## Endpoint

| Method | URL | Keterangan |
|--------|-----|------------|
| GET | `/api/health` | Cek status server & API key |
| POST | `/api/recommend` | Minta rekomendasi destinasi |

## Struktur
```
backend/
├── src/
│   └── gemini.ts      ← Shared AI logic (dipakai juga oleh netlify/functions/)
├── server.ts          ← Express entry point
├── package.json
└── tsconfig.json
```

Logic AI di `src/gemini.ts` diimpor oleh **dua** tempat:
- `backend/server.ts` → untuk dev lokal dengan Express
- `netlify/functions/recommend.ts` → untuk production di Netlify
