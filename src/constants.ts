export interface Category {
  emoji: string;
  label: string;
  desc: string;
  subs: {
    label: string;
    chips: string[];
  }[];
}

export const CATS: Category[] = [
  {
    emoji: "🍜",
    label: "Lapar / haus",
    desc: "Cari makan atau minuman",
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
    emoji: "📸",
    label: "Konten / foto",
    desc: "Cari spot & estetika",
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
    emoji: "🛋️",
    label: "Santai / rebahan",
    desc: "Gak mau gerak banyak",
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
    emoji: "🌿",
    label: "Alam & udara segar",
    desc: "Keluar dari beton kota",
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
    emoji: "🛍️",
    label: "Belanja / jajan",
    desc: "Refreshing lewat dompet",
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
    emoji: "🎭",
    label: "Budaya & sejarah",
    desc: "Nambah wawasan sambil jalan",
    subs: [
      {
        label: "destinasi",
        chips: ["Museum", "Candi & situs sejarah", "Galeri seni", "Pertunjukan seni", "Kampung adat", "Pasar tradisional"]
      }
    ]
  },
  {
    emoji: "👨‍👩‍👧",
    label: "Bawa anak / keluarga",
    desc: "Aman & seru buat semua",
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
    emoji: "💑",
    label: "Kencan / couple",
    desc: "Quality time berdua",
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
    emoji: "🎮",
    label: "Aktivitas & main",
    desc: "Gerak atau challenge",
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
    emoji: "🌙",
    label: "Malam hari",
    desc: "Setelah jam 6 sore",
    subs: [
      {
        label: "vibes malam",
        chips: ["Rooftop & city view", "Night market / bazaar", "Bar & mocktail spot", "Jazz & live music", "Bioskop", "Stargazing"]
      }
    ]
  },
  {
    emoji: "😮‍💨",
    label: "Healing",
    desc: "Butuh me-time serius",
    subs: [
      {
        label: "jenis healing",
        chips: ["Sepi dari orang", "Spa & pijat", "Duduk dekat air", "Nulis jurnal di kafe", "Makan enak sendirian", "Jalan tanpa tujuan"]
      }
    ]
  },
  {
    emoji: "🏃",
    label: "Spontan & nekat",
    desc: "Gak mau yang biasa-biasa",
    subs: [
      {
        label: "level nekat",
        chips: ["Coba kuliner ekstrem", "Tempat jarang didatangi", "Naik angkot ke terminal akhir", "Masuk gang-gang kecil", "Cari warung paling tua", "Tempat namanya asing"]
      }
    ]
  },
  {
    emoji: "☕",
    label: "Kerja / belajar",
    desc: "Produktif di luar rumah",
    subs: [
      {
        label: "kebutuhan",
        chips: ["WiFi kencang wajib", "Stop kontak banyak", "Gak berisik", "Boleh duduk lama", "Kopi enak", "Buka 24 jam"]
      }
    ]
  },
  {
    emoji: "🤷",
    label: "Surprise me!",
    desc: "Biar AI yang pilih",
    subs: [
      {
        label: "satu-satunya syarat",
        chips: ["Asal seru", "Asal dekat", "Asal murah", "Asal unik", "Asal bisa foto", "Asal ada WiFi"]
      }
    ]
  }
];

export const OTHER_STEPS = [
  { tag: "waktu tersedia", q: "Punya waktu berapa lama?", chips: ["< 1 jam", "1-2 jam", "Setengah hari", "Seharian"] },
  { tag: "radius eksplorasi", q: "Mau eksplor sejauh apa?", chips: ["Jalan kaki", "5-15 menit", "15-30 menit", "Bebas asal menarik"] },
  { tag: "budget", q: "Budget kamu hari ini?", chips: ["Hemat banget", "Standar", "Premium"] }
];

export const NEXT_LABELS = [
  "Gas! 🗺️",
  "Hampir nih! ⚡",
  "Dikit lagi! 🔥",
  "Cari sekarang! 🚀"
];

export const HUMOROUS_LOADER_TEXTS = [
  "Mencari hidden gem terdekat... 🔍",
  "Promo Trans Jatim: Cashback 50% Pakai AstraPay (01 Apr–30 Jun 2026) 🎟️",
  "Sabar ya, lagi nanya Jin penunggu daerah setempat... 👻",
  "Promo Trans Jogja: Cashback 50% Pakai AstraPay (01 Apr–30 Jun 2026) 🚌",
  "Mencari tempat sembunyi ter-mbois dari kejaran wacana... 💻",
  "Promo MRT: Naik MRT Jadi Lebih Untung, Cashback 50% Pakai AstraPay (01 Apr–30 Jun 2026) 🚇",
  "Membandingkan harga es teh manis dan cilok kelurahan setempat... 🍹",
  "Promo Transjakarta: Jalan-Jalan Naik Transjakarta Makin Cuan Pakai AstraPay (01 Apr–30 Jun 2026) 🚍",
  "Mengukur kemacetan aspal gang buat rute ojol tercepat... 🛵",
  "Promo Trans Semarang: Naik Trans Semarang, Cashback hingga 50% Pakai AstraPay (01 Apr–30 Jun 2026) 🎫",
  "Chatting bentar ama bestie lokal penunggu ruko seberang... 🛋️",
  "Promo DAMRI: Jalan Nyaman Bareng DAMRI, Cashback hingga Rp30.000 Pakai AstraPay (10 Apr–30 Jun 2026) 🚌"
];
