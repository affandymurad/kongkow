export interface Category {
  label: string;
  desc: string;
  subs: {
    label: string;
    chips: string[];
  }[];
}

export const CATS: Category[] = [
  {
    label: "Lapar / haus",
    desc: "Makan berat, jajan, minuman",
    subs: [
      {
        label: "makan apa",
        chips: ["Sarapan ringan", "Makan siang proper", "Cemilan doang", "Boba / minuman", "Dessert & kue", "Seafood", "Ayam & bebek", "Mi & bakso"]
      },
      {
        label: "suasana",
        chips: ["Warung lokal autentik", "Kafe aesthetic", "Restoran keluarga", "Street food pinggir jalan", "All you can eat", "Fine dining"]
      }
    ]
  },
  {
    label: "Konten / foto",
    desc: "Spot foto dan video",
    subs: [
      {
        label: "jenis konten",
        chips: ["Feed Instagram", "Reels / TikTok", "Foto couple", "Foto keluarga", "Foto solo aesthetic", "Street photography", "Sunset / golden hour"]
      },
      {
        label: "vibe tempat",
        chips: ["Vintage & retro", "Minimalis clean", "Alam & hijau", "Urban & industrial", "Colorful & playful", "Mural & street art"]
      }
    ]
  },
  {
    label: "Santai / rebahan",
    desc: "Duduk lama, tidak banyak gerak",
    subs: [
      {
        label: "cara santai",
        chips: ["Kafe sambil baca buku", "Nongkrong tanpa agenda", "Duduk depan pemandangan", "Working from cafe", "Hammock / tiduran", "Spa & relaksasi"]
      },
      {
        label: "level noise",
        chips: ["Sepi & tenang banget", "Sedikit background noise oke", "Rame juga gapapa"]
      }
    ]
  },
  {
    label: "Alam & udara segar",
    desc: "Taman, bukit, pantai, sawah",
    subs: [
      {
        label: "jenis alam",
        chips: ["Taman kota", "Hutan / kebun", "Pantai / sungai", "Sawah & perkebunan", "Gunung / bukit", "Danau / embung"]
      },
      {
        label: "aktivitas",
        chips: ["Jalan santai", "Hiking ringan", "Piknik", "Berenang", "Bersepeda", "Duduk-duduk doang"]
      }
    ]
  },
  {
    label: "Belanja / jajan",
    desc: "Oleh-oleh, thrift, jajan",
    subs: [
      {
        label: "mau beli apa",
        chips: ["Oleh-oleh & souvenir", "Fashion & baju", "Buku & stationery", "Tanaman & dekorasi", "Makanan premium", "Barang second / thrift"]
      },
      {
        label: "skala belanja",
        chips: ["Window shopping aja", "Ada budget terbatas", "Mau habisin gaji"]
      }
    ]
  },
  {
    label: "Budaya & sejarah",
    desc: "Museum, situs, pasar tradisional",
    subs: [
      {
        label: "destinasi",
        chips: ["Museum", "Candi & situs sejarah", "Galeri seni", "Pertunjukan seni", "Kampung adat", "Pasar tradisional"]
      }
    ]
  },
  {
    label: "Bawa anak / keluarga",
    desc: "Ramah anak, fasilitas lengkap",
    subs: [
      {
        label: "usia anak",
        chips: ["Bayi & balita (0-4 th)", "Anak kecil (5-10 th)", "Remaja (11-17 th)", "Mix semua umur"]
      },
      {
        label: "prioritas",
        chips: ["Ada area bermain", "Fasilitas lengkap", "Edukatif & interaktif", "Tiket terjangkau"]
      }
    ]
  },
  {
    label: "Kencan / couple",
    desc: "Berdua, dari santai sampai spesial",
    subs: [
      {
        label: "jenis kencan",
        chips: ["Kencan pertama (deg-degan)", "Kencan kasual santai", "Anniversary / special", "Spontan & dadakan", "Dinner romantis"]
      },
      {
        label: "vibe",
        chips: ["Private & intimate", "Ramai tapi seru", "Outdoor & adventurous", "Indoor & cozy"]
      }
    ]
  },
  {
    label: "Aktivitas & main",
    desc: "Olahraga ringan sampai escape room",
    subs: [
      {
        label: "jenis aktivitas",
        chips: ["Olahraga ringan", "Escape room", "Karaoke", "Bowling / billiard", "Arcade / game center", "Paint & craft", "Climbing wall"]
      },
      {
        label: "intensitas",
        chips: ["Santai, gak keringetan", "Sedikit gerak oke", "Mau capek beneran"]
      }
    ]
  },
  {
    label: "Malam hari",
    desc: "Setelah jam enam sore",
    subs: [
      {
        label: "vibes malam",
        chips: ["Rooftop & city view", "Night market / bazaar", "Bar & mocktail spot", "Jazz & live music", "Bioskop", "Stargazing"]
      }
    ]
  },
  {
    label: "Healing",
    desc: "Menyendiri dan menenangkan diri",
    subs: [
      {
        label: "jenis healing",
        chips: ["Sepi dari orang", "Spa & pijat", "Duduk dekat air", "Nulis jurnal di kafe", "Makan enak sendirian", "Jalan tanpa tujuan"]
      }
    ]
  },
  {
    label: "Spontan & nekat",
    desc: "Tempat yang jarang didatangi",
    subs: [
      {
        label: "level nekat",
        chips: ["Coba kuliner ekstrem", "Tempat jarang didatangi", "Naik angkot ke terminal akhir", "Masuk gang-gang kecil", "Cari warung paling tua", "Tempat namanya asing"]
      }
    ]
  },
  {
    label: "Kerja / belajar",
    desc: "WiFi, colokan, boleh duduk lama",
    subs: [
      {
        label: "kebutuhan",
        chips: ["WiFi kencang wajib", "Stop kontak banyak", "Gak berisik", "Boleh duduk lama", "Kopi enak", "Buka 24 jam"]
      }
    ]
  },
  {
    label: "Terserah",
    desc: "Serahkan pilihan ke Kongkow",
    subs: [
      {
        label: "satu-satunya syarat",
        chips: ["Asal seru", "Asal dekat", "Asal murah", "Asal unik", "Asal bisa foto", "Asal ada WiFi"]
      }
    ]
  }
];

export const OTHER_STEPS = [
  { q: "Punya waktu berapa lama?", chips: ["Kurang dari 1 jam", "1-2 jam", "Setengah hari", "Seharian"] },
  { q: "Mau pergi sejauh apa?", chips: ["Jalan kaki", "5-15 menit", "15-30 menit", "Bebas asal menarik"] },
  { q: "Budget hari ini?", chips: ["Hemat banget", "Standar", "Premium"] }
];

export const STEP_LABELS = ["Suasana", "Waktu", "Jarak", "Budget"];

export const NEXT_LABELS = ["Lanjut", "Lanjut", "Lanjut", "Cari tempat"];

export const LOADER_TEXTS = [
  "Memilah tempat yang cocok dengan suasanamu.",
  "Mengecek jarak dari lokasimu.",
  "Menyesuaikan dengan budget.",
  "QRIS diluncurkan Bank Indonesia pada 17 Agustus 2019.",
  "Sejak 1 Januari 2020, semua penyelenggara pembayaran wajib memakai QRIS.",
  "Satu kode QRIS bisa dibayar dari aplikasi apa saja: m-banking atau dompet digital.",
  "Hampir selesai. Menyusun enam rekomendasi."
];
