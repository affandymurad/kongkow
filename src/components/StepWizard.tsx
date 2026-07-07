import React from "react";
import { ChevronLeft } from "lucide-react";
import { CATS, OTHER_STEPS, NEXT_LABELS } from "../constants";

interface StepWizardProps {
  step: number;
  selCats: number[];
  selSubs: Record<string, number[]>;
  selWaktu: string;
  selRadius: string;
  selBudget: string;
  onToggleCat: (idx: number) => void;
  onToggleSub: (key: string, chipIdx: number) => void;
  onSelWaktu: (v: string) => void;
  onSelRadius: (v: string) => void;
  onSelBudget: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepWizard({
  step,
  selCats,
  selSubs,
  selWaktu,
  selRadius,
  selBudget,
  onToggleCat,
  onToggleSub,
  onSelWaktu,
  onSelRadius,
  onSelBudget,
  onNext,
  onBack,
}: StepWizardProps) {
  const stepLabel =
    step === 0
      ? "Tujuan Wisata"
      : step === 1
      ? "Waktu Tersedia"
      : step === 2
      ? "Radius Eksplorasi"
      : "Budget";

  const stepQuestion =
    step === 0
      ? "Hari ini kamu lagi pengen ngapain?"
      : step === 1
      ? OTHER_STEPS[0].q
      : step === 2
      ? OTHER_STEPS[1].q
      : OTHER_STEPS[2].q;

  return (
    <>
      {/* Step progress bar */}
      <div className="flex gap-1.5 px-4 mt-4">
        {[0, 1, 2, 3].map((sIndex) => (
          <div
            key={sIndex}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              sIndex < step
                ? "bg-[#1D9E75]"
                : sIndex === step
                ? "bg-[#9FE1CB] animate-pulse"
                : "bg-stone-200"
            }`}
          />
        ))}
      </div>

      {/* Step header */}
      <div className="px-4 mt-4">
        <span className="inline-block text-[10px] md:text-xs font-extrabold uppercase tracking-widest bg-[#E1F5EE] text-[#0F6E56] px-3 py-1 rounded-full font-mono">
          {stepLabel}
        </span>
        <h2 className="text-xl md:text-3xl font-bold text-[#18181A] leading-tight mt-2.5">
          {stepQuestion}
        </h2>
        {step === 0 && (
          <p className="text-xs md:text-sm text-[#9A9994] font-medium mt-1">
            Bisa pilih satu atau lebih mood yang paling cocok ya!
          </p>
        )}
      </div>

      {/* Step body */}
      <div className="flex-1 overflow-y-auto px-4 mt-3 pb-24">
        {step === 0 ? (
          <div className="space-y-4">
            {/* Category grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {CATS.map((cat, idx) => {
                const isSelected = selCats.includes(idx);
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => onToggleCat(idx)}
                    className={`flex flex-col gap-1 text-left p-3.5 rounded-xl border text-xs md:text-sm transition active:scale-97 cursor-pointer hover:border-[#1D9E75]/30 ${
                      isSelected
                        ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56]"
                        : "bg-white border-stone-200 text-[#18181A]"
                    }`}
                  >
                    <span className="text-2xl md:text-3xl filter drop-shadow-sm leading-none">
                      {cat.emoji.replace(/\s+/g, "")}
                    </span>
                    <span className="font-bold font-sans tracking-tight leading-normal">
                      {cat.label}
                    </span>
                    <span className="text-[10px] md:text-xs opacity-70 leading-normal line-clamp-1">
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-category chips */}
            {selCats.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-stone-100">
                {selCats.map((catIdx) => {
                  const cat = CATS[catIdx];
                  return (
                    <div
                      key={cat.label}
                      className="bg-[#F6F5F1] rounded-2xl p-4 border border-stone-200/50"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs md:text-sm text-[#0F6E56] font-sans">
                        <span>{cat.emoji.replace(/\s+/g, "")}</span>
                        <span>{cat.label}</span>
                      </div>
                      {cat.subs.map((sub, sIdx) => {
                        const key = `${catIdx}-${sIdx}`;
                        const selectedChips = selSubs[key] || [];
                        return (
                          <div key={sub.label} className="mt-4">
                            <div className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-[#9A9994] mb-2 font-mono">
                              • {sub.label}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {sub.chips.map((chip, cIdx) => {
                                const isChipSelected = selectedChips.includes(cIdx);
                                return (
                                  <button
                                    key={chip}
                                    type="button"
                                    onClick={() => onToggleSub(key, cIdx)}
                                    className={`py-2 px-3.5 rounded-full text-xs md:text-sm font-medium cursor-pointer transition active:scale-95 ${
                                      isChipSelected
                                        ? "bg-[#1D9E75] text-white font-bold"
                                        : "bg-white text-[#5C5B57] border border-stone-200/80 hover:bg-stone-50"
                                    }`}
                                  >
                                    {chip}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 py-4">
            {OTHER_STEPS[step - 1].chips.map((chip) => {
              const isSelected =
                step === 1
                  ? selWaktu === chip
                  : step === 2
                  ? selRadius === chip
                  : selBudget === chip;

              const selectValue = () => {
                if (step === 1) onSelWaktu(chip);
                else if (step === 2) onSelRadius(chip);
                else onSelBudget(chip);
              };

              return (
                <button
                  key={chip}
                  type="button"
                  onClick={selectValue}
                  className={`text-left w-full py-4 px-5 rounded-2xl border text-sm md:text-base font-semibold transition active:scale-98 cursor-pointer ${
                    isSelected
                      ? "bg-[#E1F5EE] border-[#1D9E75] text-[#0F6E56] font-bold shadow-2xs"
                      : "bg-white border-stone-200/80 text-[#5C5B57] hover:bg-stone-50"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <footer className="absolute bottom-0 inset-x-0 flex justify-between items-center px-4 py-4 border-t border-stone-100 bg-white/95 backdrop-blur-md z-30">
        <div>
          {step > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 py-2.5 px-4 bg-[#F6F5F1] hover:bg-stone-200 text-[#5C5B57] border border-stone-200 rounded-xl text-xs md:text-sm font-bold font-sans transition"
            >
              <ChevronLeft size={14} className="stroke-[2.5]" />
              <span>Kembali</span>
            </button>
          ) : (
            <div className="w-[90px]" />
          )}
        </div>

        <span className="text-[11px] md:text-xs font-mono font-bold text-[#9A9994]">
          {step + 1} / 4
        </span>

        <button
          type="button"
          onClick={onNext}
          className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-black transition active:scale-95 flex items-center gap-1 cursor-pointer"
        >
          <span>{NEXT_LABELS[step]}</span>
        </button>
      </footer>
    </>
  );
}
