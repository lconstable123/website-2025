"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import { useInitialAnimation } from "../lib/hooks/animation-hooks";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ClickPrompt2 from "./atomic/click-prompt";
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
          <div className="select-none capitalize flex gap-x-6 items-center justify-center text-center  tracking-wider Text-secondary text-white my-2 sm:my-4 mx-4   font-light text-[10pt] sm:text-[11pt] leading-tight  ">
            <p className="rounded-2xl">Technical artist.</p>
            <p className="rounded-2xl">accomplished developer.</p>
            <p className="rounded-2xl">award-winning director.</p>
          </div>
        </IntroCardTemplate>
      </motion.div>
      <div className="z-1000 text-white  fixed bottom-0  left-1/2 -translate-x-1/2">
        <ClickPrompt2
          onClick={false}
          Trigger={profileClicked > 0}
          direction="down"
          onScroll={true}
        >
          Scroll Down for more
        </ClickPrompt2>
      </div>
    </div>
  );
}
