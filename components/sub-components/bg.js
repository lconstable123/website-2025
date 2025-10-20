"use client";
import React from "react";
import { motion } from "framer-motion";
import PixelBlast from "../PixelBlast";

export default function Bg() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      transition={{
        duration: 1.2,
      }}
      className=" pointer-events-auto! fixed overflow-hidden inset-0 z-[-2] bg-cover bg-center "
    >
      // Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
      <div
        className="pointer-events-none absolute inset-0  bg-cover bg-center  bg-black/0.2 z-0  opacity-100
      "
      />
      <div
        className="pointer-events-none absolute inset-0 z-[-1] bg-cover bg-center  bg1  opacity-90
      "
      />
      {/* <div className="pointer-events-none absolute inset-0 z-[2] bg-cover bg-center bg-gradient-to-l from-black/35 sm:via-black/0 to-black/35" /> */}
    </motion.div>
  );
}
