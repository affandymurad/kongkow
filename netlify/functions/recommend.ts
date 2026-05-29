import type { Handler, HandlerEvent } from "@netlify/functions";
import { getRecommendations, parseGeminiError, RecommendPayload } from "../../backend/src/gemini";

const CORS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST")    return { statusCode: 405, body: "Method Not Allowed" };

  const body: RecommendPayload = JSON.parse(event.body || "{}");

  try {
    const { data } = await getRecommendations(body);
    return { statusCode: 200, headers: CORS, body: JSON.stringify(data) };
  } catch (err: unknown) {
    const msg = parseGeminiError(err);
    console.warn(`[netlify/recommend] ✗ ${msg.split("\n")[0]}`);
    return {
      statusCode: 503,
      headers: CORS,
      body: JSON.stringify({
        error  : true,
        code   : "GEMINI_UNAVAILABLE",
        message: msg.includes("belum diisi") || msg.includes("not valid") || msg.includes("INVALID_ARGUMENT")
          ? "API key Gemini tidak valid. Periksa environment variable GEMINI_API_KEY."
          : "Gagal menghubungi Gemini AI. Coba beberapa saat lagi.",
      }),
    };
  }
};
