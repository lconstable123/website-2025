"use client";
import React, { useEffect } from "react";

import { motion } from "framer-motion";
import { createPortal } from "react-dom";
import { GoXCircleFill } from "react-icons/go";

import { useAnimationTrigger } from "../../../lib/hooks/animation-hooks";
import Skills2 from "../../skills";
import { useScreenContext } from "../../../context/screen-context";
import { blurb } from "../../../lib/data/data-blurb";
type LightboxProps = {
  handleClose: () => void;
  skills?: string[];
  children: React.ReactNode;
  selectedSkills?: string[];
  title?: string;
  byline?: string;
  blurb?: string;
  square?: boolean;
};
export default function ProjectLightbox({
  children,
  handleClose,
  selectedSkills = [],
  title = "Project Title",
  // byline = "Project Byline",
  // blurb = "Project Blurb",
  square = false,
}: LightboxProps) {
  const [bgControls, handleAnimateClose] = useAnimationTrigger({
    handleClose,
    toScale: 1,
    fromScale: 1,
    duration: 0.0,
    delay: 0,
  });
  const { isMobileLandscape, isLandscape } = useScreenContext();

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {}, [isMobileLandscape, isLandscape]);

  return createPortal(
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={bgControls}
        exit={{ opacity: 0 }}
        className="  initial:opacity-0  opacity-100 fixed bg-black/60 top-0 left-0 w-screen h-screen z-9000   flex items-center justify-center"
      ></motion.section>
      ,
      <div className="fixed  z-9002 outline-1 flex items-center justify-center    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lg:w-[90vw] lg:h-[80vh] landscape:w-full landscape:h-full border-0 px-0 py-0 lg:px-30 sm:py-10 bg-black rounded-lg text-white   outline-gray-600 shadow-lg">
        <div className=" absolute right-5 top-5 landscape:right-10 flex items-center justify-center">
          <GoXCircleFill
            className="landscape:text-[30pt] text-[40pt]  scale-100 hover:scale-110 transition-all duration-100 cursor-pointer z-999"
            onClick={handleAnimateClose}
          />
        </div>
        <div
          className={` flex flex-col justify-center items-center scale-150 z-770`}
        >
          <div
            className={`border-1 border-gray-700 rounded-xl overflow-hidden ${square ? "w-80 h-87" : "w-auto"}`}
          >
            {children}
          </div>

          <div
            className={`flex h-30 items-center justify-center flex-col mt-0 px-1 ${isMobileLandscape ? "sm:px-3" : "sm:px-40"} landscale:px-3   `}
          >
            <h2 className="landscape:py-1 pt-10 tracking-wider Text-secondary font-semibold text-lg">
              {title}
            </h2>
            {/* <p>{blurb}</p> */}

            <div className="scale-70">
              <Skills2 format="list" selectedSkills={selectedSkills} />
            </div>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("lightbox") || document.body
  );
}
