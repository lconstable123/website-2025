import React from "react";
import { headerData } from "../lib/data/data";
import { motion } from "framer-motion";

import IntroCardTemplate from "./sub-components/intro-card-template";
const brags = ["developer.", "technical artist.", , "director."];
export default function IntroCard() {
  return (
    <IntroCardTemplate>
      <div className=" h-20 flex flex-col gap-1 justify-center items-center py-2 px-2       ">
        <h1 className=" px-5 py-0   uppercase rounded-2xl   text-white text-center text-[25pt] sm:text-[27pt]  Text-secondary !leading-10 font-bold tracking-widest sm:tracking-[8px]">
          {headerData.name}
        </h1>
        <div className="  select-none capitalize flex gap-x-7 items-center justify-center text-center  tracking-wider Text-secondary text-white   font-light text-[10pt] sm:text-[11pt] leading-tight  ">
          {/* {brags.map((b, index) => (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
              key={b}
              className="rounded-2xl"
            >
              {b}
            </motion.p>
          ))} */}
        </div>
      </div>
    </IntroCardTemplate>
  );
}
