import React, { useEffect } from "react";
import { useActiveSection } from "../context/active-section-context";
import { useInView } from "react-intersection-observer";
import { SectionNameType } from "./types";
import toast from "react-hot-toast";

export function useSectionInView(
  SectionName: SectionNameType,
  threshold: number = 0.75
) {
  const { ref, inView } = useInView({ threshold });
  const { activeSection, setActiveSection, timeOfLastClick } =
    useActiveSection();

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection((prev) => {
        if (prev === SectionName) {
          return prev; // No change if already active
        }
        // toast.success(`Section changed to: ${SectionName}`);
        return SectionName;
      });
    }
  }, [inView, setActiveSection, timeOfLastClick]);

  return { ref };
}
