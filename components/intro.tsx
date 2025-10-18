"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useSectionInView } from "../lib/hooks/hooks";

import IntroCard from "./intro-card";

export default function Intro({ mt = "" }: { mt?: string }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document?.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(false);
    }
  }, []);

  const { ref } = useSectionInView("Home", 0.2);
  // const { controls } = useInitialAnimation(0.4);
  // Assuming you want to use the first project for the intro
  return (
    <div className=" min-h-33  sm:min-h-50   w-full  flex flex-col  items-center    z-2000">
      <section className={`relative w-full  ${mt} `} id="home" ref={ref}>
        {/* <ProfilePhoto /> */}
        {fontsLoaded && (
          <motion.h1
            className="  "
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <IntroCard />
          </motion.h1>
        )}
        {/* <div className="w-full h-[2px] bg-amber-400"></div> */}
      </section>
    </div>
  );
}
