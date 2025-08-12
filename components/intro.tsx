"use client";

import React from "react";
import { motion } from "framer-motion";

import { useSectionInView } from "../lib/hooks/hooks";

import IntroCard from "./intro-card";

export default function Intro({ mt = "" }: { mt?: string }) {
  const { ref } = useSectionInView("Home", 0.2);
  // const { controls } = useInitialAnimation(0.4);
  // Assuming you want to use the first project for the intro
  return (
    <section className={`relative w-full  ${mt} `} id="home" ref={ref}>
      {/* <ProfilePhoto /> */}
      <motion.h1
        className="  "
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        <IntroCard />
      </motion.h1>
      {/* <div className="w-full h-[2px] bg-amber-400"></div> */}
    </section>
  );
}
