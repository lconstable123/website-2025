import React from "react";
import { headerData } from "../lib/data/data";

import IntroCardTemplate from "./sub-components/intro-card-template";

export default function IntroCard() {
  return (
    <IntroCardTemplate>
      <div className=" flex justify-center items-center py-0 px-2       ">
        <h1 className=" px-5 py-1   uppercase rounded-2xl   text-white text-center text-[25pt] sm:text-[27pt]  Text-secondary !leading-12 font-bold tracking-widest sm:tracking-[12px]">
          {headerData.name}
        </h1>
      </div>
    </IntroCardTemplate>
  );
}
