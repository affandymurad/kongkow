# kongkow.

Jawab empat pertanyaan, dapat enam tempat nongkrong di sekitarmu. Rekomendasi dibuat oleh Gemini, dengan info jarak, durasi, harga, dan metode bayar (termasuk QRIS) per tempat.

## Cara kerja

1. Lokasi dideteksi lewat GPS browser (reverse geocoding via Nominatim), atau diketik manual.
2. Pilih suasana, waktu, jarak, dan budget.
3. Backend memanggil Gemini dan mengembalikan enam tempat.
4. Dari hasil, kamu bisa membuka rute di Google Maps atau membagikan daftar ke grup (teks WhatsApp dan gambar PNG).

## Struktur

```
src/
├── App.tsx            alur layar dan state
├── constants.ts       kategori, pilihan langkah, teks loading
├── types.ts           tipe Destination dan UserInput
├── hooks/             useGeolocation
└── components/        Header, LocationCard, StepWizard,
                       LoadingScreen, ResultsScreen, ShareModal
backend/               server Express untuk dev lokal + logika Gemini
netlify/functions/     endpoint /api/recommend untuk produksi
```

## Menjalankan lokal

Butuh Node.js 18+ dan API key dari [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm install
npm --prefix backend install
cp .env.example .env     # isi GEMINI_API_KEY
npm run dev
```

Buka http://localhost:5173. Vite (5173) meneruskan `/api/*` ke Express (3001). Cek backend: http://localhost:3001/api/health

Opsi lain: `npm run dev:netlify` (butuh Netlify CLI), atau `npm run lint` untuk typecheck.

## Catatan

- Izin lokasi hanya diberikan browser di `localhost` atau HTTPS. Kalau ditolak, pakai “Tempat lain”.
- Nama tempat berasal dari model dan bisa keliru, terutama warung kecil. Cek di Maps sebelum berangkat.
