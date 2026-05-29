<div align="center">

# kongkow.
### Radar Wisata Lokal Berbasis AI dan AstraPay
**Anti Wacana. Pro Aksi.**

*Dibuat untuk AstraPay Hackathon 2026*

</div>

---

Kongkow adalah aplikasi wisata lokal berbasis lokasi dan AI yang mengubah niat jalan-jalan menjadi aksi nyata. Pengguna cukup menjawab empat pertanyaan singkat tentang mood, waktu, radius, dan budget — lalu AI langsung merekomendasikan tiga destinasi kontekstual lengkap dengan pembayaran terintegrasi via AstraPay.

## Fitur Utama

**Deteksi Lokasi Otomatis** menggunakan GPS browser dengan reverse geocoding via Nominatim OpenStreetMap, menghasilkan nama jalan, kelurahan, kecamatan, dan kota secara akurat dalam Bahasa Indonesia. Pengguna juga bisa memasukkan lokasi secara manual jika GPS tidak tersedia.

**Mood Picker 14 Kategori** mencakup seluruh spektrum keinginan orang saat senggang, mulai dari lapar, konten foto, santai rebahan, alam dan udara segar, belanja, budaya, bawa keluarga, kencan, aktivitas, malam hari, healing, spontan nekat, kerja dari kafe, hingga "Surprise me biar AI yang pilih". Setiap kategori memiliki sub-preferensi yang membuat rekomendasi semakin personal.

**Rekomendasi AI via Gemini** memproses input lokasi, mood, preferensi, waktu, radius, dan budget, lalu menghasilkan tiga destinasi nyata yang kontekstual. Setiap destinasi dilengkapi nama tempat, area, jarak tempuh, durasi kunjungan, estimasi harga, deskripsi personal, dan satu tip lokal eksklusif.

**Pembayaran AstraPay Terintegrasi** menyediakan dua jalur: tombol Bayar AstraPay yang membuka deeplink `astrapay://pay` dengan parameter merchant, amount, dan referensi unik, serta tombol Scan QR dengan animasi scanner untuk pembayaran langsung di kasir.

**Boarding Pass Kongkow** menghasilkan tiket wisata kelompok berformat gambar PNG yang dapat diunduh dan dibagikan langsung ke WhatsApp, Instagram, atau platform lainnya. Tiket berisi detail destinasi, budget, lokasi, dan branding AstraPay, dirancang untuk mendorong ajakan nongkrong yang tidak sekadar wacana.

**Typing Carousel** menampilkan animasi prompt wisata secara bergantian di halaman utama agar pengguna langsung memahami nilai aplikasi sejak detik pertama.

**Receipt Digital** mencatat seluruh detail transaksi termasuk nama destinasi, jumlah bayar, metode dompet, referensi ID, dan timestamp, setelah setiap pembayaran berhasil disimulasikan.

## Struktur Proyek

```
src/
├── App.tsx                  # Komponen utama, seluruh alur screen dan state
├── main.tsx                 # Entry point React
├── types.ts                 # TypeScript types: UserInput, Destination, RecommendResponse
├── constants.ts             # CATS, OTHER_STEPS, NEXT_LABELS, HUMOROUS_LOADER_TEXTS
├── index.css                # Global styles termasuk animasi QR scan dan slideUp
└── components/
    ├── ShareModal.tsx        # Canvas boarding pass, share WA, download PNG
    ├── TypingCarousel.tsx    # Animasi typewriter prompt wisata
    └── AstraPayLogo.tsx      # Logo AstraPay SVG untuk canvas rendering
```

## Alur Aplikasi

```
Buka App
   │
   ├─ Deteksi GPS (Nominatim reverse geocoding)
   │   └─ Fallback: input manual lokasi
   │
   ├─ Step 1: Pilih mood & sub-preferensi (14 kategori)
   ├─ Step 2: Pilih durasi waktu
   ├─ Step 3: Pilih radius eksplorasi
   └─ Step 4: Pilih budget
          │
          ▼
   Gemini API → JSON 3 destinasi
          │
          ▼
   Halaman Hasil
   ├─ Tombol Bayar AstraPay (deeplink)
   ├─ Tombol Scan QR (modal simulator)
   └─ Tombol Bagikan Boarding Pass
          │
          ▼
   Receipt Transaksi
   ├─ Kembali ke Hasil
   └─ Cari Destinasi Lagi
```

## Menjalankan Secara Lokal

**Prasyarat:** Node.js versi 18 atau lebih baru

```bash
# Install dependensi
npm install

# Salin file environment
cp .env.local.example .env.local
```

Isi `GEMINI_API_KEY` di file `.env.local` dengan API key dari [Google AI Studio](https://aistudio.google.com/apikey):

```
GEMINI_API_KEY=your_api_key_here
```

```bash
# Jalankan development server
npm run dev
```

Buka `http://localhost:5173` di browser.

## Dependensi Utama

| Paket | Kegunaan |
|---|---|
| `react` + `react-dom` | Framework UI |
| `@google/generative-ai` | Gemini AI untuk rekomendasi destinasi |
| `motion` (Motion React) | Animasi transisi antar screen |
| `lucide-react` | Ikon antarmuka |
| `qrcode` | Generate QR code dinamis pada boarding pass canvas |
| `tailwindcss` | Utility-first CSS styling |

## Konfigurasi AI

Model yang digunakan adalah `gemini-1.5-flash` untuk kecepatan respons optimal. System prompt dirancang agar output selalu berupa JSON valid tanpa teks tambahan, dengan format:

```json
{
  "headline": "...",
  "sub": "...",
  "destinations": [
    {
      "name": "Nama tempat nyata",
      "area": "Kelurahan / Kawasan",
      "emoji": "🍜",
      "distance": "10 menit",
      "duration": "45–60 mnt",
      "price_range": "Rp 30–70rb",
      "price_num": 45000,
      "can_pay": true,
      "desc": "Deskripsi personal 2 kalimat.",
      "tip": "Satu tip lokal eksklusif.",
      "tags": ["kuliner", "casual"],
      "mood_match": ["Lapar / haus"]
    }
  ]
}
```

## Catatan GPS di Lingkungan Preview

Jika aplikasi dijalankan di dalam iframe (seperti preview AI Studio), izin GPS mungkin diblokir oleh kebijakan keamanan browser. Solusinya adalah membuka aplikasi di tab baru agar browser dapat meminta izin GPS secara normal, atau menggunakan opsi "Tempat Lain" untuk memasukkan lokasi secara manual.

---

*Kongkow — didukung oleh AstraPay · AstraPay Hackathon 2026*
