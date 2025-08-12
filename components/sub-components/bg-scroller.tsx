"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type BgScrollerProps = {
  children?: React.ReactNode;
  top?: string;
  bottom?: string;
};

export default function BgScroller({
  children,
  top = "-80%",
  bottom = "220%",
}: BgScrollerProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [top, bottom]);

  return (
    <div
      ref={ref}
      className="absolute overflow-hidden inset-0 z-[-10] bg-cover bg-center"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-[-1] bg-cover bg-center bg1"
      />
      <div className="absolute inset-0 z-[2] bg-cover bg-center bg-gradient-to-l from-black/35 via-black/0 to-black/35"></div>
      {/* {children} */}
    </div>
  );
}
