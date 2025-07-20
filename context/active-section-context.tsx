"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import toast from "react-hot-toast";
import { SectionNameType } from "../lib/types";

type ActiveContextProviderProps = {
  children: React.ReactNode;
};

type ActiveSectionContextType = {
  activeSection: SectionNameType;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionNameType>>;
  timeOfLastClick: number;
  setTimeOfLastClick?: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSectionContext =
  createContext<ActiveSectionContextType | null>(null);

export default function ActiveSectionContextProvider({
  children,
}: ActiveContextProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionNameType>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0);
  //   useEffect(() => {
  //     toast.success(activeSection);
  //   }, [activeSection]);
  return (
    <ActiveSectionContext.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
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
