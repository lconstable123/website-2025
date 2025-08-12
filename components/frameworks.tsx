"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import { allSkills } from "../lib/data/data";
import { useSkillSetContext } from "../context/skillset-context";

import { useDoubleIntersectionObserver } from "../lib/hooks/double-intersection-observer";
import Skills2 from "./skills";
import { useScreenContext } from "../context/screen-context";
export default function FrameWorks({
  mt = "25",
  // children,
}: {
  mt?: string;
  // children?: React.ReactNode;
}) {
  const { selectedVideoData } = useSkillSetContext();
  // const { activeSection } = useActiveSection();
  const { isMobileLandscape } = useScreenContext();
  const { ref, isInViewDeep, isInViewShort } = useDoubleIntersectionObserver(
    0.4,
    0.7,
    "Projects",
    isMobileLandscape
  );

  const controls = useAnimation();
  const variants = {
    in: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, delay: 0.2 },
    },
    out: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.5, delay: 0.0 },
    },
  };

  // useEffect(() => {
  //   if (activeSection === "Projects") {
  //     triggerIn();
  //   }
  // }, [activeSection]);

  const triggerIn = () => {
    controls.start({
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  return (
    <motion.section
      //largeWidth
      className={`${mt} relative w-200`}
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      variants={variants}
      animate={isInViewDeep ? "in" : "out"}
      // animate={{ opacity: 1 }}
      // whileInView={{ opacity: 1 }}
      // transition={{ duration: 0.4, delay: 0.1 }}
      // viewport={{ once: false }}
    >
      <IntroCardTemplate>
        <div className="flex flex-row items-center justify-center">
          <div className=" my-1 mx-4 ">
            <Skills2
              skills={allSkills}
              selectedSkills={selectedVideoData?.tags}
            />
          </div>
        </div>
      </IntroCardTemplate>
    </motion.section>
  );
}
