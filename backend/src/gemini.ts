import { GoogleGenAI, Type } from "@google/genai";

// ─── Gemini client (lazy singleton) ──────────────────────────────────────────

let aiClient: GoogleGenAI | null = null;

const PLACEHOLDER_KEYS = ["MY_GEMINI_API_KEY", "your_gemini_api_key_here", "YOUR_API_KEY", ""];

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const raw = process.env.GEMINI_API_KEY ?? "";
    const key = raw.replace(/^"|"$/g, "").trim(); // strip kutip jika ada di .env
    if (PLACEHOLDER_KEYS.includes(key)) {
      throw new Error(
        "GEMINI_API_KEY belum diisi.\n" +
        "  → Buka file .env di root project\n" +
        "  → Ganti MY_GEMINI_API_KEY dengan API key asli dari https://aistudio.google.com/apikey"
      );
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

// ─── Request payload type ─────────────────────────────────────────────────────

export interface RecommendPayload {
  lokasi?: string;
  mood?: string[];
  preferensi?: string[];
  waktu?: string;
  radius?: string;
  budget?: string;
  lokasi_detail?: string;
}

// ─── Helper: parse Gemini error jadi pesan singkat ───────────────────────────

export function parseGeminiError(err: unknown): string {
  if (err instanceof Error) {
    // Cek apakah message mengandung JSON error dari Gemini API
    const match = err.message.match(/"message"\s*:\s*"([^"]+)"/);
    if (match) return match[1];
    return err.message;
  }
  if (typeof err === "string") return err;
  return "Unknown error";
}

// ─── Core AI call ─────────────────────────────────────────────────────────────

