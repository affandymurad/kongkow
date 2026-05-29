import { useState } from "react";

export interface ParsedAddress {
  jalan?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kodepos?: string;
  negara?: string;
}

export interface GeolocationState {
  gpsLoading: boolean;
  gpsError: string | null;
  locName: string;
  locDetail: string;
  locParsed: ParsedAddress | null;
  detectLocation: () => void;
  setLocName: (name: string) => void;
  setLocDetail: (detail: string) => void;
}

export function useGeolocation(): GeolocationState {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locName, setLocName] = useState<string>("Menteng, Jakarta Pusat");
  const [locDetail, setLocDetail] = useState<string>(
    "Jl. HOS Cokroaminoto, Menteng, Jakarta Pusat"
  );
  const [locParsed, setLocParsed] = useState<ParsedAddress | null>(null);

  const detectLocation = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsLoading(false);
      setGpsError("Browser kamu tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=id`,
            { headers: { "Accept-Language": "id" } }
          );
          if (r.ok) {
            const d = await r.json();
            const a = d.address || {};
            const name =
              a.suburb ||
              a.quarter ||
              a.neighbourhood ||
              a.city_district ||
              a.city ||
              "Lokasi kamu";
            const full = [a.road, a.suburb, a.city_district, a.city || a.county]
              .filter(Boolean)
              .join(", ");

            setLocName(name);
            setLocDetail(full || "Terdeteksi via GPS");
            setGpsError(null);
            setLocParsed({
              jalan: a.road,
              kelurahan:
                a.suburb || a.village || a.neighbourhood || a.quarter,
              kecamatan: a.city_district || a.subdistrict,
              kota: a.city || a.town || a.county || a.municipality,
              provinsi: a.state,
              kodepos: a.postcode,
              negara: a.country || "Indonesia",
            });
          } else {
            setGpsError("Gagal menerjemahkan posisi koordinat GPS.");
          }
        } catch (e) {
          console.warn("Using fallback location.", e);
          setGpsError("Gagal menterjemahkan koordinat lokasi.");
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        console.warn("Geolocation error:", err.code, err.message);
        if (err.code === 1) {
          setGpsError(
            "Akses lokasi diblokir oleh browser / kebijakan keamanan iframe."
          );
        } else if (err.code === 2) {
          setGpsError("Sinyal GPS tidak terdeteksi atau tidak aktif.");
        } else if (err.code === 3) {
          setGpsError("Timeout mencari posisi GPS habis.");
        } else {
          setGpsError("Gagal mendeteksi lokasi otomatis Anda.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return {
    gpsLoading,
    gpsError,
    locName,
    locDetail,
    locParsed,
    detectLocation,
    setLocName,
    setLocDetail,
  };
}
