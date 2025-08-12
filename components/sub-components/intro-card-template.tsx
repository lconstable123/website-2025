"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
export default function IntroCardTemplate({
  children,
  rounded = "rounded-3xl",
  secondaryRounded = "rounded-2xl",
  outline = false,
  shadow = "dark",
  canSelect = false,
}: {
  children: React.ReactNode;
  rounded?: string;
  secondaryRounded?: string;
  outline?: boolean;
  shadow?: "light" | "dark";
  canSelect?: boolean;
}) {
  return (
    <>
      <div
        className={clsx(
          "  transition-outline duration-600 flex items-center justify-center  border-gray-800 bg-gray-950",
          shadow === "dark"
            ? " shadow-xl shadow-black/30"
            : " shadow-[0_0_30px_rgba(255,255,255,1)] shadow-white/10",
          outline
            ? "relative  border-5 outline-2 outline-yellow-700 hover:outline-yellow-500  "
            : canSelect
              ? "outline-yellow-700/10 border-2 outline-2 hover:outline-yellow-700/90 "
              : "outline-yellow-700/10 border-2 outline-2",
          rounded
        )}
      >
        <div
          className={`m-[6px] ${secondaryRounded} border-1   border-yellow-900/50 overflow-hidden  text-white styleDark  vLines sm:vLines flex-grow`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
