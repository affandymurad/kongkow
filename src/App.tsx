import React, { useState, useEffect } from "react";
import { UserInput, Destination } from "./types";
import { CATS, LOADER_TEXTS } from "./constants";
import { useGeolocation } from "./hooks/useGeolocation";

import Header from "./components/Header";
import LocationCard from "./components/LocationCard";
import StepWizard from "./components/StepWizard";
import LoadingScreen from "./components/LoadingScreen";
import ResultsScreen from "./components/ResultsScreen";
import ShareModal from "./components/ShareModal";

type Screen = "onboarding" | "loading" | "results";

const DEFAULT_WAKTU = "1-2 jam";
const DEFAULT_RADIUS = "15-30 menit";
const DEFAULT_BUDGET = "Standar";

export default function App() {
  const [screen, setScreen] = useState<Screen>("onboarding");
  const geo = useGeolocation();

  const [mode, setMode] = useState<"sk" | "mn">("sk");
  const [isLocCollapsed, setIsLocCollapsed] = useState(true);
  const [manualLoc, setManualLoc] = useState("");

  const [step, setStep] = useState(0);
  const [selCats, setSelCats] = useState<number[]>([]);
  const [selSubs, setSelSubs] = useState<Record<string, number[]>>({});
  const [selWaktu, setSelWaktu] = useState(DEFAULT_WAKTU);
  const [selRadius, setSelRadius] = useState(DEFAULT_RADIUS);
  const [selBudget, setSelBudget] = useState(DEFAULT_BUDGET);

  const [dests, setDests] = useState<Destination[]>([]);
  const [headline, setHeadline] = useState("");
  const [subHeadline, setSubHeadline] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedTextIdx, setCopiedTextIdx] = useState<number | null>(null);

  const [loaderIndex, setLoaderIndex] = useState(0);
  useEffect(() => {
    if (screen !== "loading") { setLoaderIndex(0); return; }
    const iv = setInterval(() => {
      setLoaderIndex((p) => (p + 1) % LOADER_TEXTS.length);
    }, 3000);
    return () => clearInterval(iv);
  }, [screen]);

  useEffect(() => { geo.detectLocation(); }, []);

  const handleModeChange = (m: "sk" | "mn") => {
    setMode(m);
    if (m === "sk") geo.detectLocation();
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLoc.trim()) {
      geo.setLocName(manualLoc.trim());
      geo.setLocDetail("Lokasi diisi manual");
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

  const resetAll = () => {
    setStep(0);
    setSelCats([]);
    setSelSubs({});
    setSelWaktu(DEFAULT_WAKTU);
    setSelRadius(DEFAULT_RADIUS);
    setSelBudget(DEFAULT_BUDGET);
    setDests([]);
    setError(null);
    setScreen("onboarding");
  };

  const activeLocation =
    mode === "mn" && manualLoc.trim() ? manualLoc.trim() : geo.locName;

  const buildPayload = (): UserInput => {
    const moodPayload = selCats.map((idx) => CATS[idx].label);
    const prefPayload: string[] = [];
    Object.entries(selSubs).forEach(([key, arr]) => {
      const [ci, si] = key.split("-").map(Number);
      arr.forEach((chi) => {
        if (CATS[ci]?.subs[si]) prefPayload.push(CATS[ci].subs[si].chips[chi]);
      });
    });
    return {
      lokasi: activeLocation,
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
      if (!res.ok || data.error) {
        throw new Error(data.message || "Rekomendasi belum bisa dimuat. Coba lagi sebentar.");
      }
      setDests(data.destinations || []);
      setHeadline(data.headline || "Rekomendasi untuk kamu");
      setSubHeadline(data.sub || `Di sekitar ${payload.lokasi}`);
    } catch (err: any) {
      setError(err?.message || "Koneksi terputus. Coba lagi.");
    }
    setScreen("results");
  };

  const handleCopyDestName = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTextIdx(idx);
    setTimeout(() => setCopiedTextIdx(null), 2000);
  };

  const activeInput: UserInput = {
    lokasi: activeLocation,
    mood: selCats.length > 0 ? selCats.map((idx) => CATS[idx].label) : ["Santai"],
    preferensi: [],
    waktu: selWaktu,
    radius: selRadius,
    budget: selBudget,
    lokasi_detail: mode === "sk" ? geo.locDetail : undefined,
  };

  return (
    <div className="min-h-[100dvh] bg-paper">
      {screen === "onboarding" && (
        <div className="mx-auto max-w-2xl px-5 pb-32 animate-fadeIn">
          <Header />

          <section className="pt-4 pb-6">
            <h1 className="font-display text-4xl md:text-5xl font-semibold leading-[1.08] tracking-tight text-ink">
              Mau nongkrong<br />di mana hari ini?
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Jawab empat pertanyaan singkat. Kamu dapat enam tempat nyata di
              sekitarmu, lengkap dengan jarak dan cara bayarnya.
            </p>
          </section>

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
            onBack={() => setStep((s) => Math.max(0, s - 1))}
          />
        </div>
      )}

      {screen === "loading" && <LoadingScreen loaderText={LOADER_TEXTS[loaderIndex]} />}

      {screen === "results" && (
        <ResultsScreen
          headline={headline}
          subHeadline={subHeadline}
          dests={dests}
          error={error}
          locName={activeLocation}
          copiedTextIdx={copiedTextIdx}
          onCopy={handleCopyDestName}
          onRetry={callRadarAI}
          onReset={resetAll}
          onShare={() => setIsShareModalOpen(true)}
        />
      )}

      {isShareModalOpen && dests.length > 0 && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          userInput={activeInput}
          destinations={dests}
        />
      )}
    </div>
  );
}
