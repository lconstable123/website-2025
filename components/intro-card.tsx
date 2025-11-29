import React from "react";
import { headerData } from "../lib/data/data";
import { motion } from "framer-motion";

import IntroCardTemplate from "./sub-components/intro-card-template";
import BylineInternal from "./byline-internal";
const brags = ["developer.", "technical artist.", , "director."];
export default function IntroCard() {
  return (
    <IntroCardTemplate>
      <div className="  flex flex-col gap-1 justify-center items-center py-2        ">
        <h1 className=" px-5 py-0 pb-2   uppercase rounded-2xl   text-white text-center text-[25pt] sm:text-[27pt]  Text-secondary !leading-10 font-bold tracking-widest sm:tracking-[8px]">
          {headerData.name}
        </h1>
        <BylineInternal />
      </div>
    </IntroCardTemplate>
  );
}
