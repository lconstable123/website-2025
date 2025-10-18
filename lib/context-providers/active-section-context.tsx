"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";
import { SectionNameType } from "../utils/types";
import { useScreenContext } from "./screen-context";

type ActiveContextProviderProps = {
  children: React.ReactNode;
};

type ActiveSectionContextType = {
  activeSection: SectionNameType;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionNameType>>;
  timeOfLastClick: number;
  setTimeOfLastClick?: React.Dispatch<React.SetStateAction<number>>;
  profileClicked: number;
  setProfileClicked: React.Dispatch<React.SetStateAction<number>>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scrollToElement: () => void;
};

export const ActiveSectionContext =
  createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({
  children,
}: ActiveContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionNameType>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);
  const [profileClicked, setProfileClicked] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useScreenContext();
  const scrollToElement = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // toast.error("Scroll reference is not set.");
    }
  };

  useEffect(() => {
    // toast.success(activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (profileClicked > 1) {
      if (!isMobile) {
        // toast.success("scrolling to element");
        scrollToElement();
      }
      // toast.success("NOT scrolling to element");
    }
  }, [profileClicked]);

  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
        profileClicked,
        setProfileClicked,
        scrollRef,
        scrollToElement,
      }}
    >
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error(
      "useActiveSection must be used within an ActiveSectionContextProvider"
    );
  }
  return context;
}
