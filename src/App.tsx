import React, { useState, useEffect } from "react";
import { UserInput, Destination } from "./types";
import { CATS, HUMOROUS_LOADER_TEXTS } from "./constants";

import { useClock } from "./hooks/useClock";
import { useGeolocation } from "./hooks/useGeolocation";

import LocationCard from "./components/LocationCard";
import StepWizard from "./components/StepWizard";
import LoadingScreen from "./components/LoadingScreen";
import ResultsScreen from "./components/ResultsScreen";
import SuccessReceipt from "./components/SuccessReceipt";
import QrModal from "./components/QrModal";
import ShareModal from "./components/ShareModal";
import TypingCarousel from "./components/TypingCarousel";

type Screen = "onboarding" | "loading" | "results" | "success_receipt";

interface Receipt {
  destName: string;
  amount: number;
  method: string;
  refId: string;
  time: string;
}

export default function App() {
  // ─── Screen ───────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("onboarding");

  // ─── Hooks ────────────────────────────────────────────────────
  const currentTime = useClock();
  const geo = useGeolocation();

  // ─── Location UI state ────────────────────────────────────────
  const [mode, setMode] = useState<"sk" | "mn">("sk");
  const [isLocCollapsed, setIsLocCollapsed] = useState(true);
  const [manualLoc, setManualLoc] = useState("");

  // ─── Step wizard state ────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [selCats, setSelCats] = useState<number[]>([]);
  const [selSubs, setSelSubs] = useState<Record<string, number[]>>({});
  const [selWaktu, setSelWaktu] = useState("1-2 jam");
  const [selRadius, setSelRadius] = useState("15-30 menit");
  const [selBudget, setSelBudget] = useState("Standar");

  // ─── Results state ────────────────────────────────────────────
  const [dests, setDests] = useState<Destination[]>([]);
  const [headline, setHeadline] = useState("Rekomendasi untuk kamu");
  const [subHeadline, setSubHeadline] = useState("Di sekitar lokasimu");
  const [error, setError] = useState<string | null>(null);

  // ─── Payment / modal state ────────────────────────────────────
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrDest, setQrDest] = useState<Destination | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedTextIdx, setCopiedTextIdx] = useState<number | null>(null);

  // ─── Loader text cycling ──────────────────────────────────────
  const [loaderIndex, setLoaderIndex] = useState(0);
  useEffect(() => {
    if (screen !== "loading") { setLoaderIndex(0); return; }
    const iv = setInterval(() => {
      setLoaderIndex((p) => (p + 1) % HUMOROUS_LOADER_TEXTS.length);
    }, 2500);
    return () => clearInterval(iv);
  }, [screen]);

  // Auto-detect GPS on mount
  useEffect(() => { geo.detectLocation(); }, []);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleModeChange = (m: "sk" | "mn") => {
    setMode(m);
    if (m === "sk") geo.detectLocation();
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLoc.trim()) {
      geo.setLocName(manualLoc.trim());
      geo.setLocDetail("Lokasi diatur manual");
    }
  };

  const toggleCategory = (catIdx: number) => {
    setSelCats((prev) =>
      prev.includes(catIdx) ? prev.filter((i) => i !== catIdx) : [...prev, catIdx]
    );
  };

  const toggleSubChip = (key: string, chipIdx: number) => {
    setSelSubs((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(chipIdx)
          ? current.filter((i) => i !== chipIdx)
          : [...current, chipIdx],
      };
    });
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => s + 1);
    else callRadarAI();
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const resetAll = () => {
    setStep(0);
    setSelCats([]);
    setSelSubs({});
    setSelWaktu("1-2 jam");
    setSelRadius("15-30 menit");
    setSelBudget("Standar");
    setDests([]);
    setScreen("onboarding");
    setError(null);
    setQrDest(null);
  };

  const buildPayload = (): UserInput => {
    const moodPayload = selCats.map((idx) => CATS[idx].label);
    const prefPayload: string[] = [];
    Object.entries(selSubs).forEach(([key, arr]) => {
      const [ci, si] = key.split("-").map(Number);
      arr.forEach((chi) => {
        if (CATS[ci]?.subs[si]) prefPayload.push(CATS[ci].subs[si].chips[chi]);
      });
    });
    const activeLoc =
      mode === "mn" && manualLoc.trim() ? manualLoc.trim() : geo.locName;
    return {
      lokasi: activeLoc,
      mood: moodPayload.length > 0 ? moodPayload : ["Lapar / haus"],
      preferensi: prefPayload.length > 0 ? prefPayload : ["Warung lokal autentik"],
      waktu: selWaktu,
      radius: selRadius,
      budget: selBudget,
      lokasi_detail: mode === "sk" ? geo.locDetail : undefined,
    };
  };

  const callRadarAI = async () => {
    setScreen("loading");
    setError(null);
    const payload = buildPayload();
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      // Backend mengembalikan error terstruktur jika Gemini gagal
      if (!res.ok || data.error) {
        throw new Error(data.message || "Gagal menghubungi AI. Coba beberapa saat lagi.");
      }
      setDests(data.destinations || []);
      setHeadline(data.headline || "6 Rekomendasi buat Kamu");
      setSubHeadline(data.sub || `Di sekitar ${payload.lokasi}`);
      setScreen("results");
    } catch (err: any) {
      setError(err?.message || "Koneksi terganggu. Ayo gaskeun radar ulang!");
      setScreen("results");
    }
  };

  const showPaidSuccess = (dest: Destination, method: string, ref: string) => {
    const now = new Date();
    setReceipt({
      destName: dest.name,
      amount: dest.price_num || 45000,
      method,
      refId: ref,
      time: now.toLocaleDateString("id-ID", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }),
    });
    setScreen("success_receipt");
  };

  const simulateQrSuccess = () => {
    if (!qrDest) return;
    setShowQrModal(false);
    showPaidSuccess(qrDest, "QR AstraPay", "QR" + Date.now());
  };

  const handleCopyDestName = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTextIdx(idx);
    setTimeout(() => setCopiedTextIdx(null), 2000);
  };

  // ─── Derived activeInput for ShareModal ───────────────────────
  const activeInput: UserInput = {
    lokasi: mode === "mn" && manualLoc.trim() ? manualLoc.trim() : geo.locName,
    mood: selCats.map((idx) => CATS[idx].label).length > 0
      ? selCats.map((idx) => CATS[idx].label)
      : ["Wisata Santai"],
    preferensi: [],
    waktu: selWaktu,
    radius: selRadius,
    budget: selBudget,
    lokasi_detail: mode === "sk" ? geo.locDetail : undefined,
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#EEEDEA] flex justify-center items-center antialiased selection:bg-[#E1F5EE] selection:text-[#0F6E56] p-0 md:p-6">
      <div
        id="app"
        className="w-full max-w-[430px] md:max-w-[680px] lg:max-w-[840px] h-[100dvh] md:h-[92dvh] md:max-h-[840px] bg-white flex flex-col overflow-hidden relative shadow-2xl md:rounded-3xl transition-all duration-300"
      >
        {/* ── ONBOARDING ── */}
        {screen === "onboarding" && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white animate-fadeIn">
            <header className="flex-shrink-0 px-4 py-3 flex justify-between items-center border-b border-stone-100 z-20 bg-white">
              <div className="flex flex-col items-start select-none">
                <span className="text-lg font-black tracking-tight text-[#0F6E56] leading-none">
                  kongkow<span className="text-[#1D9E75] font-black">.</span>
                </span>
                <span className="text-[8px] font-black text-[#1E56B1] tracking-wider uppercase mt-1 leading-none">
                  didukung oleh AstraPay
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-[#5C5B57] font-mono sm:block hidden">
                  {currentTime}
                </span>
                <a
                  href="https://affandymurad.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-extrabold bg-[#E1F5EE] text-[#0F6E56] hover:bg-[#9FE1CB] px-2.5 py-1 rounded-full tracking-wider font-mono cursor-pointer transition active:scale-95 text-center shrink-0"
                >
                  Affandy Murad
                </a>
              </div>
            </header>

            <TypingCarousel />

            <LocationCard
              mode={mode}
              locName={geo.locName}
              locDetail={geo.locDetail}
              gpsLoading={geo.gpsLoading}
              gpsError={geo.gpsError}
              locParsed={geo.locParsed}
              manualLoc={manualLoc}
              isCollapsed={isLocCollapsed}
              onToggleCollapse={() => setIsLocCollapsed((c) => !c)}
              onModeChange={handleModeChange}
              onManualLocChange={setManualLoc}
              onManualSearch={handleManualSearch}
            />

            <StepWizard
              step={step}
              selCats={selCats}
              selSubs={selSubs}
              selWaktu={selWaktu}
              selRadius={selRadius}
              selBudget={selBudget}
              onToggleCat={toggleCategory}
              onToggleSub={toggleSubChip}
              onSelWaktu={setSelWaktu}
              onSelRadius={setSelRadius}
              onSelBudget={setSelBudget}
              onNext={handleNext}
              onBack={handleBack}
            />
          </div>
        )}

        {/* ── LOADING ── */}
        {screen === "loading" && (
          <LoadingScreen
            currentTime={currentTime}
            loaderText={HUMOROUS_LOADER_TEXTS[loaderIndex]}
          />
        )}

        {/* ── RESULTS ── */}
        {screen === "results" && (
          <ResultsScreen
            headline={headline}
            subHeadline={subHeadline}
            dests={dests}
            error={error}
            currentTime={currentTime}
            locName={geo.locName}
            copiedTextIdx={copiedTextIdx}
            onCopy={handleCopyDestName}
            onRetry={callRadarAI}
            onReset={resetAll}
            onShare={() => setIsShareModalOpen(true)}
          />
        )}

        {/* ── SUCCESS RECEIPT ── */}
        {screen === "success_receipt" && receipt && (
          <SuccessReceipt
            receipt={receipt}
            currentTime={currentTime}
            onBack={() => setScreen("results")}
            onReset={resetAll}
          />
        )}

        {/* ── QR MODAL ── */}
        {showQrModal && qrDest && (
          <QrModal
            dest={qrDest}
            onSimulatePay={simulateQrSuccess}
            onClose={() => setShowQrModal(false)}
          />
        )}
      </div>

      {/* ── SHARE MODAL ── */}
      {isShareModalOpen && dests.length > 0 && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          userInput={activeInput}
          headline={headline}
          sub={subHeadline}
          destinations={dests}
        />
      )}
    </div>
  );
}
