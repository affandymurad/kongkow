import React from "react";

export default function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="flex items-center justify-between py-5">
      <span className="font-display text-2xl font-bold tracking-tight text-ink">
        kongkow<span className="text-accent">.</span>
      </span>
      {right}
    </header>
  );
}
