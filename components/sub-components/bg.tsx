"use client";
import React from "react";
import { motion } from "framer-motion";
export default function Bg() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      transition={{
        duration: 1.2,
      }}
      className="fixed overflow-hidden inset-0 z-[-10] bg-cover bg-center"
    >
      <div
        className="absolute inset-0  bg-cover bg-center  bg-black/30 z-0  opacity-100
      "
      />
      <div
        className="absolute inset-0 z-[-1] bg-cover bg-center  bg1  opacity-100
      "
      />

      <div className="absolute inset-0 z-[2] bg-cover bg-center bg-gradient-to-l from-black/35 sm:via-black/0 to-black/35" />
    </motion.div>
  );
}
