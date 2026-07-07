import React from "react";
import {
  MapPin,
  Sparkles,
  RotateCcw,
  Copy,
  Navigation,
  Share2,
  Ticket,
  Wallet,
  BanknoteIcon,
} from "lucide-react";
import { Destination } from "../types";

// ─── Helper: render info pembayaran yang tepat per tipe venue ─────────────────

function PaymentInfo({ dest }: { dest: Destination }) {
  const { venue_type, has_entrance_fee, entrance_fee_range, payment_methods, can_pay_digital, price_num } = dest;

  // public & tidak ada tiket — tampilkan "Gratis Masuk"
  if (venue_type === "public" && !has_entrance_fee) {
    return (
      <div className="w-full p-2.5 rounded-xl text-center bg-[#E1F5EE] text-[#0F6E56] font-extrabold text-xs md:text-sm border border-[#1D9E75]/20 select-none">
        🎉 Gratis Masuk · Bebas Tiket
      </div>
    );
  }

  // attraction — tunjukkan info tiket + metode bayar tiket
  if (venue_type === "attraction") {
    return (
      <div className="w-full rounded-xl border overflow-hidden select-none">
        {/* Baris tiket masuk */}
        <div className={`px-3 py-2 flex items-start gap-2 ${has_entrance_fee ? "bg-[#FEF9EC] border-b border-amber-200/60" : "bg-[#E1F5EE] border-b border-[#1D9E75]/20"}`}>
          <Ticket size={13} className={`shrink-0 mt-0.5 ${has_entrance_fee ? "text-amber-600" : "text-[#1D9E75]"}`} />
          <div>
            <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest font-mono text-amber-700">
              {has_entrance_fee ? "Tiket Masuk Berbayar" : "Tiket Masuk Gratis"}
            </p>
            <p className="text-[11px] md:text-sm font-bold text-[#18181A] leading-snug mt-0.5">
              {has_entrance_fee
                ? (entrance_fee_range || `Rp ${price_num.toLocaleString("id-ID")}`)
                : "Tidak dipungut biaya masuk"}
            </p>
          </div>
        </div>
        {/* Baris metode bayar */}
        {has_entrance_fee && (
          <div className="px-3 py-2 bg-[#F0F4FA] flex items-start gap-2">
            <Wallet size={13} className="text-[#1B56B1] shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest font-mono text-[#1B56B1]">
                Bayar Tiket Via
              </p>
              <p className="text-[11px] md:text-sm font-bold text-[#1D3A6F] leading-snug mt-0.5">
                {payment_methods}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // street — kaki lima, biasanya tunai
  if (venue_type === "street") {
    return (
      <div className="w-full p-2.5 rounded-xl bg-[#FAFAF8] border border-stone-200 flex items-center gap-2 select-none">
        <BanknoteIcon size={14} className="text-stone-500 shrink-0" />
        <div>
          <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest font-mono text-stone-500">
            Metode Bayar
          </p>
          <p className="text-[11px] md:text-sm font-bold text-[#18181A] leading-none mt-0.5">
            {payment_methods}
          </p>
        </div>
      </div>
    );
  }

  // merchant (default) — bayar saat konsumsi/belanja
  return (
    <div className="w-full p-2.5 rounded-xl bg-[#F0F4FA] border border-[#CBDDF2]/70 flex items-start gap-2 select-none">
      <Wallet size={13} className="text-[#1B56B1] shrink-0 mt-0.5" />
      <div>
        <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest font-mono text-[#1B56B1]">
          {can_pay_digital ? "Pembayaran Diterima" : "Metode Bayar"}
        </p>
        <p className="text-[11px] md:text-sm font-bold text-[#1D3A6F] leading-snug mt-0.5">
          {payment_methods}
        </p>
      </div>
    </div>
  );
}

// ─── Tipe badge label ─────────────────────────────────────────────────────────

const VENUE_BADGE: Record<string, { label: string; cls: string }> = {
  merchant:   { label: "Merchant",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
  attraction: { label: "Destinasi",   cls: "bg-amber-50 text-amber-700 border-amber-200" },
  public:     { label: "Publik · Gratis", cls: "bg-green-50 text-green-700 border-green-200" },
  street:     { label: "Kaki Lima",   cls: "bg-orange-50 text-orange-700 border-orange-200" },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ResultsScreenProps {
  headline: string;
  subHeadline: string;
  dests: Destination[];
  error: string | null;
  currentTime: string;
  locName: string;
  copiedTextIdx: number | null;
  onCopy: (text: string, idx: number) => void;
  onRetry: () => void;
  onReset: () => void;
  onShare: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResultsScreen({
  headline,
  subHeadline,
  dests,
  error,
  currentTime,
  locName,
  copiedTextIdx,
  onCopy,
  onRetry,
  onReset,
  onShare,
}: ResultsScreenProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-[#F6F5F1] animate-fadeIn">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 flex justify-between items-center border-b border-stone-200 z-20 bg-white">
        <div className="flex flex-col items-start select-none">
          <span className="text-lg md:text-2xl font-black tracking-tight text-[#0F6E56] leading-none">
            kongkow<span className="text-[#1D9E75] font-black">.</span>
          </span>
          <span className="text-[8px] md:text-[10px] font-black text-[#1E56B1] tracking-wider uppercase mt-1 leading-none">
            didukung oleh QRIS
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] md:text-xs font-bold text-[#5C5B57] font-mono sm:block hidden">
            {currentTime}
          </span>
          <a
            href="https://affandymurad.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] md:text-xs font-extrabold bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#9FE1CB] px-2.5 py-1 rounded-full tracking-wider font-mono cursor-pointer transition active:scale-95 text-center shrink-0"
          >
            Affandy Murad
          </a>
        </div>
      </header>

      {/* Title + share button */}
      <div className="bg-white border-b border-stone-200/80 px-4 py-3.5 shrink-0 flex justify-between items-center gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <h2 className="text-[14px] md:text-lg font-extrabold text-[#18181A] leading-tight flex items-start gap-1.5 font-sans">
            <Sparkles size={15} className="text-[#1D9E75] shrink-0 mt-0.5" />
            <span className="break-words">{headline}</span>
          </h2>
          <p className="text-[11px] md:text-sm font-medium text-[#5C5B57] font-sans leading-normal break-words whitespace-normal">
            {subHeadline}
          </p>
        </div>
        <button
          type="button"
          onClick={onShare}
          className="py-2.5 px-3 bg-[#E1F5EE] border border-[#1D9E75]/30 text-[#0F6E56] rounded-xl font-bold flex items-center gap-1.5 hover:bg-[#9FE1CB]/30 transition text-[11px] md:text-sm active:scale-95 shrink-0"
          title="Generate Boarding Pass"
        >
          <Share2 size={12} className="stroke-[2.5]" />
          <span>Ticket</span>
        </button>
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-32">
        {error ? (
          <div className="bg-[#FEF0ED] border border-[#E8381A]/30 rounded-2xl p-4.5 text-center space-y-3.5">
            <p className="text-xs md:text-sm text-[#E8381A] font-bold leading-relaxed">{error}</p>
            <button
              onClick={onRetry}
              className="bg-[#E8381A] text-white font-bold text-xs md:text-sm px-4 py-2 rounded-xl hover:opacity-90 active:scale-95 transition"
            >
              Coba Gaskeun Ulang
            </button>
          </div>
        ) : dests.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <span className="text-4xl md:text-5xl select-none">🧐</span>
            <p className="text-xs md:text-sm text-[#5C5B57] font-semibold">
              Sepertinya tidak ada kecocokan di lokasi tersebut.
            </p>
            <button
              onClick={onReset}
              className="text-xs md:text-sm bg-[#1D9E75] text-white px-4 py-2 rounded-xl font-bold"
            >
              Ganti Kriteria
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dests.map((dest, idx) => {
              const badge = VENUE_BADGE[dest.venue_type] ?? VENUE_BADGE.merchant;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                dest.name + " " + dest.area + " " + locName
              )}`;

              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs flex flex-col h-full"
                >
                  {/* Emoji thumbnail */}
                  <div className="h-28 bg-[#F6F5F1] relative flex items-center justify-center font-serif text-5xl select-none">
                    <span>{dest.emoji || "🍕"}</span>
                    {/* Distance pill */}
                    <span className="absolute bottom-3 left-3 bg-black/60 text-white font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full">
                      🚗 {dest.distance}
                    </span>
                    {/* Venue type badge */}
                    <span className={`absolute top-2.5 right-2.5 text-[9px] md:text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="space-y-1 mb-2.5">
                      <h3 className="text-base md:text-lg font-extrabold text-[#18181A] leading-tight tracking-tight font-sans">
                        {dest.name}
                      </h3>
                      <p className="text-[11px] md:text-sm font-semibold text-[#0F6E56] font-mono uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={10} className="shrink-0" />
                        {dest.area}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] md:text-xs font-semibold font-mono text-[#5C5B57] bg-[#F6F5F1] px-2.5 py-0.5 rounded-full border border-stone-200/40">
                        ⌛ {dest.duration}
                      </span>
                      <span className="text-[10px] md:text-xs font-semibold font-mono text-[#5C5B57] bg-[#F6F5F1] px-2.5 py-0.5 rounded-full border border-stone-200/40">
                        💵 {dest.price_range}
                      </span>
                      {dest.tags?.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] md:text-xs uppercase font-bold font-mono text-[#0F6E56] bg-[#E1F5EE] px-2.5 py-0.5 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs md:text-sm text-[#5C5B57] leading-relaxed mb-3.5 font-sans font-normal">
                      {dest.desc}
                    </p>

                    {/* Tip box */}
                    <div className="p-3.5 bg-[#E1F5EE] rounded-xl border border-[#1D9E75]/15 mb-4">
                      <p className="text-[10px] md:text-xs font-black uppercase text-[#0F6E56] tracking-widest font-mono mb-1">
                        💡 Tip rahasia bestie
                      </p>
                      <p className="text-xs md:text-sm text-[#18181A] italic leading-relaxed font-medium">
                        "{dest.tip}"
                      </p>
                    </div>

                    {/* Payment info — kontekstual per tipe venue */}
                    <div className="mt-auto space-y-2">
                      <PaymentInfo dest={dest} />

                      {/* Navigation row */}
                      <div className="grid grid-cols-12 gap-1.5 pt-1.5 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => onCopy(dest.name, idx)}
                          className="col-span-4 p-2 bg-white hover:bg-stone-50 border border-stone-200 text-[#5C5B57] hover:text-[#18181A] rounded-xl text-[11px] md:text-sm font-bold transition flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                          title="Salin nama tempat"
                        >
                          <Copy size={13} className="text-amber-600 shrink-0" />
                          <span>{copiedTextIdx === idx ? "Tersalin" : "Salin"}</span>
                        </button>
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="col-span-8 p-2 bg-[#0F6E56] hover:bg-[#084A39] text-white text-[11px] md:text-sm font-black rounded-xl text-center flex items-center justify-center gap-1 transition active:scale-95 shadow-inner"
                        >
                          <Navigation size={11} className="rotate-45" />
                          <span>Rute Google Maps</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex-shrink-0 px-4 py-3.5 border-t border-stone-200/80 bg-white/95 backdrop-blur-md z-20">
        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 px-5 rounded-xl text-white bg-[#0F6E56] hover:bg-[#084A39] font-extrabold text-xs md:text-sm flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <RotateCcw size={14} className="stroke-[2.5]" />
          <span>Cari Lagi</span>
        </button>
      </footer>
    </div>
  );
}
