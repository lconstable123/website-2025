"use client";

import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type ScreenContextType = {
  isMobile: boolean;
  isLandscape: boolean;
  isMobileLandscape: boolean;
};
export const ScreenContext = React.createContext<ScreenContextType | null>(
  null
);

export default function ScreenContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //---------------------screencontext store
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const isMobileLandscape = isMobile && isLandscape;
  const getScreensize = () => {
    const mobile = window.innerWidth < 768;
    const landscape = window.matchMedia("(orientation: landscape)").matches;
    setIsMobile(mobile);
    setIsLandscape(landscape);

    return { mobile, landscape };
  };

  useEffect(() => {
    const handleResize = () => {
      const { mobile, landscape } = getScreensize();
      // toast.success(`Mobile: ${mobile} Landscape: ${landscape}`);
    };

    window.addEventListener("resize", handleResize);
    getScreensize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ScreenContext.Provider
      value={{
        isMobile,
        isLandscape,
        isMobileLandscape,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
}

export function useScreenContext() {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error(
      "useScreenContext must be used within a ScreenContextProvider"
    );
  }
  return context;
}
