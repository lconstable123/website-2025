"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";
import { useActiveSection } from "../context/active-section-context";
import { useInitialAnimation } from "../lib/hooks/animation-hooks";
export default function Byline({ mt = "25" }: { mt?: string }) {
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);

  return (
    <div className="relative w-full">
      <motion.div
        className={`${mt}`}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        // onClick={(e) => fadeIn(e)}
      >
        <IntroCardTemplate>
          <div className=" text-center  tracking-wider Text-secondary text-white my-2 sm:my-4 mx-4   font-light text-[9pt] sm:text-[11pt] leading-tight  ">
            <p className="px-7 py-1 rounded-2xl">
              Technical artist, accomplished interactive developer,
              award-winning director.
              {/* {headerData.blurb} */}
            </p>
            {/* <p className="text-tertiary font-medium  tracking-wider">Clients</p> */}
          </div>
        </IntroCardTemplate>
      </motion.div>
    </div>
  );
}
