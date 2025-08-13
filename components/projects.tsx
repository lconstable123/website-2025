"use client";
import React, { Suspense, useEffect, useRef, useState } from "react";

import { RefinedallSkills } from "../lib/data/skills-data";

import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import VideoProject from "./sub-components/videoproject";
import CodeProject from "./sub-components/codeproject";
import IntroCardTemplate from "./sub-components/intro-card-template";
import clsx from "clsx";

import CarouselNav from "./atomic/video/carousel-nav";
import { useVideoCarousel } from "../lib/hooks/useVideoCarousel";
import Navigator from "./atomic/navigator";
import Skills2 from "./skills";
import ClickPrompt2 from "./atomic/click-prompt";
import { useSkillSetContext } from "../context/skillset-context";
import { useScreenContext } from "../context/screen-context";
import { useActiveSection } from "../context/active-section-context";
import Loader from "./sub-components/loader";

export default function Projects({
  title,
  mt = "25",
}: {
  title?: string;
  mt?: string;
}) {
  const {
    ref,
    isInViewDeep,
    isInViewShort,
    setApi,
    page,
    handleSelectCategory,
    scrollNext,
    scrollPrev,
    carouselSectionRef,
    navOffsetTop,
    selectedUICategory,
  } = useVideoCarousel();

  const { Videodata, selectedVideoData, selectedSkillSet, isCategoryChanging } =
    useSkillSetContext();

  const { scrollRef } = useActiveSection();
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: "spring", duration: 1.3 }}
        id="projects"
        style={{ opacity: 0 }}
        className="  mt-40 sm:mt-52 large-width-2 relative flex flex-col scroll-mt-28  border-white/20"
        ref={ref}
      >
        {/* <CarouselNav
          yOffset={navOffsetTop}
          scrollNext={scrollNext}
          scrollPrev={scrollPrev}
          isInEyeline={isInViewDeep}
        /> */}

        <IntroCardTemplate>
          <Suspense fallback={<Loader isLoading={true} isMobile={false} />}>
            <Navigator
              selectedCategory={selectedUICategory}
              handleSelectCategory={handleSelectCategory}
              inView={isInViewShort}
            />
            <Carousel
              className={`pb-0 mb-0 h-75 sm:h-[370px] border-0 md:h-[453px] z-50 overflow-hidden`}
              setApi={setApi}
              opts={{ align: "center", loop: true }}
              ref={carouselSectionRef}
            >
              <div ref={scrollRef}>
                <CarouselContent>
                  {Videodata?.map((project, index) => (
                    <React.Fragment key={project.title}>
                      <CarouselItem
                        className={clsx(
                          "  flex justify-center h-full transition-[flex] duration-100 ease-in-out",
                          Videodata.length > 3
                            ? "flex-[0_0_90%]  md:flex-[0_0_86%] lg:flex-[0_0_76%] 2xl:flex-[0_0_56%]"
                            : "flex-[0_0_90%] sm:flex-[0_0_70%] md:flex-[0_0_50%] lg:flex-[0_0_56%]"
                        )}
                      >
                        {project.IsCodeDemo ? (
                          <CodeProject
                            {...project}
                            isInView={page === index}

                            // isCategoryChanging={isCategoryChanging}
                          />
                        ) : (
                          <VideoProject
                            {...project}
                            isInView={page === index}
                            // isCategoryChanging={isCategoryChanging}
                          />
                        )}
                      </CarouselItem>
                    </React.Fragment>
                  ))}
                </CarouselContent>
              </div>
            </Carousel>

            <ClickPrompt2
              Trigger={isInViewDeep}
              ref={carouselSectionRef}
              direction="across"
            >
              swipe for more
            </ClickPrompt2>
            <Skills2
              skills={RefinedallSkills}
              selectedSkills={selectedVideoData?.tags}
            />
          </Suspense>
        </IntroCardTemplate>
      </motion.section>
    </div>
  );
}
