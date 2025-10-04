"use client";
import React, { Suspense } from "react";

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

import { useSearchParams } from "next/navigation";
import { useSkillSetContext } from "../lib/context-providers/skillset-context";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ImageLoader from "../lib/hooks/ImageLoader.tsx";
import { useScreenContext } from "../lib/context-providers/screen-context";

export default function Projects({
  title,
  mt = "25",
}: {
  title?: string;
  mt?: string;
}) {
  const searchParams = useSearchParams();
  // const searchParams = new URL(window.location.search);

  // const id = searchParams.get("id");
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
    carouselInitial,
  } = useVideoCarousel(searchParams);

  const { Videodata, selectedVideoData } = useSkillSetContext();
  const { imagesLoaded } = useSkillSetContext();
  const { scrollRef } = useActiveSection();
  const isLongEnough = Videodata?.length || 0 > 3;
  return (
    <div>
      {!imagesLoaded && <ImageLoader currentCategory={selectedUICategory} />}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: "spring", duration: 1.3 }}
        id="projects"
        style={{ opacity: 0 }}
        className="   large-width-2 relative flex flex-col scroll-mt-28  border-white/20"
        ref={ref}
      >
        {!isLongEnough && (
          <CarouselNav
            yOffset={navOffsetTop}
            scrollNext={scrollNext}
            scrollPrev={scrollPrev}
            isInEyeline={isInViewDeep}
          />
        )}

        <IntroCardTemplate>
          <Navigator
            selectedCategory={selectedUICategory}
            handleSelectCategory={handleSelectCategory}
            inView={isInViewShort}
          />
          <Carousel
            className={`pb-0 mb-0  h-75 sm:h-[370px] border-0 md:h-[453px] z-50 overflow-hidden`}
            setApi={setApi}
            opts={{ align: "center", loop: true }}
            ref={carouselSectionRef}
          >
            <div
              onClick={scrollNext}
              className="z-30 absolute left-0 w-15 h-full"
            />
            <div
              onClick={scrollPrev}
              className="z-30 absolute right-0 w-15 h-full"
            />
            <div ref={scrollRef}>
              <CarouselContent>
                {Videodata?.map((project, index) => (
                  <React.Fragment key={project.title}>
                    <CarouselItem
                      className={clsx(
                        "  flex justify-center h-full transition-[flex] duration-100 ease-in-out",
                        isLongEnough
                          ? "flex-[0_0_90%]  md:flex-[0_0_86%] lg:flex-[0_0_76%] 2xl:flex-[0_0_56%]"
                          : "flex-[0_0_100%]"
                      )}
                    >
                      {project.IsCodeDemo ? (
                        <CodeProject
                          {...project}
                          isInView={page === index}
                          isImagesLoaded={true}

                          // isCategoryChanging={isCategoryChanging}
                        />
                      ) : (
                        <VideoProject
                          {...project}
                          isInView={page === index}
                          isImagesLoaded={carouselInitial || imagesLoaded}
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
            skills={[...RefinedallSkills]}
            selectedSkills={selectedVideoData?.tags}
          />
        </IntroCardTemplate>
      </motion.section>
    </div>
  );
}
