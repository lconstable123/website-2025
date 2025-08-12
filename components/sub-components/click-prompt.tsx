"use client";
import React, { useEffect } from "react";

import { useInitialAnimation } from "../../lib/hooks/animation-hooks";
import { motion } from "framer-motion";

export default function ClickPrompt({
  delay = 1,
  text = "tap to enter",
  trigger = false,
}: {
  delay?: number;
  text?: string;
  trigger?: boolean;
}) {
  const { controls } = useInitialAnimation(0.1, 0, trigger);

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "tween", duration: 0.5, delay: 0.5 },
    });
  }, []);
  return (
    <motion.h1
      className="cursor-pointer absolute -bottom-23 left-1/2 -translate-x-1/2 text-white/90 text-center text-[13pt] sm:text-[15pt] tracking-wider font-light"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={controls}
    >
      {text}
    </motion.h1>
  );
}