export async function getRecommendations(body: RecommendPayload) {
  const {
    lokasi,
    mood,
    preferensi,
    waktu,
    radius,
    budget,
    lokasi_detail,
  } = body;

  const moodStr =
    Array.isArray(mood) && mood.length > 0 ? mood.join(", ") : "Wisata santai umum";
  const prefStr =
    Array.isArray(preferensi) && preferensi.length > 0
      ? preferensi.join(", ")
      : "Santai, fleksibel";
  const rangeWaktu  = waktu   || "fleksibel";
  const batasRadius = radius  || "fleksibel";
  const rangeBudget = budget  || "standar";

  let userLocation = lokasi || "Jakarta (umum)";
  if (
    lokasi_detail &&
    lokasi_detail !== "Lokasi diatur manual" &&
    lokasi_detail !== "Terdeteksi via GPS" &&
    lokasi_detail.trim()
  ) {
    userLocation = `${lokasi} (${lokasi_detail})`;
  }

  const client = getGeminiClient();

  const systemPrompt = `Kamu adalah Kongkow, asisten perjalanan wisata lokal berbasis lokasi untuk pengguna Indonesia.
Tugasmu: memberikan rekomendasi tempat yang personal, kontekstual, dan langsung bisa ditindaklanjuti.

IDENTITAS & TONE
- Bahasa Indonesia santai, pakai "kamu", boleh selipkan kata: nongki, pewe, mager, adem, hidden gem.
- Nada seperti teman lokal yang betul-betul tahu daerah itu — bukan guide turis kaku.
- Hindari frasa pengisi: "Tentunya!", "Tentu saja!", "Dengan senang hati!".

ATURAN DESTINASI
1. Nama tempat HARUS NYATA dan SPESIFIK. Dilarang fiktif.
2. Berikan TEPAT 6 destinasi.
3. venue_type — pilih satu:
   - "merchant"   : kafe, restoran, tenant ritel, bioskop — pelanggan bayar saat konsumsi/belanja
   - "attraction" : museum, kebun binatang, taman bermain, wahana, wisata alam berbayar — ada tiket masuk
   - "public"     : taman kota gratis, alun-alun, pantai umum, trotoar seni — tidak pungut biaya masuk
   - "street"     : kaki lima, gerobak, warung lesehan — mayoritas tunai
4. has_entrance_fee:
   - true HANYA untuk venue_type "attraction" yang benar-benar memungut tiket masuk.
   - false untuk public, merchant (bayar opsional saat beli), dan street.
5. entrance_fee_range: isi HANYA jika has_entrance_fee = true. Format "Rp 15.000 – 25.000".
   Kosongkan (null) jika tidak ada tiket masuk.
6. payment_methods: SPESIFIK sesuai kenyataan tempat tersebut, jangan pukul rata.
   Contoh benar: "Tunai", "QRIS & Tunai", "Kartu Debit/Kredit, QRIS & Tunai", "GoPay · OVO · QRIS"
   Contoh salah: "QRIS · Kartu Debit/Kredit · Transfer Bank" untuk warung kaki lima.
7. can_pay_digital: true jika menerima QRIS, GoPay, OVO, kartu debit/kredit, transfer. false jika tunai saja.
8. tip: bocoran info lokal praktis — bukan info umum. Contoh: "parkir di ruko seberang lebih murah".
9. desc: 2 kalimat, hubungkan mood & preferensi user dengan daya tarik spesifik tempat.

ATURAN JARAK & RADIUS
10. Radius yang dipilih user WAJIB dipatuhi ketat, KECUALI radius = "Bebas asal menarik" atau waktu senggang = "Seharian" — pada dua kondisi itu destinasi lebih jauh boleh direkomendasikan selama masih masuk akal (kota/kabupaten yang sama) dan benar-benar layak dikunjungi.
11. Selain dua pengecualian di atas, taati estimasi waktu tempuh berikut sesuai radius:
    - "Jalan kaki": maksimal ±15 menit jalan kaki dari titik lokasi.
    - "5-15 menit": maksimal 15 menit berkendara.
    - "15-30 menit": maksimal 30 menit berkendara.
12. Field distance HARUS jujur dan konsisten dengan radius di atas — jangan menulis "10 menit" untuk tempat yang sebenarnya jauh di luar radius.

ATURAN ANTI-HALU UNTUK MERCHANT & STREET FOOD (UMKM)
13. Untuk venue_type "merchant" dan "street" (warung, kaki lima, UMKM kecil), risiko mengarang nama jauh lebih tinggi dibanding tempat wisata besar yang sudah pasti nyata (museum, mal, taman kota) — jangan sampai menciptakan nama warung/pedagang yang terdengar meyakinkan tapi sebenarnya tidak eksis.
14. Prioritaskan tempat yang benar-benar dikenal luas: legendaris, viral, sering diliput food vlogger/media, atau punya banyak ulasan di Google Maps — bukan nama generik yang "kedengarannya otentik" (contoh yang DILARANG: "Warung Bu Siti", "Kedai Mas Budi", "Angkringan Pak Joko") tanpa dasar realita.
15. Kalau kamu TIDAK YAKIN ada satu warung/pedagang spesifik yang benar-benar eksis dengan nama itu di lokasi tersebut, lebih baik sebutkan sentra/kawasan kuliner nyata yang memang ada (contoh: "Kawasan Kuliner Sabang", "Deretan Warung Tenda Jl. Sabang", "Pasar Senggol Braga") ketimbang mengarang nama pedagang individual.
16. Jangan pernah membuat alamat detail, nomor telepon, atau jam buka yang tidak kamu yakini benar — cukup sebutkan kelurahan/kawasannya saja lewat field area.`;

  const isFreeRadius = batasRadius === "Bebas asal menarik";
  const isFullDay = rangeWaktu === "Seharian";
  const distanceRule = isFreeRadius || isFullDay
    ? `Radius: ${batasRadius} — user memilih ${[isFreeRadius && `radius "Bebas asal menarik"`, isFullDay && `waktu "Seharian"`].filter(Boolean).join(" dan ")}, jadi destinasi boleh lebih jauh dari radius normal selama masih di kota/kabupaten yang sama dan benar-benar layak dikunjungi.`
    : `Radius: ${batasRadius} — WAJIB dipatuhi ketat, jangan rekomendasikan tempat yang jauh di luar radius ini.`;

  const userPrompt = `Rekomendasikan TEPAT 6 tempat di "${userLocation}" dengan kriteria:
- Mood: [${moodStr}]
- Preferensi: [${prefStr}]
- Waktu senggang: ${rangeWaktu}
- ${distanceRule}
- Budget: ${rangeBudget}

Pastikan setiap destinasi akurat tipe venue_type-nya dan payment_methods-nya sesuai kondisi nyata tempat itu, serta jaraknya konsisten dengan radius di atas.`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: {
            type: Type.STRING,
            description: "Judul catchy ≤6 kata mewakili trip, vibe santai Indonesia.",
          },
          sub: {
            type: Type.STRING,
            description: "Satu kalimat sub-judul santai yang merangkum kurasi sesuai preferensi user.",
          },
          destinations: {
            type: Type.ARRAY,
            description: "Tepat 6 destinasi nyata.",
            items: {
              type: Type.OBJECT,
              properties: {
                name:  { type: Type.STRING, description: "Nama tempat nyata dan spesifik." },
                area:  { type: Type.STRING, description: "Kelurahan / kecamatan / kawasan (e.g. Menteng, Senopati, M Bloc)." },
                emoji: { type: Type.STRING, description: "1 emoji representatif tempat ini." },
                distance: { type: Type.STRING, description: "Estimasi waktu tempuh dari titik tengah lokasi (e.g. '10 menit')." },
                duration:  { type: Type.STRING, description: "Estimasi durasi kunjungan (e.g. '1-2 jam')." },
                price_range: { type: Type.STRING, description: "Rentang harga per orang (e.g. 'Rp 20-50rb' atau 'Gratis')." },
                price_num:   { type: Type.INTEGER, description: "Estimasi biaya per orang dalam rupiah; 0 jika gratis." },
                venue_type: {
                  type: Type.STRING,
                  description: "Tipe tempat: 'merchant' | 'attraction' | 'public' | 'street'.",
                },
                has_entrance_fee: {
                  type: Type.BOOLEAN,
                  description: "true hanya jika venue_type='attraction' dan ada tiket masuk berbayar.",
                },
                entrance_fee_range: {
                  type: Type.STRING,
                  description: "Range harga tiket masuk jika has_entrance_fee=true (e.g. 'Rp 15.000 – 30.000'). Kosongkan jika tidak ada.",
                },
                payment_methods: {
                  type: Type.STRING,
                  description: "Metode bayar SPESIFIK sesuai tempat. Jangan pukul rata.",
                },
                can_pay_digital: {
                  type: Type.BOOLEAN,
                  description: "true jika menerima QRIS / e-wallet / kartu digital. false jika tunai saja.",
                },
                desc: { type: Type.STRING, description: "2 kalimat personal mengaitkan mood & preferensi user dengan daya tarik tempat." },
                tip:  { type: Type.STRING, description: "1 tip rahasia lokal yang praktis dan tak terduga." },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2–3 tag pendek (e.g. ['kopi', 'retro', 'outdoor']).",
                },
                mood_match: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Subset mood user yang paling cocok dengan tempat ini.",
                },
              },
              required: [
                "name", "area", "emoji", "distance", "duration",
                "price_range", "price_num",
                "venue_type", "has_entrance_fee", "payment_methods", "can_pay_digital",
                "desc", "tip", "tags", "mood_match",
              ],
            },
          },
        },
        required: ["headline", "sub", "destinations"],
      },
    },
  });

  const resultText = response.text || "{}";
  const parsed = JSON.parse(resultText);

  if (Array.isArray(parsed.destinations) && parsed.destinations.length > 6) {
    parsed.destinations = parsed.destinations.slice(0, 6);
  }

  return { data: parsed, userLocation, rangeBudget };
}
