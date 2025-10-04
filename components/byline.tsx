"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";
import { blurb } from "../lib/data/data-blurb";
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
          <div className="bg-gray-950 rounded-2xl py-5 mx-1 my-1  text-center flex flex-col items-center justify-center  tracking-wider Text-secondary text-white   font-light text-[12pt] sm:text-[11pt] leading-tight  ">
            <div className="flex flex-col  items-center justify-center gap-y-2 gap-x-5 px-5">
              <p className="capitalize  ">
                accomplished developer.
                {/* {headerData.blurb} */}
              </p>
              <p className="capitalize ">
                Technical artist.
                {/* {headerData.blurb} */}
              </p>
              <p className="capitalize  ">
                award-winning director.
                {/* {headerData.blurb} */}
              </p>
            </div>
            {/* <hr className="border-gray-700 w-100 my-6 text-center" /> */}
            <ul className="px-7 text-center     Text-secondary text-gray-300   font-light text-[12pt] sm:text-[11pt]  ">
              {/* {blurb.map((line) => (
                <li
                  key={line}
                  className=" leading-4 tracking-wider text-[10pt] pb-2 rounded-2xl"
                >
                  {line}
                </li>
              ))} */}
            </ul>
            {/* <p className="mt-3 text-gray-100">
              {" "}
              I invite you to explore my portfolio.
            </p> */}
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
