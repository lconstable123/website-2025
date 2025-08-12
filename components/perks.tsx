"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import { useActiveSection } from "../context/active-section-context";
import { useInitialAnimation } from "../lib/hooks/animation-hooks";
import { blurb } from "../lib/data/data-blurb";

export default function Perks({ mt = "25" }: { mt?: string }) {
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 1);

  return (
    <div className="relative largeWidth z-900">
      <motion.div
        className={`${mt}`}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        // onClick={(e) => fadeIn(e)}
      >
        <IntroCardTemplate>
          <div className="flex">
            <div className=" flex-grow px-10   tracking-wider  text-white my-4 mx-4   font-light leading-tight  ">
              <ul className=" text-tertiary text-center font-light text-[13px] mt-2 space-y-5 ">
                {blurb[0]}
                {blurb.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-start flex-row gap-6    text-left  "
                  >
                    {/* <FaDotCircle className="text-secondary  text-[4px] mt-0" /> */}
                    {/* <div className="">{item}</div> */}
                    {/* <div className="flex flex-row items-center gap-6">
                      <div className="bg-yellow-300/20 w-20 h-[1px]"></div>
                    </div> */}
                  </li>
                ))}
              </ul>
              {/* <p className="text-tertiary font-medium  tracking-wider">Clients</p> */}
            </div>

            <div className="py-5 bg-gray-950 pointer-events-auto flex items-center basis-1/5  justify-center flex-shrink w-full">
              <div className="rounded-full   overflow-hidden">
                {/* <Animbox /> */}
              </div>
            </div>
          </div>
        </IntroCardTemplate>
      </motion.div>
    </div>
  );
}
