export interface UserInput {
  lokasi: string;
  mood: string[];
  preferensi: string[];
  waktu: string;
  radius: string;
  budget: string;
  lokasi_detail?: string;
}

/**
 * Tipe kategori tempat untuk menentukan logika info bayar:
 * - "merchant"   : kafe, restoran, tenant — bayar saat konsumsi
 * - "attraction" : tempat wisata, museum, taman berbayar — ada tiket masuk
 * - "public"     : taman kota, alun-alun, spot gratis — tidak perlu bayar
 * - "street"     : kaki lima, warung pinggir jalan — biasanya tunai
 */
export type VenueType = "merchant" | "attraction" | "public" | "street";

export interface Destination {
  name: string;
  area: string;
  emoji: string;
  distance: string;
  duration: string;

  // Harga & tipe bayar
  price_range: string;
  price_num: number;          // 0 = gratis
  venue_type: VenueType;      // tipe tempat (baru)

  // Tiket masuk — hanya relevan untuk venue_type === "attraction"
  has_entrance_fee: boolean;  // apakah ada tiket masuk? (baru)
  entrance_fee_range?: string; // e.g. "Rp 15.000 – 25.000" (baru)

  // Metode pembayaran yang diterima (baru: lebih spesifik per tipe)
  payment_methods: string;    // e.g. "Tunai", "QRIS", "Tunai & QRIS", "Kartu Debit/Kredit"
  can_pay_digital: boolean;   // true jika menerima QRIS / transfer / kartu (baru, ganti can_pay)

  desc: string;
  tip: string;
  tags: string[];
  mood_match: string[];

  /** @deprecated gunakan can_pay_digital */
  can_pay?: boolean;
}

export interface RecommendResponse {
  headline: string;
  sub: string;
  destinations: Destination[];
}
