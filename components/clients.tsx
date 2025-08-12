"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import AffiliatesScroller from "./sub-components/affiliates-scroller";

import { useDoubleIntersectionObserver } from "../lib/hooks/double-intersection-observer";

export default function Clients({ mt = "25" }: { mt?: string }) {
  // const { ref } = useDoubleIntersectionObserver(0.4, 0.7, "Experience");

  const afwidth = 150;
  const afheight = 30;

  return (
    <div className="relative large-width-2 ">
      <motion.div
        // ref={ref}
        className={`${mt} `}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ type: "spring", duration: 1.3 }}

        // variants={variants}
        // animate={controls}
      >
        <IntroCardTemplate>
          <div className="  text-center  tracking-wider Text-secondary text-white my-4 mx-4   font-light text-[9pt] sm:text-[11pt] leading-tight  ">
            <p className="px-7 py-1 rounded-2xl">
              Delivering <span className="textAccent">tasteful, reliable</span>{" "}
              results.
              {/* {headerData.blurb} */}
            </p>
            {/* <p className="text-tertiary font-medium  tracking-wider">Clients</p> */}
          </div>

          <div className=" relative h-full  mb-5 overflow-hidden">
            <div className="relative bg-black/100 py-2 w-full   z-20">
              <div className="absolute horizontalFade  w-full h-full  z-24"></div>
              {/* <div className="absolute bg-gradient-to-r from-black/40 via-black/10 to-black/40  w-full h-full  z-24"></div> */}
              <AffiliatesScroller
                scrollSpeed={200}
                affiliatesCount={44}
                direction="left"
                pagination={true}
                pages={3}
                page={1}
                affiliateHeight={afheight}
                affiliateWidth={afwidth}
              />
              <AffiliatesScroller
                scrollSpeed={200}
                affiliatesCount={44}
                direction="right"
                pagination={true}
                pages={3}
                page={2}
                affiliateHeight={afheight}
                affiliateWidth={afwidth}
              />
              <AffiliatesScroller
                scrollSpeed={200}
                affiliatesCount={44}
                direction="left"
                pagination={true}
                pages={3}
                page={3}
                affiliateHeight={afheight}
                affiliateWidth={afwidth}
              />
              <AffiliatesScroller
                scrollSpeed={200}
                affiliatesCount={44}
                direction="right"
                pagination={true}
                pages={3}
                page={3}
                affiliateHeight={afheight}
                affiliateWidth={afwidth}
              />
            </div>
          </div>
        </IntroCardTemplate>
        {/* <GlowBg w={1000} h={300} /> */}
      </motion.div>
    </div>
  );
}
