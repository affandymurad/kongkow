import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { getRecommendations, parseGeminiError, RecommendPayload } from "./src/gemini";

// ─── ESM-safe __dirname ───────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

app.use(express.json());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.options("*", (_req: Request, res: Response) => res.sendStatus(204));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  const raw     = process.env.GEMINI_API_KEY ?? "";
  const key     = raw.replace(/^"|"$/g, "").trim();
  const isValid = !!key && !["MY_GEMINI_API_KEY", "your_gemini_api_key_here", ""].includes(key);
  res.json({
    status    : "ok",
    gemini_key: isValid ? "✓ terkonfigurasi" : "✗ belum diisi",
    timestamp : new Date().toISOString(),
  });
});

// ─── Recommend ────────────────────────────────────────────────────────────────
app.post("/api/recommend", async (req: Request, res: Response) => {
  const body: RecommendPayload = req.body;

  console.log(`[${new Date().toISOString()}] → /api/recommend  lokasi="${body.lokasi}" budget="${body.budget}"`);

  try {
    const { data } = await getRecommendations(body);
    console.log(`[${new Date().toISOString()}] ✓ Gemini OK — ${data.destinations?.length ?? 0} destinasi`);
    return res.json(data);
  } catch (err: unknown) {
    const msg = parseGeminiError(err);
    console.warn(`[recommend] ✗ ${msg.split("\n")[0]}`);

    // Kembalikan error terstruktur ke frontend — bukan fallback data
    return res.status(503).json({
      error: true,
      code : "GEMINI_UNAVAILABLE",
      message: msg.includes("belum diisi") || msg.includes("not valid") || msg.includes("INVALID_ARGUMENT")
        ? "API key Gemini tidak valid. Isi GEMINI_API_KEY yang benar di file .env."
        : "Gagal menghubungi Gemini AI. Coba beberapa saat lagi.",
    });
  }
});

// ─── Static (production) ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req: Request, res: Response) =>
    res.sendFile(path.join(distPath, "index.html"))
  );
}

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  const raw     = process.env.GEMINI_API_KEY ?? "";
  const key     = raw.replace(/^"|"$/g, "").trim();
  const isValid = !!key && !["MY_GEMINI_API_KEY", "your_gemini_api_key_here", ""].includes(key);

  console.log(`\n⚡ Kongkow backend  →  http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY  :  ${isValid
    ? "✓ terkonfigurasi"
    : "✗ BELUM DIISI — isi .env dengan key dari https://aistudio.google.com/apikey"
  }`);
  console.log(`   Health check    :  http://localhost:${PORT}/api/health\n`);
});
