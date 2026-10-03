import React from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { ParsedAddress } from "../hooks/useGeolocation";

interface LocationCardProps {
  mode: "sk" | "mn";
  locName: string;
  locDetail: string;
  gpsLoading: boolean;
  gpsError: string | null;
  locParsed: ParsedAddress | null;
  manualLoc: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onModeChange: (m: "sk" | "mn") => void;
  onManualLocChange: (v: string) => void;
  onManualSearch: (e: React.FormEvent) => void;
}

export default function LocationCard({
  mode,
  locName,
  locDetail,
  gpsLoading,
  gpsError,
  locParsed,
  manualLoc,
  isCollapsed,
  onToggleCollapse,
  onModeChange,
  onManualLocChange,
  onManualSearch,
}: LocationCardProps) {
  const title =
    mode === "mn"
      ? manualLoc.trim() || "Ketik nama tempat"
      : gpsLoading
      ? "Mencari lokasimu…"
      : locName;

  const detail =
    mode === "mn" ? "Lokasi diisi manual" : gpsLoading ? "Menunggu izin lokasi" : locDetail;

  const parsed: [string, string | undefined][] = [
    ["Jalan", locParsed?.jalan],
    ["Kelurahan", locParsed?.kelurahan],
    ["Kecamatan", locParsed?.kecamatan],
    ["Kota", locParsed?.kota],
  ];

  const tab = (active: boolean) =>
    `flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition cursor-pointer ${
      active ? "bg-ink text-paper" : "text-muted hover:text-ink"
    }`;

  return (
    <div className="rounded-xl border border-line bg-card">
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-expanded={!isCollapsed}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer"
      >
        <MapPin size={18} className="text-accent shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted">Lokasi</span>
          <span className="block font-semibold text-ink truncate">{title}</span>
        </span>
        <ChevronDown
          size={18}
          className={`text-muted shrink-0 transition-transform ${isCollapsed ? "" : "rotate-180"}`}
        />
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4 pt-1 border-t border-line">
          <p className="text-sm text-muted mt-3">{detail}</p>

          {mode === "sk" && locParsed && !gpsLoading && !gpsError && (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {parsed.map(([label, value]) =>
                value ? (
                  <div key={label} className="min-w-0">
                    <dt className="text-xs text-muted">{label}</dt>
                    <dd className="font-medium text-ink truncate">{value}</dd>
                  </div>
                ) : null
              )}
            </dl>
          )}

          {mode === "sk" && gpsError && !gpsLoading && (
            <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2.5 text-sm text-accent-dark">
              {gpsError} Pilih “Tempat lain” untuk mengetik lokasi sendiri.
            </p>
          )}

          <div className="mt-4 flex gap-1 rounded-xl bg-paper p-1">
            <button type="button" onClick={() => onModeChange("sk")} className={tab(mode === "sk")}>
              Sekitar sini
            </button>
            <button type="button" onClick={() => onModeChange("mn")} className={tab(mode === "mn")}>
              Tempat lain
            </button>
          </div>

          {mode === "mn" && (
            <form onSubmit={onManualSearch} className="mt-3 flex gap-2">
              <input
                type="text"
                value={manualLoc}
                onChange={(e) => onManualLocChange(e.target.value)}
                placeholder="Dago, Blok M, Prawirotaman…"
                aria-label="Nama lokasi"
                className="flex-1 min-w-0 rounded-lg border border-line bg-paper px-3 py-2.5 text-sm placeholder:text-muted/70 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition cursor-pointer"
              >
                Pakai
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
