"use client";
import React from "react";
import { motion } from "framer-motion";
import PixelBlast from "../PixelBlast";

export default function EffectBg() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
      transition={{
        duration: 1.2,
      }}
      className=" pointer-events-auto! fixed overflow-hidden inset-0 z-[0] bg-cover bg-center "
    >
      <div
        id="pixelblast"
        style={{
          pointerEvents: "auto !important",
          opacity: 0.7,
          width: "100%",
          height: "100%",
          position: "",
        }}
      >
        <PixelBlast
          variant="square"
          pixelSize={1}
          color="rgba(170 , 122, 50,1)"
          patternScale={1}
          patternDensity={1}
          pixelSizeJitter={0}
          // enableRipples
          rippleSpeed={0.1}
          rippleThickness={0.4}
          rippleIntensityScale={1.5}
          // liquid
          liquidStrength={0.12}
          liquidRadius={0.4}
          liquidWobbleSpeed={0.5}
          speed={5.5}
          edgeFade={0.4}
          // transparent
          // noiseAmount={0.1}
        />
      </div>
      // Component inspired by github.com/zavalit/bayer-dithering-webgl-demo
    </motion.div>
  );
}
