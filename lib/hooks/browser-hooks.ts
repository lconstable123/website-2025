import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";

export function useOptimizedVideoSource(highSrc: string, lowSrc: string) {
  // Always serve the lighter file to avoid buffering/stalling on large clips.
  const [selectedSrc, setSelectedSrc] = useState(lowSrc);
  const [res, setRes] = useState("low");
  useEffect(() => {
    setRes("low");
    setSelectedSrc(lowSrc);
  }, [highSrc, lowSrc]);

  return { selectedSrc, res };
}
