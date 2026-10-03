import React from "react";
import Header from "./Header";

export default function LoadingScreen({ loaderText }: { loaderText: string }) {
  return (
    <div className="mx-auto max-w-2xl px-5 min-h-[100dvh] flex flex-col animate-fadeIn">
      <Header />
      <div className="flex-1 flex flex-col justify-center pb-24" role="status" aria-live="polite">
        <div className="h-8 w-8 rounded-full border-2 border-line border-t-accent animate-spin" />
        <h2 className="font-display text-3xl font-semibold mt-6 text-ink">Sedang mencari…</h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted min-h-[3.5rem]">
          {loaderText}
        </p>
      </div>
    </div>
  );
}
