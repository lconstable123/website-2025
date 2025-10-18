"use client";

import React from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import AffiliatesScroller from "./sub-components/affiliates-scroller";

import { useDoubleIntersectionObserver } from "../lib/hooks/double-intersection-observer";

export default function Clients({ mt = "25" }: { mt?: string }) {
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
      >
        <IntroCardTemplate>
          <div className="  text-center  tracking-wider Text-secondary font-light  text-white text-[10pt] my-4 mx-4   leading-tight  ">
            <p className="px-7 py-1 rounded-2xl">
              Delivering <span className="textAccent">reliable, versatile</span>{" "}
              results.
              {/* {headerData.blurb} */}
            </p>
            {/* <p className="text-tertiary font-medium  tracking-wider">Clients</p> */}
          </div>

          <div className=" relative h-full  mb-5 overflow-hidden">
            <div className="relative bg-black/100 py-2 w-full   z-20">
              <div className="absolute horizontalFade  w-full h-full  z-24"></div>

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
              {/* <AffiliatesScroller
                scrollSpeed={200}
                affiliatesCount={44}
                direction="right"
                pagination={true}
                pages={3}
                page={3}
                affiliateHeight={afheight}
                affiliateWidth={afwidth}
              /> */}
            </div>
          </div>
        </IntroCardTemplate>
      </motion.div>
    </div>
  );
}
