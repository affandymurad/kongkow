import React, { useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Copy, Download, Check, Share2 } from "lucide-react";
import { Destination, UserInput } from "../types";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInput: UserInput;
  destinations: Destination[];
}

const INK = "#231e17";
const MUTED = "#6e665a";
const LINE = "#ddd4c4";
const ACCENT = "#b4451f";
const PAPER = "#f6f1e7";

const appUrl = () => {
  try {
    return window.location.origin + window.location.pathname;
  } catch {
    return "";
  }
};

export default function ShareModal({ isOpen, onClose, userInput, destinations }: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const inviteText = () => {
    let text = `Ada ${destinations.length} tempat nongkrong di ${userInput.lokasi} yang bisa kita datangi.\n`;
    text += `Suasana: ${userInput.mood.join(", ")}. Budget ${userInput.budget.toLowerCase()}, waktu ${userInput.waktu.toLowerCase()}.\n\n`;
    destinations.forEach((dest, i) => {
      text += `${i + 1}. ${dest.name} (${dest.area})\n`;
      text += `   ${dest.distance} · ${dest.price_range}\n`;
    });
    text += `\nPilih yang mana, dan kapan kita berangkat?\n\nCari tempat versimu sendiri: ${appUrl()}`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(inviteText());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText())}`, "_blank");
  };

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Rekomendasi Kongkow", text: inviteText(), url: appUrl() });
      } catch {
        /* dibatalkan pengguna */
      }
    } else {
      handleWhatsApp();
    }
  };

  useEffect(() => {
    if (!isOpen || !canvasRef.current || destinations.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const rowH = 96;
    const headerH = 150;
    const footerH = 120;
    const height = headerH + destinations.length * rowH + footerH;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const clip = (t: string, max: number) => (t.length > max ? t.slice(0, max - 1) + "…" : t);

    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, width, height);

    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    ctx.fillStyle = INK;
    ctx.font = "700 30px Fraunces, Georgia, serif";
    ctx.fillText("kongkow", 40, 62);
    const w = ctx.measureText("kongkow").width;
    ctx.fillStyle = ACCENT;
    ctx.fillText(".", 40 + w, 62);

    ctx.fillStyle = MUTED;
    ctx.font = "500 14px 'Instrument Sans', system-ui, sans-serif";
    ctx.fillText(clip(`${userInput.lokasi} · ${userInput.mood.join(", ")}`, 60), 40, 92);
    ctx.fillText(`${userInput.waktu} · ${userInput.radius} · ${userInput.budget}`, 40, 114);

    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, headerH - 10);
    ctx.lineTo(width - 40, headerH - 10);
    ctx.stroke();

    let y = headerH + 10;
    destinations.forEach((dest, i) => {
      ctx.fillStyle = ACCENT;
      ctx.font = "600 22px Fraunces, Georgia, serif";
      ctx.fillText(String(i + 1), 40, y + 24);

      ctx.fillStyle = INK;
      ctx.font = "600 18px Fraunces, Georgia, serif";
      ctx.fillText(clip(dest.name, 42), 76, y + 24);

      ctx.fillStyle = MUTED;
      ctx.font = "500 13px 'Instrument Sans', system-ui, sans-serif";
      ctx.fillText(clip(dest.area, 60), 76, y + 46);
      ctx.fillText(clip(`${dest.distance} · ${dest.duration} · ${dest.price_range}`, 70), 76, y + 66);

      y += rowH;
    });

    ctx.strokeStyle = LINE;
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 40, y);
    ctx.stroke();

    ctx.fillStyle = MUTED;
    ctx.font = "500 13px 'Instrument Sans', system-ui, sans-serif";
    ctx.fillText("Pindai untuk cari tempat versimu", 40, y + 40);
    ctx.fillText("Kongkow oleh Affandy Murad", 40, y + 62);

    QRCode.toDataURL(appUrl() || "https://affandymurad.github.io", {
      margin: 1,
      width: 160,
      color: { dark: INK, light: PAPER },
    })
      .then((dataUrl) => {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, width - 40 - 72, y + 18, 72, 72);
        img.src = dataUrl;
      })
      .catch((err) => console.error("Gagal membuat QR", err));
  }, [isOpen, destinations, userInput]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `kongkow-${userInput.lokasi.replace(/\s+/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImageToClipboard = () => {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      } catch {
        handleDownload();
      }
    });
  };

  if (!isOpen) return null;

  const btnDark =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink/85 transition cursor-pointer";
  const btnLine =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:border-ink/40 transition cursor-pointer";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-ink/60 p-3 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Ajak teman"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-card grid grid-cols-1 md:grid-cols-2 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-paper md:border-r border-b md:border-b-0 border-line">
          <p className="text-sm font-semibold text-muted mb-3">Gambar ringkasan</p>
          <div className="max-h-[440px] overflow-auto rounded-lg border border-line bg-white">
            <canvas ref={canvasRef} className="max-w-full block" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={handleDownload} className={btnDark}>
              <Download size={14} /> Simpan PNG
            </button>
            <button onClick={copyImageToClipboard} className={btnLine}>
              {copiedImage ? <Check size={14} /> : <Copy size={14} />}
              {copiedImage ? "Tersalin" : "Salin gambar"}
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold">Ajak teman</h3>
              <p className="mt-1 text-sm text-muted">
                Kirim daftar ini ke grup supaya langsung bisa dipilih bareng.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-lg p-1.5 text-muted hover:text-ink cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <pre className="mt-4 h-52 overflow-y-auto whitespace-pre-wrap rounded-lg border border-line bg-paper p-3.5 font-sans text-sm leading-relaxed text-ink/85">
            {inviteText()}
          </pre>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={handleCopyText} className={btnLine}>
              {copiedText ? <Check size={14} /> : <Copy size={14} />}
              {copiedText ? "Tersalin" : "Salin teks"}
            </button>
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition cursor-pointer"
            >
              Kirim ke WhatsApp
            </button>
            <button onClick={handleSystemShare} className={btnDark}>
              <Share2 size={14} /> Lainnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
