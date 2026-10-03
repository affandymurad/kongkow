import React from "react";
import { Copy, Check, Navigation, Share2, RotateCcw } from "lucide-react";
import { Destination } from "../types";
import Header from "./Header";

const VENUE_LABEL: Record<string, string> = {
  merchant: "Kafe / toko",
  attraction: "Tempat wisata",
  public: "Ruang publik",
  street: "Kaki lima",
};

function paymentLines(dest: Destination): { label: string; value: string; free?: boolean } {
  const { venue_type, has_entrance_fee, entrance_fee_range, payment_methods, price_num } = dest;

  if (venue_type === "public" && !has_entrance_fee) {
    return { label: "Masuk", value: "Gratis", free: true };
  }
  if (venue_type === "attraction") {
    if (!has_entrance_fee) return { label: "Tiket masuk", value: "Gratis", free: true };
    const fee = entrance_fee_range || `Rp ${price_num.toLocaleString("id-ID")}`;
    return { label: "Tiket masuk", value: `${fee} · bayar via ${payment_methods}` };
  }
  return { label: "Bayar via", value: payment_methods };
}

interface ResultsScreenProps {
  headline: string;
  subHeadline: string;
  dests: Destination[];
  error: string | null;
  locName: string;
  copiedTextIdx: number | null;
  onCopy: (text: string, idx: number) => void;
  onRetry: () => void;
  onReset: () => void;
  onShare: () => void;
}

export default function ResultsScreen({
  headline,
  subHeadline,
  dests,
  error,
  locName,
  copiedTextIdx,
  onCopy,
  onRetry,
  onReset,
  onShare,
}: ResultsScreenProps) {
  return (
    <div className="mx-auto max-w-2xl px-5 pb-28 animate-fadeIn">
      <Header
        right={
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink cursor-pointer"
          >
            <RotateCcw size={14} /> Cari lagi
          </button>
        }
      />

      {error ? (
        <div className="mt-10 rounded-xl bg-warn-soft p-5">
          <h2 className="font-display text-xl font-semibold text-accent-dark">Belum berhasil</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">{error}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={onRetry}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark cursor-pointer"
            >
              Coba lagi
            </button>
            <button
              onClick={onReset}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-muted hover:text-ink cursor-pointer"
            >
              Ubah pilihan
            </button>
          </div>
        </div>
      ) : dests.length === 0 ? (
        <div className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Tidak ada yang cocok</h2>
          <p className="mt-2 text-muted">Coba perluas jarak atau ganti suasana.</p>
          <button
            onClick={onReset}
            className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark cursor-pointer"
          >
            Ubah pilihan
          </button>
        </div>
      ) : (
        <>
          <section className="pt-2 pb-6">
            <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
              {headline}
            </h1>
            <p className="mt-2 text-muted">{subHeadline}</p>
          </section>

          <ol className="divide-y divide-line border-y border-line">
            {dests.map((dest, idx) => {
              const pay = paymentLines(dest);
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${dest.name} ${dest.area} ${locName}`
              )}`;
              return (
                <li key={idx} className="py-7 flex gap-4">
                  <span className="font-display text-2xl text-accent w-7 shrink-0 leading-tight">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-xl md:text-2xl font-semibold leading-snug">
                      {dest.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      {dest.area} · {VENUE_LABEL[dest.venue_type] ?? VENUE_LABEL.merchant}
                    </p>

                    <p className="mt-3 text-sm font-medium text-ink">
                      {dest.distance} · {dest.duration} · {dest.price_range}
                    </p>

                    <p className="mt-3 leading-relaxed text-ink/85">{dest.desc}</p>

                    <p className="mt-4 border-l-2 border-accent pl-3 text-sm leading-relaxed text-ink/85">
                      <span className="font-semibold text-ink">Info lokal: </span>
                      {dest.tip}
                    </p>

                    <p className="mt-4 text-sm">
                      <span className="text-muted">{pay.label}: </span>
                      <span className={pay.free ? "font-semibold text-leaf" : "font-medium"}>
                        {pay.value}
                      </span>
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85 transition"
                      >
                        <Navigation size={14} /> Buka di Maps
                      </a>
                      <button
                        type="button"
                        onClick={() => onCopy(dest.name, idx)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink/40 transition cursor-pointer"
                      >
                        {copiedTextIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                        {copiedTextIdx === idx ? "Tersalin" : "Salin nama"}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}

      {dests.length > 0 && !error && (
        <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
          <div className="mx-auto max-w-2xl px-5 py-3.5">
            <button
              type="button"
              onClick={onShare}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-dark transition cursor-pointer"
            >
              <Share2 size={16} /> Ajak teman
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
