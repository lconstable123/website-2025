import React from "react";
import { headerData } from "../lib/data/data";

import IntroCardTemplate from "./sub-components/intro-card-template";

export default function IntroCard() {
  return (
    <IntroCardTemplate>
      <div className=" flex justify-center items-center w-full rounded-2xl  bg-gray-950    px-1 py-1      ">
        <h1 className=" m-1 py-1 px-2    uppercase rounded-2xl   text-white text-center  w-90 sm:w-full  text-[29pt] sm:text-[27pt]  Text-secondary !leading-12 font-bold tracking-widest sm:tracking-[10px]">
          {headerData.name}
        </h1>
      </div>
    </IntroCardTemplate>
  );
}
