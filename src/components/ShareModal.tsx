import React, { useRef, useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Copy, Download, Check, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Destination, UserInput } from "../types";
import AstraPayLogo from "./AstraPayLogo";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userInput: UserInput;
  headline: string;
  sub: string;
  destinations: Destination[];
}

export default function ShareModal({
  isOpen,
  onClose,
  userInput,
  headline,
  sub,
  destinations,
}: ShareModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  // Generate localized group invitation text
  const getWhatsAppTemplate = () => {
    let appUrl = "https://ais-pre-nzsbs3kdqmdp6omathqyhn-910172244662.asia-southeast1.run.app";
    try {
      if (typeof window !== "undefined" && window.location) {
        const origin = window.location.origin;
        if (origin && !origin.includes("srcdoc") && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
          appUrl = origin + window.location.pathname;
        }
      }
    } catch (e) {
      console.warn("Could not parse location:", e);
    }

    let text = `📣 *OI NONGKI KUY! BIAR KAGAK GABUT!* 📣\n`;
    text += `Gw baru nge-radar spot asyik di daerah *${userInput.lokasi}*.\n\n`;
    text += `👉 *Mood:* ${userInput.mood.join(", ") || "Santai bersama"}\n`;
    text += `👉 *Budget:* ${userInput.budget}\n`;
    text += `👉 *Waktu:* ${userInput.waktu} (${userInput.radius})\n\n`;
    text += `Berikut 3 rekomendasi ter-mbois pilihan kita:\n\n`;

    destinations.forEach((dest, i) => {
      text += `${dest.emoji} *${dest.name}* (${dest.area})\n`;
      text += `• Estimasi: ${dest.price_range} | ${dest.distance}\n`;
      text += `• Tips: _"${dest.tip}"_\n\n`;
    });

    text += `Kira-kira jadi gasken jam berapa nih? Balas di grup yaw! 🚀\n\n`;
    text += `Coba cari spot nongkrong seru versimu sendiri di sini:\n🔗 ${appUrl}`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(getWhatsAppTemplate());
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleWAChating = () => {
    const text = getWhatsAppTemplate();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleSystemShare = async () => {
    const text = getWhatsAppTemplate();
    let appUrl = "https://ais-pre-nzsbs3kdqmdp6omathqyhn-910172244662.asia-southeast1.run.app";
    try {
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        if (!window.location.origin.includes("srcdoc")) {
          appUrl = window.location.origin + window.location.pathname;
        }
      }
    } catch (_) {}

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rekomendasi Kongkow - Anti Wacana",
          text: text,
          url: appUrl,
        });
      } catch (err) {
        console.log("Native share result/cancelled", err);
      }
    } else {
      handleWAChating();
    }
  };

  // Draw the custom boarding pass / receipt ticket on Canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current || destinations.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = 600;
    const height = 210 + destinations.length * 165 + 155;

    // Adjust size for high PPI screens
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Helper to draw rounded rectangles compatible with all platforms
    const drawRoundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Helper for beautiful text wrapping on canvas (prevents cutting word mid-way)
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number = 2) => {
      const words = text.split(" ");
      let line = "";
      let lineCount = 0;
      
      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + " ";
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, x, y + lineCount * lineHeight);
          line = words[n] + " ";
          lineCount++;
          if (lineCount >= maxLines) {
            ctx.fillText("...", x + ctx.measureText(line.trim() + " ").width, y + (lineCount - 1) * lineHeight);
            return;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y + lineCount * lineHeight);
    };

    // 1. Background (warm paper color)
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, width, height);

    // 2. Vintage coupon dotted border
    ctx.strokeStyle = "#5A5A40";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(15, 15, width - 30, height - 30);
    ctx.setLineDash([]);

    // 3. Header Ticket Lines & Title
    ctx.fillStyle = "#5A5A40"; // Sage green theme
    ctx.fillRect(25, 25, width - 50, 75);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BOARDING PASS: KONGKOW", width / 2, 60);

    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("OFFICIAL OUTING RADAR VOUCHER", width / 2, 85);

    // 4. Ticket Metadata Fields (Symmetrical 3 columns grid)
    ctx.fillStyle = "#2D2A26";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    // Column 1
    ctx.fillText("LOKASI PUSAT:", 45, 140);
    ctx.font = "bold 14px sans-serif";
    const shortLokasi = userInput.lokasi.length > 20 ? userInput.lokasi.slice(0, 18) + "..." : userInput.lokasi;
    ctx.fillText(shortLokasi, 45, 160);

    // Column 2
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("EST. BUDGET:", 250, 140);
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(userInput.budget, 250, 160);

    // Column 3
    ctx.textAlign = "right";
    ctx.font = "bold 10px sans-serif";
    ctx.fillText("WAKTU / RADIUS:", width - 45, 140);
    const shortWaktu = `${userInput.waktu} / ${userInput.radius}`;
    // Dynamically adjust font size to make sure "waktu/radius" info is never cut off
    const fs = shortWaktu.length > 25 ? "10px" : shortWaktu.length > 20 ? "11px" : shortWaktu.length > 16 ? "12px" : "14px";
    ctx.font = `bold ${fs} sans-serif`;
    ctx.fillText(shortWaktu, width - 45, 160);

    // Reset alignment to left for following operations
    ctx.textAlign = "left";

    // Draw horizontal dashed divider
    ctx.strokeStyle = "#DCDCDC";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(35, 185);
    ctx.lineTo(width - 35, 185);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Draw 3 destinations elegantly in separated rounded containers
    let currentY = 210;
    destinations.forEach((dest) => {
      // Draw Box Container Background for each spot
      ctx.fillStyle = "#FCFAFB";
      drawRoundRect(35, currentY - 10, width - 70, 145, 16);
      ctx.fill();
      ctx.strokeStyle = "#E6E3DB";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Emoji Circular Badge Backing
      ctx.fillStyle = "#EBE8DF";
      ctx.beginPath();
      ctx.arc(68, currentY + 18, 22, 0, Math.PI * 2);
      ctx.fill();

      // Emoji text
      ctx.font = "24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dest.emoji, 68, currentY + 18);
      ctx.textBaseline = "alphabetic";

      // Destination Name
      ctx.textAlign = "left";
      ctx.fillStyle = "#1E1D19";
      ctx.font = "bold 16px sans-serif";
      const nameText = dest.name.length > 32 ? dest.name.slice(0, 30) + "..." : dest.name;
      ctx.fillText(nameText, 105, currentY + 15);

      // Area (greyed subtitle)
      ctx.font = "500 12px sans-serif";
      ctx.fillStyle = "#706E66";
      ctx.fillText(dest.area, 105, currentY + 34);

      // Pill 1: Price Range
      const pill1_x = 105;
      const pill1_y = currentY + 45;
      const pill1_w = 115;
      const pill1_h = 22;
      ctx.fillStyle = "#E9F5F1"; // Soft green
      drawRoundRect(pill1_x, pill1_y, pill1_w, pill1_h, 6);
      ctx.fill();
      
      ctx.fillStyle = "#0F6E56"; // Rich green text
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dest.price_range, pill1_x + pill1_w / 2, pill1_y + pill1_h / 2);

      // Pill 2: Distance
      const pill2_x = 228;
      const pill2_y = currentY + 45;
      const pill2_w = 95;
      const pill2_h = 22;
      ctx.fillStyle = "#F5F3EB"; // Soft sand/grey
      drawRoundRect(pill2_x, pill2_y, pill2_w, pill2_h, 6);
      ctx.fill();
      
      ctx.fillStyle = "#5A5A40"; // Warm grey text
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(dest.distance, pill2_x + pill2_w / 2, pill2_y + pill2_h / 2);

      // Destination tip
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#33322E";
      ctx.font = "italic 11px sans-serif";
      
      const tipLabel = `💡 Tips: "${dest.tip}"`;
      wrapText(tipLabel, 105, currentY + 78, 410, 16, 2);

      currentY += 165;
    });

    // 6. Footer section (Cut here dash with scissors metaphor)
    ctx.strokeStyle = "#5A5A40";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(25, currentY + 10);
    ctx.lineTo(width - 25, currentY + 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // 7. Real QR Code Generator for easy dynamic scanning
    const qrX = 45;
    const qrY = currentY + 24;
    const qrSize = 60; // dimension of QR Code
    
    // Draw QR Code Background
    ctx.fillStyle = "#FFFFFF";
    drawRoundRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 10);
    ctx.fill();
    ctx.strokeStyle = "#E6E3DB";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Static url QR code as requested
    const qrUrl = "https://affandymurad.github.io";

    // Real QR Code Generator and AstraPay Logo drawing
    const logoSize = 42;
    const logoX = width - 45 - logoSize;
    const logoY = qrY + 8;

    // Draw custom receipt metadata alongside the QR Code
    ctx.fillStyle = "#5A5A40";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("KONGKOW-OUTING-PLANNER-2026", 135, qrY + 10);
    ctx.font = "italic bold 9px sans-serif";
    ctx.fillText("dibuat oleh Affandy Murad", 135, qrY + 24);
    ctx.fillText("didukung oleh AstraPay", 135, qrY + 38);

    QRCode.toDataURL(qrUrl, {
      margin: 1,
      width: 120, // High density image representation
      color: {
        dark: "#2D2A26",
        light: "#FFFFFF"
      }
    }).then((dataUrl) => {
      // Draw QR Code
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      };
      img.src = dataUrl;

      // Draw modern vector AstraPay logo from hidden DOM container
      const logoSvgString = logoContainerRef.current?.innerHTML;
      if (logoSvgString) {
        const svgBlob = new Blob([logoSvgString], { type: "image/svg+xml;charset=utf-8" });
        const logoUrl = URL.createObjectURL(svgBlob);
        const logoImg = new Image();
        logoImg.onload = () => {
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          URL.revokeObjectURL(logoUrl);
        };
        logoImg.src = logoUrl;
      }
    }).catch((err) => {
      console.error("Gagal generate QR Code real:", err);
    });

  }, [isOpen, destinations, userInput]);

  // Download logic
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `Tiket-Kongkow-${userInput.lokasi.replace(/\s+/g, "-")}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImageToClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        } catch (err) {
          console.error("Gagal salin gambar", err);
          // Fallback
          handleDownload();
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          {/* Overlay to close */}
          <div className="absolute inset-0" onClick={onClose}></div>

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative z-10 w-full max-w-5xl bg-white rounded-3xl md:rounded-[32px] shadow-2xl overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-12 pointer-events-auto border border-[#E5E5DF] max-h-[92vh] md:max-h-none my-auto"
          >
            {/* Left side: Canvas preview */}
            <div className="md:col-span-6 p-6 bg-[#F5F5F0] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#E5E5DF]">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5A5A40] bg-white border border-[#E5E5DF] px-3.5 py-1.5 rounded-full mb-4 shadow-2xs">
                🎟️ Preview Tiket Kelompok
              </span>

              {/* Shadowed Card Container */}
              <div className="w-full overflow-auto max-h-[480px] p-2 bg-white rounded-2xl border border-[#E5E5DF] shadow-inner flex justify-center">
                <canvas
                  ref={canvasRef}
                  id="ticket-canvas"
                  className="max-w-full rounded-md shadow bg-stone-100"
                ></canvas>
              </div>

              <div className="mt-4 flex gap-3 w-full justify-center">
                <button
                  id="btn-download-ticket"
                  onClick={handleDownload}
                  className="flex items-center gap-2 justify-center py-2.5 px-4.5 rounded-full text-xs font-bold bg-[#2D2A26] text-white shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  <Download size={14} />
                  Simpan Gambar PNG
                </button>
                <button
                  id="btn-copy-ticket-img"
                  onClick={copyImageToClipboard}
                  className="flex items-center gap-2 justify-center py-2.5 px-4.5 rounded-full text-xs font-bold bg-[#5A5A40] text-white shadow-xs hover:opacity-90 transition cursor-pointer"
                >
                  <Share2 size={14} />
                  {copiedImage ? "Tersalin!" : "Salin Gambar"}
                </button>
              </div>
            </div>

            {/* Right side: Action list & template text */}
            <div className="md:col-span-6 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-[#2D2A26]">
                      Bagikan Ajakan Nongki
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Kirim ke grup WhatsApp atau Telegram biar wacana nongki
                      kamu langsung deal!
                    </p>
                  </div>
                  <button
                    id="btn-close-share-modal"
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-[#F5F5F0] text-stone-400 hover:text-[#2D2A26] transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* WhatsApp template text preview area */}
                <div className="relative mt-6">
                  <span className="absolute -top-3 left-4 text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 border border-[#E5E5DF] text-[#5A5A40] rounded-full">
                    Template Undangan No-Wacana
                  </span>
                  <div className="w-full bg-[#F5F5F0] border border-[#E5E5DF] rounded-2xl p-4 pt-6 h-[220px] overflow-y-auto text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {getWhatsAppTemplate()}
                  </div>
                </div>

                {/* Actions row under template */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    id="btn-copy-invite-text"
                    onClick={handleCopyText}
                    className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#5A5A40] hover:opacity-90 transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check size={14} />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Salin Teks
                      </>
                    )}
                  </button>

                  <button
                    id="btn-wa-share"
                    onClick={handleWAChating}
                    className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.515 2.26 2.268 3.504 5.282 3.502 8.492-.005 6.66-5.341 11.997-11.953 11.997-2.005-.001-3.973-.5-5.741-1.455L0 24zm6.208-3.822l.334.198c1.65.98 3.655 1.498 5.617 1.499h.005c5.623 0 10.198-4.577 10.202-10.202.002-2.724-1.061-5.285-2.993-7.219C17.513 2.52 14.957 1.458 12.235 1.458c-5.614 0-10.187 4.574-10.191 10.197-.001 1.96.51 3.878 1.48 5.514l.217.365-1.04 3.794 3.844-1.008zm11.397-7.402c-.31-.156-1.833-.905-2.115-1.008-.28-.102-.486-.156-.69.156-.202.31-.784 1.008-.962 1.21-.177.203-.355.228-.664.072-1.127-.565-1.889-1.025-2.636-2.316-.197-.339-.197-.549-.071-.741.113-.172.28-.31.42-.465.14-.156.186-.266.28-.445.093-.178.046-.339-.023-.493-.07-.156-.69-1.663-.946-2.28-.25-.601-.504-.52-.69-.53l-.504-.01c-.173 0-.455.064-.693.315-.24.251-.912.89-.912 2.17 0 1.28.932 2.51 1.06 2.685.127.172 1.83 2.793 4.433 3.911.619.266 1.102.425 1.48.545.623.197 1.187.169 1.634.103.498-.073 1.834-.75 2.091-1.439.255-.689.255-1.28.178-1.4-.077-.122-.28-.192-.591-.349z"/>
                    </svg>
                    <span>Kirim WA</span>
                  </button>

                  <button
                    id="btn-system-share"
                    onClick={handleSystemShare}
                    className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#0F6E56] hover:bg-[#084A39] transition active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>Lainnya</span>
                  </button>
                </div>
              </div>

              {/* Tips for action */}
              <div className="mt-6 bg-[#FAF6EE] border border-[#E5E5DF] rounded-2xl p-4">
                <h4 className="font-bold text-xs text-[#5A5A40] flex items-center gap-1.5 mb-1.5 font-sans uppercase tracking-wider">
                  💡 Tips Kongkow Menolak Wacana:
                </h4>
                <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                  <li>Undangan yang detail dengan jam-duration memicu persentase sukses 85% lebih tinggi.</li>
                  <li>Salin teks & posting gambarnya bersamaan di grup keluarga/circle andalan.</li>
                  <li>Langsung tentukan waktu gasken biar ga sekadar jadi wacana abadi!</li>
                </ul>
              </div>
            </div>
          </motion.div>
          {/* Off-screen hidden SVG container for high-fidelity canvas rendering of AstraPayLogo */}
          <div ref={logoContainerRef} style={{ display: "none", position: "absolute", left: -9999, top: -9999 }}>
            <AstraPayLogo size={160} />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
