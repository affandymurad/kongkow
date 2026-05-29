import { useState, useEffect } from "react";

export function useClock(): string {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const offsetMin = -now.getTimezoneOffset();
      const offsetHrs = offsetMin / 60;
      const offsetSign = offsetHrs >= 0 ? "+" : "";
      setCurrentTime(`${dateStr}, ${hrs}:${mins} (UTC${offsetSign}${offsetHrs})`);
    };
    update();
    const tick = setInterval(update, 10000);
    return () => clearInterval(tick);
  }, []);

  return currentTime;
}
