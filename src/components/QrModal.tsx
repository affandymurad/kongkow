import React from "react";
import { Destination } from "../types";

interface QrModalProps {
  dest: Destination;
  onSimulatePay: () => void;
  onClose: () => void;
}

export default function QrModal({ dest, onSimulatePay, onClose }: QrModalProps) {
  return (
    <div className="absolute inset-0 bg-black/60 z-50 flex items-end justify-center pointer-events-auto">
      <div className="w-full bg-white rounded-t-3xl p-6 pb-8 font-sans border-t border-stone-100">
        <div className="w-9 h-1 bg-stone-300 rounded-full mx-auto mb-5"></div>

        <div className="text-center mb-4 space-y-1">
          <h3 className="text-base md:text-lg font-extrabold text-[#18181A]">Scan QRIS</h3>
          <p className="text-xs md:text-sm text-[#9A9994]">Arahkan kamera HP ke mesin kasir tenant</p>
        </div>

        {/* QR Frame */}
        <div className="w-[170px] h-[170px] mx-auto bg-[#F6F5F1] border border-stone-300/80 rounded-2xl relative overflow-hidden flex items-center justify-center my-4 select-none shadow-inner">
          <div className="absolute top-2 left-2 w-5 h-5 border-l-4 border-t-4 border-[#1D9E75] rounded-tl-md"></div>
          <div className="absolute top-2 right-2 w-5 h-5 border-r-4 border-t-4 border-[#1D9E75] rounded-tr-md"></div>
          <div className="absolute bottom-2 left-2 w-5 h-5 border-l-4 border-b-4 border-[#1D9E75] rounded-bl-md"></div>
          <div className="absolute bottom-2 right-2 w-5 h-5 border-r-4 border-b-4 border-[#1D9E75] rounded-br-md"></div>
          <div className="qr-scan-line absolute left-3 right-3 h-0.5 bg-[#1D9E75] shadow-xs"></div>
          <svg width="105" height="105" viewBox="0 0 110 110" fill="none" className="text-[#18181A]">
            <rect x="4" y="4" width="33" height="33" rx="3" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="11" y="11" width="19" height="19" rx="1" fill="currentColor"/>
            <rect x="73" y="4" width="33" height="33" rx="3" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="80" y="11" width="19" height="19" rx="1" fill="currentColor"/>
            <rect x="4" y="73" width="33" height="33" rx="3" stroke="currentColor" strokeWidth="2.5"/>
            <rect x="11" y="80" width="19" height="19" rx="1" fill="currentColor"/>
            <rect x="48" y="4" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="58" y="4" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="48" y="14" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="58" y="24" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="48" y="48" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="58" y="58" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="70" y="48" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="48" y="70" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="82" y="48" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="94" y="58" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="58" y="70" width="7" height="7" rx="1" fill="currentColor"/>
            <rect x="94" y="82" width="7" height="7" rx="1" fill="currentColor"/>
          </svg>
        </div>

        <div className="text-2xl md:text-3xl font-black text-[#18181A] text-center mt-2">
          Rp {(dest.price_num || 45000).toLocaleString("id-ID")}
        </div>
        <div className="text-xs md:text-sm text-[#9A9994] text-center mb-6">
          Tiket resmi • {dest.name}
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onSimulatePay}
            className="w-full py-4 bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-black text-xs md:text-sm rounded-xl flex items-center justify-center gap-1 cursor-pointer transition active:scale-95 shadow-2xs uppercase tracking-widest"
          >
            ✓ Simulasi Bayar Sukses
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 bg-[#F6F5F1] hover:bg-stone-200 border border-stone-300 text-[#5C5B57] font-bold text-xs md:text-sm rounded-xl cursor-pointer transition uppercase"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
