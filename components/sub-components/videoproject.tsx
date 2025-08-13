"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CardDetails from "./card-details";
import clsx from "clsx";
import NativeVideoPlayer from "./NativevideoPlayer";
import { useCarouseAnimation } from "../../lib/hooks/animation-hooks";

import ProjectLightbox from "../atomic/video/project-lightbox";
import PortalPorter from "../../lib/hooks/portal-porter";
import { useSkillSetContext } from "../../lib/context-providers/skillset-context";
import toast from "react-hot-toast";

import { projectCard } from "../../lib/data/reel-data";

export default function VideoProject({
  title,
  client,
  tags,
  imageUrl,
  link,
  low,
  byline,
  playable,
  playableLink,
  square,
  isInView,
  IsCodeDemo = false,
}: projectCard) {
  // --------------------------------------------------------------- states

  const { isInEyeline, selectedVideoData } = useSkillSetContext();
  const { controls, fadeInAnimationVariants } = useCarouseAnimation();
  const [isFocussed, setIsFocussed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [monitorCurrentTime, setMonitorCurrentTime] = useState(0);
  const externalVideoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const modalTargetRef = useRef<HTMLDivElement>(null);

  //---------------------------------------------------------------- handles

  const handleMouseOver = () => {
    if (isInView) {
      setIsFocussed(true);
    }
  };
  const handleMouseOut = () => {
    if (isInView) {
      setIsFocussed(false);
    }
  };
  const handlePopover = (state: "in" | "out") => {
    !isModalOpen && setIsModalOpen(true);
    isModalOpen && setIsModalOpen(false);
  };

  return (
    <motion.div
      className={` z-900 `}
      id={title}
      key={title}
      variants={fadeInAnimationVariants}
      initial="initial"
      animate={controls}
      custom={title}
    >
      {/* Lightbox - not part of dom flow */}
      <PortalPorter
        ref1={videoContainerRef}
        ref2={modalTargetRef}
        trigger={isModalOpen}
      >
        {/* Portable Video definition */}
        <NativeVideoPlayer
          poster={imageUrl}
          srcHigh={link || ""}
          srcLow={low}
          isSquare={square}
          isInView={isInView}
          isFocussed={isFocussed}
          setIsFocussed={setIsFocussed}
          isInEyeline={isInEyeline}
          isPlayable={playable}
          playableLink={playableLink}
          resetPlayPrompt={isInView}
          handlePopover={handlePopover}
          externalVideoRef={externalVideoRef}
          monitorCurrentTime={monitorCurrentTime}
          setMonitorCurrentTime={setMonitorCurrentTime}
          isModalOpen={isModalOpen}
        />
      </PortalPorter>
      {isModalOpen && (
        <ProjectLightbox
          handleClose={() => handlePopover("out")}
          selectedSkills={tags}
          title={title}
          byline={byline}
          blurb={""}
          square={square}
        >
          <div className=" relative flex flex-col justify-center items-center">
            <div ref={modalTargetRef} id="portalVid"></div>
          </div>
        </ProjectLightbox>
      )}
      {/* End Lightbox definition | Start Video Player definition */}
      <section
        className="  transition-all duration-700 group mb-0 sm:mb-0 last:mb-0 border-2 rounded-2xl -z-100  styleDarker hover:border-gray-500/70  border-gray-100/20"
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <section
          className={clsx(
            " relative overflow-hidden  rounded-xl border-white/20  bg-black-200/90  group transition-opacity duration-500 text-left flex flex-col justify-center dark:text-white dark:hover:bg-white/20",
            !isInView || !isInEyeline ? "opacity-10" : "opacity-100",
            square ? "w-full sm:w-[337px] " : "w-full"
          )}
        >
          <div ref={videoContainerRef} className=" rounded-t-lg pb-2 "></div>

          <CardDetails
            title={title}
            byline={byline || ""}
            tags={tags}
            client={client}
            isSquare={square}
          />
        </section>
      </section>
    </motion.div>
  );
}
