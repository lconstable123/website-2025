"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type MidScrollerProps = {
  children: React.ReactNode;
  fromY?: number;
  toY?: number;
};

export default function MidScroller({
  children,
  fromY = -100,
  toY = 100,
}: MidScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [fromY, toY]);

  return (
    <div ref={ref} className="relative w-full h-[200vh]">
      <motion.div
        style={{ y }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none -z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
