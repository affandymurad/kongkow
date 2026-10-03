import React from "react";
import { CATS, OTHER_STEPS, STEP_LABELS, NEXT_LABELS } from "../constants";

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
  const question = step === 0 ? "Lagi pengin ngapain?" : OTHER_STEPS[step - 1].q;

  const selected = [selWaktu, selRadius, selBudget][step - 1];
  const setSelected = [onSelWaktu, onSelRadius, onSelBudget][step - 1];

  return (
    <>
      <div className="mt-10">
        <p className="text-sm font-semibold text-accent">
          Langkah {step + 1} dari 4 · {STEP_LABELS[step]}
        </p>
        <div className="mt-2 flex gap-1" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-0.5 flex-1 ${i <= step ? "bg-accent" : "bg-line"}`} />
          ))}
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-semibold mt-5 text-ink">
          {question}
        </h2>
        {step === 0 && (
          <p className="mt-1.5 text-sm text-muted">Boleh pilih lebih dari satu.</p>
        )}
      </div>

      <div className="mt-5">
        {step === 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATS.map((cat, idx) => {
                const on = selCats.includes(idx);
                return (
                  <button
                    key={cat.label}
                    type="button"
                    aria-pressed={on}
                    onClick={() => onToggleCat(idx)}
                    className={`text-left rounded-xl border px-4 py-3.5 transition cursor-pointer ${
                      on
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-card hover:border-ink/40"
                    }`}
                  >
                    <span className="block font-semibold">{cat.label}</span>
                    <span className={`block text-sm mt-0.5 ${on ? "text-paper/70" : "text-muted"}`}>
                      {cat.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {selCats.map((catIdx) => {
              const cat = CATS[catIdx];
              return (
                <section key={cat.label} className="border-t border-line pt-5">
                  <h3 className="font-display text-lg font-semibold">{cat.label}</h3>
                  {cat.subs.map((sub, sIdx) => {
                    const key = `${catIdx}-${sIdx}`;
                    const chosen = selSubs[key] || [];
                    return (
                      <div key={sub.label} className="mt-3">
                        <p className="text-sm text-muted mb-2 first-letter:uppercase">{sub.label}</p>
                        <div className="flex flex-wrap gap-2">
                          {sub.chips.map((chip, cIdx) => {
                            const on = chosen.includes(cIdx);
                            return (
                              <button
                                key={chip}
                                type="button"
                                aria-pressed={on}
                                onClick={() => onToggleSub(key, cIdx)}
                                className={`rounded-full border px-3.5 py-1.5 text-sm transition cursor-pointer ${
                                  on
                                    ? "border-accent bg-accent text-white"
                                    : "border-line bg-card text-ink hover:border-ink/40"
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
                </section>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5" role="radiogroup">
            {OTHER_STEPS[step - 1].chips.map((chip) => {
              const on = selected === chip;
              return (
                <button
                  key={chip}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setSelected(chip)}
                  className={`text-left rounded-xl border px-4 py-4 font-medium transition cursor-pointer ${
                    on ? "border-ink bg-ink text-paper" : "border-line bg-card hover:border-ink/40"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-5 py-3.5 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:text-ink cursor-pointer"
            >
              Kembali
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark transition cursor-pointer"
          >
            {NEXT_LABELS[step]}
          </button>
        </div>
      </footer>
    </>
  );
}
