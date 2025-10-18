"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";
import { blurb } from "../lib/data/data-blurb";
import { useInitialAnimation } from "../lib/hooks/animation-hooks";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ClickPrompt2 from "./atomic/click-prompt";
import { cn } from "../lib/utils/utils";
const brags = [
  "technical artist.",
  "full-stack developer.",
  "award-winning director.",
];
import { categories } from "../lib/data/reel-data";
import { IconBaseProps } from "react-icons/lib";
import { useSkillSetContext } from "../lib/context-providers/skillset-context";
import { useScreenContext } from "../lib/context-providers/screen-context";
const features = ["Web", "Interactivity", "Direction", "Experiments"];

export default function Byline({ mt = "20" }: { mt?: string }) {
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);

  return (
    <div className="h-[330px] sm:h-[200px] relative w-full">
      <motion.div
        className={`${mt}`}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ type: "tween", duration: 0.9 }}
        // onClick={(e) => fadeIn(e)}
      >
        <IntroCardTemplate>
          <div className="items-center my-3 sm:my-4 select-none flex flex-col  ">
            {profileClicked > 0 && (
              <>
                <motion.div className="mx-5 text-center flex sm:flex-row capitalize items-center justify-center gap-x-5 sm:text-[11pt] text-[10pt]">
                  {brags.map((b, index) => (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                      key={b}
                      className="rounded-2xl"
                    >
                      {b}
                    </motion.p>
                  ))}
                  {/* <p className="Text-secondary font-light  text-white text-[10pt] tracking-wider text-center">
                    Technical artist, interactive developer, award-winning
                    director.
                  </p> */}
                  {/* <Features profileClicked={profileClicked} /> */}
                </motion.div>
                <hr className="w-full border-t border-gray-950 border-2 my-2 sm:my-4 " />
                <Welcome />
              </>
            )}
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

const Welcome = () => {
  const isMobile = useScreenContext();
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      transition={{ duration: 0.3, delay: !isMobile ? 1.7 : 0 }}
      className=" mx-16 md:mx-8   text-center  leading-[14pt] Text-secondary font-light  text-white text-[10pt] tracking-wider"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: !isMobile ? 1.9 : 0 }}
      >
        <p>I invite you to check out my work, sorted by my different hats:</p>
        <div className=" border-1  py-2 px-4  rounded-lg border-gray-700 mt-2 sm:mt-2 flex flex-wrap   gap-2 sm:gap-4 justify-center">
          {categories.map((feature, index) =>
            FeatureBubble({
              text: feature.title,
              icon: feature.icon,
              key: index,
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
export const Features = ({ profileClicked }: { profileClicked: number }) => {
  return (
    <div className="mx-15 md:mx-8  select-none   flex flex-col sm:flex-row  items-center gap-x-5 gap-y-3  justify-center text-center  tracking-wider Text-secondary text-gray-200   font-light text-[10pt] sm:text-[10pt] leading-tight  ">
      {blurb.map((b, index) => (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
          key={b}
          className="rounded-2xl"
        >
          {b}
        </motion.p>
      ))}
    </div>
  );
};

const FeatureBubble = ({
  text,
  icon,
  key,
}: {
  text: string;
  icon: React.FunctionComponentElement<IconBaseProps>;
  key: number;
}) => {
  const { setProfileClicked, profileClicked } = useActiveSection();
  const {
    setSelectedUICategory,
    setSelectedSkillSet,
    isCategoryChanging,
    setIsCategoryChanging,
  } = useSkillSetContext();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleSelectCategory = (category: string) => {
    const params = new URLSearchParams(category.toString());

    setSelectedUICategory(category as any);
    // setCarouselInitial(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsCategoryChanging(true);

    params.set("category", category);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
    setProfileClicked((prev) => prev + 1);

    timerRef.current = setTimeout(() => {
      setIsCategoryChanging(false);
      setSelectedSkillSet(category as any);
      // resetCarousel();
    }, 150);
  };

  return (
    <div
      onClick={() => {
        handleSelectCategory(text);
      }}
      key={key}
      className=" text-white flex items-center justify-center  outline-white/30 border-0 bg-gray-950 rounded-b-md  overflow-hidden transition-all  outline-1 rounded-t-xs duration-600 delay-50 py-[1px] px-3  hover:bg-gray-800"
    >
      <i className="w-5 ">{icon}</i>
      {text}
    </div>
  );
};
