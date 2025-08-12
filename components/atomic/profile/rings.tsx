"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Rings({
  roundstyling = "rounded-full",
  baseSizeX = 310,
  baseSizeY = 310,
}: {
  pressed?: boolean;
  roundstyling?: string;
  baseSizeX?: number;
  baseSizeY?: number;
}) {
  const ringAmt = 10;
  const rings = Array.from({ length: ringAmt }, (_, i) => i);
  const increment = 40;
  // const baseSizeX = 310;
  // const baseSizeY = 310;
  const duration = 2.7;
  const ratio = duration / ringAmt;

  return (
    <div className="   w-screen h-400 absolute-center overflow-hidden -z-2 pointer-events-none">
      <div className={`ease-out  flex items-center justify-center opacity-60`}>
        {rings.map((i) => {
          const sizeX = baseSizeX + i * increment;
          const sizeY = baseSizeY + i * increment;

          return (
            <motion.div
              key={i}
              className={` absolute-center  scale-50 sm:scale-100   border border-white/30 ${roundstyling}`}
              style={{
                height: `${sizeY}px`,
                width: `${sizeX}px`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [1, 1.2, 1.1],
              }}
              initial={{
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 0.0,
                delay: i * ratio,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
