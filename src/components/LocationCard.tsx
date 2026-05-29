import React from "react";
import { MapPin, Compass, ChevronDown, ChevronUp } from "lucide-react";
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
  const displayedLocName =
    mode === "mn"
      ? manualLoc.trim() || "Ketik nama lokasi..."
      : gpsLoading
      ? "Mencari sinyal satelit GPS..."
      : locName;

  const displayedLocDetail =
    mode === "mn"
      ? "Lokasi eksplorasi manual"
      : gpsLoading
      ? "Menghubungi satelit penunjuk daerah..."
      : locDetail;

  return (
    <div className="mx-4 mt-3 bg-[#F6F5F1] rounded-2xl p-4 border border-stone-200/60 shadow-2xs select-none">
      <div
        onClick={onToggleCollapse}
        className="flex items-center justify-between gap-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1D9E75] loc-pulse shrink-0"></div>
          <div className="font-extrabold text-xs text-[#18181A] truncate flex-1">
            {displayedLocName}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          className="p-1 hover:bg-stone-200/50 rounded-lg text-stone-500 hover:text-stone-700 transition cursor-pointer flex items-center justify-center shrink-0"
          aria-label="Toggle detail lokasi"
        >
          {isCollapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>
      </div>

      <div
        className={`${
          isCollapsed ? "hidden" : "block"
        } mt-2.5 pt-2.5 border-t border-stone-200/40 transition-all duration-300`}
      >
        <div className="text-[10px] text-[#9A9994] pl-5 mt-0.5 font-medium truncate">
          {displayedLocDetail}
        </div>

        {mode === "sk" && locParsed && !gpsLoading && (
          <div className="mt-3 ml-5 grid grid-cols-2 gap-2 text-[10px] bg-white/70 p-2.5 rounded-xl border border-stone-200/30 font-mono text-[#5C5B57] select-none">
            {locParsed.jalan && (
              <div className="truncate">
                <span className="text-[#107F62] block uppercase tracking-wider text-[8px] font-black">Jalan</span>
                <span className="font-bold text-[#18181A]">{locParsed.jalan}</span>
              </div>
            )}
            {locParsed.kelurahan && (
              <div className="truncate">
                <span className="text-[#107F62] block uppercase tracking-wider text-[8px] font-black">Kelurahan</span>
                <span className="font-bold text-[#18181A]">{locParsed.kelurahan}</span>
              </div>
            )}
            {locParsed.kecamatan && (
              <div className="truncate">
                <span className="text-[#107F62] block uppercase tracking-wider text-[8px] font-black">Kecamatan</span>
                <span className="font-bold text-[#18181A]">{locParsed.kecamatan}</span>
              </div>
            )}
            {locParsed.kota && (
              <div className="truncate">
                <span className="text-[#107F62] block uppercase tracking-wider text-[8px] font-black">Kota/Kab</span>
                <span className="font-bold text-[#18181A]">{locParsed.kota}</span>
              </div>
            )}
            {locParsed.negara && (
              <div className="truncate">
                <span className="text-[#107F62] block uppercase tracking-wider text-[8px] font-black">Negara</span>
                <span className="font-bold text-[#18181A]">{locParsed.negara}</span>
              </div>
            )}
          </div>
        )}

        {mode === "sk" && gpsError && !gpsLoading && (
          <div className="mt-3 mx-1 bg-[#FFF2F0] border border-red-200 rounded-xl p-3 text-xs text-red-800">
            <div className="font-bold flex items-center gap-1">
              <span>⚠️</span> {gpsError}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-red-700/90">
              Browser memblokir permintaan sensor lokasi saat situs termuat di dalam frame sandboxed (iFrame).
            </p>
            <div className="mt-2 text-[10px] bg-red-100/50 p-2 rounded-lg text-red-900 leading-normal">
              <strong>💡 Cara Atasi:</strong> Klik ikon{" "}
              <strong className="underline">"Buka di Tab Baru"</strong> agar
              browser meminta izin GPS secara normal, atau pilih tab{" "}
              <strong>"Tempat Lain"</strong> untuk menulis manual.
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => onModeChange("sk")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "sk"
                ? "bg-[#E1F5EE] text-[#0F6E56] border border-[#1D9E75]/40"
                : "bg-white text-[#5C5B57] border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <MapPin size={13} className={mode === "sk" ? "text-[#1D9E75]" : "text-stone-400"} />
            Sekitar Sini
          </button>
          <button
            type="button"
            onClick={() => onModeChange("mn")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === "mn"
                ? "bg-[#E1F5EE] text-[#0F6E56] border border-[#1D9E75]/40"
                : "bg-white text-[#5C5B57] border border-stone-200 hover:bg-stone-50"
            }`}
          >
            <Compass size={13} className={mode === "mn" ? "text-[#1D9E75]" : "text-stone-400"} />
            Tempat Lain
          </button>
        </div>

        {mode === "mn" && (
          <form onSubmit={onManualSearch} className="mt-3 flex gap-1.5">
            <input
              type="text"
              value={manualLoc}
              onChange={(e) => onManualLocChange(e.target.value)}
              placeholder="Cth: Dago, Blok M, Jogja, Bandung..."
              className="flex-1 bg-white border border-stone-200 rounded-lg py-2 px-3 text-xs text-[#18181A] focus:outline-none focus:ring-1 focus:ring-[#1D9E75] font-medium"
            />
            <button
              type="submit"
              className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-4 py-2 rounded-lg text-xs font-black transition active:scale-95"
            >
              Ganti
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
