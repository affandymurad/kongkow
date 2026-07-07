import React from "react";
import { Compass } from "lucide-react";

interface LoadingScreenProps {
  currentTime: string;
  loaderText: string;
}

export default function LoadingScreen({ currentTime, loaderText }: LoadingScreenProps) {
  return (
    <div className="flex-1 flex flex-col justify-center items-center h-full bg-white animate-fadeIn px-6">
      <header className="absolute top-0 inset-x-0 px-4 py-3 flex justify-between items-center border-b border-stone-100 z-10 bg-white">
        <div className="flex flex-col items-start select-none">
          <span className="text-lg md:text-2xl font-black tracking-tight text-[#0F6E56] leading-none">
            kongkow<span className="text-[#1D9E75] font-black">.</span>
          </span>
          <span className="text-[8px] md:text-[10px] font-black text-[#1E56B1] tracking-wider uppercase mt-1 leading-none">
            didukung oleh QRIS
          </span>
        </div>
        <span className="text-[10px] md:text-xs font-bold text-[#5C5B57] font-mono sm:block hidden">
          {currentTime}
        </span>
      </header>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin"></div>
          <Compass size={24} className="absolute text-[#0F6E56] animate-pulse md:w-8 md:h-8" />
        </div>
        <div className="space-y-1.5 text-center max-w-xs md:max-w-sm">
          <h3 className="text-base md:text-lg font-bold text-[#18181A] font-sans">
            AI sedang memilah...
          </h3>
          <p className="text-xs md:text-sm text-[#5C5B57] font-mono italic leading-relaxed">
            {loaderText}
          </p>
        </div>
      </div>
    </div>
  );
}
