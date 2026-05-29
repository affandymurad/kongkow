import React from "react";
import { ChevronLeft } from "lucide-react";

interface Receipt {
  destName: string;
  amount: number;
  method: string;
  refId: string;
  time: string;
}

interface SuccessReceiptProps {
  receipt: Receipt;
  currentTime: string;
  onBack: () => void;
  onReset: () => void;
}

export default function SuccessReceipt({
  receipt,
  currentTime,
  onBack,
  onReset,
}: SuccessReceiptProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white animate-fadeIn">
      <header className="flex-shrink-0 px-4 py-3 flex justify-between items-center border-b border-stone-100 z-10 bg-white">
        <div className="flex flex-col items-start select-none">
          <span className="text-lg font-black tracking-tight text-[#0F6E56] leading-none">
            kongkow<span className="text-[#1D9E75] font-black">.</span>
          </span>
          <span className="text-[8px] font-black text-[#1E56B1] tracking-wider uppercase mt-1 leading-none">
            didukung oleh AstraPay
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#5C5B57] font-mono sm:block hidden">
          {currentTime}
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 text-center overflow-y-auto">
        <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center text-3xl font-bold text-[#1D9E75] mb-5 animate-bounce">
          ✓
        </div>

        <h2 className="text-xl font-bold text-[#18181A] font-sans">
          Pembayaran Berhasil!
        </h2>
        <p className="text-xs text-[#5C5B57] leading-relaxed mt-1 font-sans">
          Transaksimu sudah resmi tercatat oleh radar.
          <br />
          Selamat menikmati petualangan anti-wacana!
        </p>

        {/* Receipt card */}
        <div className="w-full bg-[#F6F5F1] rounded-2xl p-4.5 border border-stone-200 mt-6 text-left space-y-3 font-sans">
          {[
            { label: "Destinasi", value: receipt.destName, className: "text-[#18181A] font-extrabold" },
            {
              label: "Jumlah Bayar",
              value: `Rp ${receipt.amount.toLocaleString("id-ID")}`,
              className: "text-[#1D9E75] font-black",
            },
            { label: "Metode Dompet", value: receipt.method, className: "text-[#18181A] font-extrabold" },
          ].map(({ label, value, className }) => (
            <div key={label} className="flex justify-between items-baseline border-b border-stone-250/50 pb-2.5 text-xs">
              <span className="text-[#9A9994] font-medium">{label}</span>
              <span className={`max-w-[65%] text-right truncate ${className}`}>{value}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline border-b border-stone-250/50 pb-2.5 text-xs">
            <span className="text-[#9A9994] font-medium">Ref ID</span>
            <span className="text-stone-500 font-mono text-[10px] font-bold">{receipt.refId}</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="text-[#9A9994] font-medium">Tanggal Transaksi</span>
            <span className="text-stone-500 font-mono text-[10px] font-bold">{receipt.time}</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-[#18181A] border border-stone-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition uppercase tracking-wider"
          >
            <ChevronLeft size={14} className="stroke-[2.5]" />
            Kembali ke Hasil
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-4 bg-[#1D9E75] hover:bg-[#0F6E56] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition shadow-xs uppercase tracking-widest"
          >
            Discovery Spot Lain
          </button>
        </div>
      </div>
    </div>
  );
}
