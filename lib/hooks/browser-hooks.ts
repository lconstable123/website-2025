import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useOptimizedVideoSource(
  highSrc: string,
  lowSrc: string,
  isMobile: boolean = false,
) {
  // Serve the lighter mobile file on phones, the low-desktop file otherwise.
  const pick = (mobile: boolean) => (mobile ? lowSrc : highSrc);
  const [selectedSrc, setSelectedSrc] = useState(() => pick(isMobile));
  const [res, setRes] = useState(isMobile ? "mobile" : "low");
  useEffect(() => {
    setRes(isMobile ? "mobile" : "low");
    setSelectedSrc(pick(isMobile));
  }, [highSrc, lowSrc, isMobile]);

  return { selectedSrc, res };
}
