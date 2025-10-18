"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";
import { blurb } from "../lib/data/data-blurb";
import { useInitialAnimation } from "../lib/hooks/animation-hooks";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ClickPrompt2 from "./atomic/click-prompt";
export default function Blurb({ mt = "25" }: { mt?: string }) {
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);

  return (
    <div
      className="relative
      large-width-2 mt-27    "
    >
      <motion.div
        className={``}
        initial={{ opacity: 0, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: 0.0 }}
        // onClick={(e) => fadeIn(e)}
      >
        <IntroCardTemplate>
          <ul className=" md:px-0 lg:px-20  h-full flex md:flex-row flex-col text-center  tracking-wider Text-secondary text-white my-2 sm:my-2 mx-4   font-light text-[9pt] sm:text-[9pt] leading-tight  ">
            {/* <hr /> */}
            {blurb.map((line) => (
              <li
                key={line}
                className=" leading-4 text-[10pt] px-7 sm:py-1 py-3 rounded-2xl"
              >
                {line}
              </li>
            ))}
            {/* <p className="text-tertiary font-medium  tracking-wider">Clients</p> */}
          </ul>
        </IntroCardTemplate>
      </motion.div>
    </div>
  );
}
