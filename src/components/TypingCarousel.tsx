import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const PROMPTS = [
  "Cari es kopi susu hits terdekat...",
  "Cari hidden gem estetik dalam 15 menit...",
  "Cari taman hijau sejuk gratis buat melamun...",
  "Cari kedai kuliner legendaris yang manis gurih...",
  "Cari spot sunset tercakep buat konten sosmed...",
  "Cari tempat nongki murah meriah pas tanggal tua...",
  "Cari cafe sepi ternyaman buat tugas kuliah...",
  "Cari spot nongkrong 24 jam penolak wacana..."
];

export default function TypingCarousel() {
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Simple clean standard typewriter hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = PROMPTS[currentPromptIdx];

    const handleType = () => {
      if (!isDeleting) {
        // Typing Phase
        setCurrentText(fullText.slice(0, currentText.length + 1));
        setTypingSpeed(60);

        if (currentText === fullText) {
          // Pause at natural end
          timer = setTimeout(() => setIsDeleting(true), 2500);
          return;
        }
      } else {
        // Deleting Phase
        setCurrentText(fullText.slice(0, currentText.length - 1));
        setTypingSpeed(25);

        if (currentText === "") {
          setIsDeleting(false);
          setCurrentPromptIdx((prev) => (prev + 1) % PROMPTS.length);
          timer = setTimeout(() => {}, 400);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPromptIdx, typingSpeed]);

  return (
    <div id="typing-prompt-carousel" className="flex items-center gap-2.5 bg-gradient-to-r from-[#FAF9F5] to-[#F5F2EB]/80 border border-[#E6E2D8] rounded-xl px-3.5 py-2 mx-4 mt-3 shadow-3xs select-none">
      <Sparkles className="w-3.5 h-3.5 text-[#1D9E75] shrink-0 animate-pulse" />
      <div className="text-[11px] md:text-sm text-[#5A5A40] truncate flex-1 flex items-center">
        <span className="font-bold text-[#107F62] tracking-tight">
          {currentText}
        </span>
        <span className="w-[1.5px] h-3.5 ml-0.5 bg-[#1D9E75] inline-block animate-pulse shrink-0"></span>
      </div>
    </div>
  );
}
