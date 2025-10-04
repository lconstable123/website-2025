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
          "  transition-outline duration-600 flex items-center justify-center border-4  border-gray-900 bg-gray-950",
          shadow === "dark"
            ? " shadow-xl shadow-black/30"
            : " shadow-[0_0_30px_rgba(255,255,255,1)] shadow-white/10",
          outline
            ? "relative   outline-2 outline-yellow-900/70 hover:outline-yellow-600  "
            : canSelect
              ? "outline-yellow-900/70 border-3 outline-2 hover:outline-yellow-700 "
              : "outline-yellow-900/70 border-3 outline-2 ",
          rounded
        )}
      >
        <div
          className={`m-[4px] ${secondaryRounded}   border-yellow-900/50 overflow-hidden  text-white styleDark  vLines sm:vLines flex-grow`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
