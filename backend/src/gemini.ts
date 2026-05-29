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
   Contoh salah: "AstraPay · QRIS · Transfer · Kartu" untuk warung kaki lima.
7. can_pay_digital: true jika menerima QRIS, GoPay, OVO, kartu debit/kredit, transfer. false jika tunai saja.
8. tip: bocoran info lokal praktis — bukan info umum. Contoh: "parkir di ruko seberang lebih murah".
9. desc: 2 kalimat, hubungkan mood & preferensi user dengan daya tarik spesifik tempat.`;

  const userPrompt = `Rekomendasikan TEPAT 6 tempat di "${userLocation}" dengan kriteria:
- Mood: [${moodStr}]
- Preferensi: [${prefStr}]
- Waktu senggang: ${rangeWaktu}
- Radius: ${batasRadius}
- Budget: ${rangeBudget}

Pastikan setiap destinasi akurat tipe venue_type-nya dan payment_methods-nya sesuai kondisi nyata tempat itu.`;

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
