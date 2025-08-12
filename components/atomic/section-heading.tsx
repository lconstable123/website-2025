"use client";
import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "../sub-components/intro-card-template";

type SectionType = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionType) {
  return (
    <motion.h2
      className=" w-full text-white text-2xl font-medium text-center tracking-widest capitalize mt-70 mb-0   py-1"
      initial={{ opacity: 0, y: 50 }}
      // animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.9 }}
    >
      <div className="w-screen h-2"></div>
      <IntroCardTemplate rounded="rounded-3xl" secondaryRounded="rounded-xl">
        <div className=" text-center text-2xl  Text-secondary text-white my-4 mx-4 uppercase tracking-widest  font-medium leading-tight  ">
          {children}
        </div>
      </IntroCardTemplate>
    </motion.h2>
  );
}
