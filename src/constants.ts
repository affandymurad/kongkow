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
  "Fakta QRIS: lahir dari permainan kata \"keris\", senjata tradisional Indonesia. 🗡️",
  "Sabar ya, lagi nanya Jin penunggu daerah setempat... 👻",
  "Fakta QRIS: resmi diluncurkan 17 Agustus 2019, bertepatan dengan HUT Kemerdekaan RI ke-74. 🎉",
  "Mencari tempat sembunyi ter-mbois dari kejaran wacana... 💻",
  "Fakta QRIS: sebelum ada QRIS, satu toko bisa punya banyak kode QR berbeda dari tiap aplikasi pembayaran. 📱",
  "Membandingkan harga es teh manis dan cilok kelurahan setempat... 🍹",
  "Fakta QRIS: semua penyelenggara jasa pembayaran wajib menerapkan QRIS sejak 1 Januari 2020. 📅",
  "Mengukur kemacetan aspal gang buat rute ojol tercepat... 🛵",
  "Fakta QRIS: bisa dipakai lintas aplikasi seperti GoPay, OVO, DANA, ShopeePay, hingga m-banking. 💳",
  "Chatting bentar ama bestie lokal penunggu ruko seberang... 🛋️",
  "Fakta QRIS: selain scan kamera, ada juga versi tap NFC bernama \"QRIS Tap\". 📲",
  "Fakta QRIS: pengguna melonjak dari 1,6 juta orang di 2019 jadi puluhan juta orang dalam enam tahun. 📈",
  "Fakta QRIS: sekitar 95% merchant QRIS berasal dari usaha mikro alias pedagang kecil. 🏪",
  "Fakta QRIS: total transaksi QRIS di 2024 tembus Rp42 triliun. 💰",
  "Fakta QRIS: batas maksimal satu transaksi adalah Rp10 juta, berlaku sejak Maret 2022. 🔒",
  "Fakta QRIS: sejak Maret 2025, merchant layanan publik (BLU/PSO) dikenai biaya MDR 0%. 🏛️",
  "Fakta QRIS: belanja sehari-hari pakai QRIS tidak kena PPN 12%. 🧾",
  "Fakta QRIS: Thailand jadi negara pertama yang terhubung penuh lintas negara sejak 2022. 🇹🇭",
  "Fakta QRIS: sudah bisa dipakai di Thailand, Malaysia, Singapura, Jepang, Korea Selatan, dan Tiongkok. 🌏",
  "Fakta QRIS: resmi terhubung dengan Tiongkok mulai 30 April 2026. 🇨🇳",
  "Fakta QRIS: uji coba Indonesia-Tiongkok sempat mencatat 1,64 juta transaksi senilai Rp556 miliar. 🧪",
  "Fakta QRIS: BI sedang menyiapkannya untuk jemaah haji dan umrah agar bisa dipakai di Arab Saudi. 🕋",
  "Fakta QRIS: ditargetkan bisa dipakai di negara-negara anggota APEC, diumumkan Februari 2026. 🌐",
  "Fakta QRIS: Amerika Serikat pernah menyebutnya sebagai salah satu penghambat perdagangan bebas. 📄",
  "Fakta QRIS: BI menargetkan 17 miliar transaksi dan 60 juta pengguna aktif pada 2026. 🎯"
];
