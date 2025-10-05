"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";
import { blurb } from "../lib/data/data-blurb";
import { useInitialAnimation } from "../lib/hooks/animation-hooks";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ClickPrompt2 from "./atomic/click-prompt";
import { cn } from "../lib/utils/utils";
const brags = [
  "technical artist.",
  "accomplished developer.",
  "award-winning director.",
];
export default function Byline({ mt = "25" }: { mt?: string }) {
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);

  return (
    <div className="relative w-full">
      <motion.div
        className={`${mt}`}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ type: "tween", duration: 0.5 }}
        // onClick={(e) => fadeIn(e)}
      >
        <IntroCardTemplate>
          <div className=" mx-4 my-4">
            <div className="min-h-[30px]  select-none capitalize flex gap-x-5 items-center justify-center text-center  tracking-wider Text-secondary text-white   font-light text-[10pt] sm:text-[11pt] leading-tight  ">
              {profileClicked > 0 &&
                brags.map((b, index) => (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.7 + 0.4 }}
                    key={b}
                    className="rounded-2xl"
                  >
                    {b}
                  </motion.p>
                ))}
            </div>

            {/* {profileClicked > 0 && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                transition={{ duration: 0.2, delay: 1.5, type: "tween" }}
                className={cn(" flex justify-center items-center")}
              >
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 10 }}
                  transition={{ duration: 0.7, delay: 1.8 }}
                  className=" text-center flex flex-col gap-y-2 w-70 sm:w-full items-center justify-center  tracking-wider Text-secondary text-gray-300!    font-light text-[9pt] leading-tight  "
                >
                  {blurb.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </motion.ul>
              </motion.div>
            )} */}
          </div>
        </IntroCardTemplate>
        {/* {blurb.map((line) => (
          <div className="my-10" key={line}>
            <IntroCardTemplate key={line}>
              <div className="mx-4 my-4">
                <div className="flex justify-center items-center  ">
                  <ul className=" text-center flex flex-col gap-y-3 w-70 sm:w-full items-center justify-center  tracking-wider Text-secondary text-gray-300!    font-light text-[10pt] leading-tight  ">
                    <li key={line}>{line}</li>
                  </ul>
                </div>
              </div>
            </IntroCardTemplate>
          </div>
        ))} */}
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
