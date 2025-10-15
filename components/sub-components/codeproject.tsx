"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CardDetails from "./card-details";
import clsx from "clsx";
import NativeVideoPlayer from "./NativevideoPlayer";
import { useCarouseAnimation } from "../../lib/hooks/animation-hooks";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import ProjectLightbox from "../atomic/video/project-lightbox";
import PortalPorter from "../../lib/hooks/portal-porter";
import { useSkillSetContext } from "../../lib/context-providers/skillset-context";
import toast from "react-hot-toast";

import { projectCard } from "../../lib/data/reel-data";
import Image from "next/image";
import LinkButton from "../atomic/video/github-button";
import { openNewWindow } from "../../lib/utils/utils";
import VideoImageSkeleton from "../atomic/video/videoImage-skeleton";

export default function CodeProject({
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
  git,
  figma,
  clickthough = true,
  IsCodeDemo = false,
  isImagesLoaded = true,
}: projectCard) {
  // --------------------------------------------------------------- states

  const { isInEyeline } = useSkillSetContext();
  const { controls, fadeInAnimationVariants } = useCarouseAnimation();
  const [isFocussed, setIsFocussed] = useState(false);

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
      <section
        className=" transition-all duration-700 group mb-0 sm:mb-0 last:mb-0 border-2 rounded-2xl -z-100  styleDarker hover:border-gray-500/70   border-gray-100/20"
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <section
          className={clsx(
            " relative overflow-hidden  rounded-xl border-white/20 bg-black-200/90  group transition-opacity duration-500 text-left flex flex-col justify-center dark:text-white dark:hover:bg-white/20",
            !isInView || !isInEyeline ? "opacity-10" : "opacity-100",
            square ? "w-full sm:w-[337px] " : "w-full sm:w-[537px]"
          )}
        >
          <div className=" relative overflow-hidden h-50 sm:h-63 md:h-85 lg:h-85 rounded-t-lg mb-1 ">
            {isImagesLoaded ? (
              <>
                <LinkButton git={git || ""} figma={figma || ""} />

                {clickthough && (
                  <div className="delay-50 transition-all group-hover:opacity-100 opacity-0 duration-800 video-shadow shadow-black/20 absolute z-11 pointer-events-none left-5 bottom-5 ">
                    <div className=" flex flex-col items-center">
                      <FaRegArrowAltCircleUp className="text-[40pt]" />
                      <p className="text-[11pt]">visit app</p>
                    </div>
                  </div>
                )}
                <div className=" absolute z-10 pointer-events-none inset-0 bg-radial from-black/0 to-black/70 via-black/20"></div>
                <div
                  onClick={(e) => clickthough && openNewWindow(playableLink, e)}
                  className="translate-y-3 flex items-center justify-center cursor-pointer group-hover:scale-125 group-hover:rotate-3  scale-120 transition-all duration-500"
                >
                  <Image
                    src={imageUrl}
                    alt={title}
                    style={{ objectFit: "cover" }}
                    width={1920}
                    height={1080}
                  />
                </div>
              </>
            ) : (
              <VideoImageSkeleton isMobile={false} />
            )}
          </div>

          <CardDetails
            title={title}
            byline={byline || ""}
            tags={tags}
            client={client}
            isSquare={square}
            isImagesLoaded={isImagesLoaded}
          />
        </section>
      </section>
    </motion.div>
  );
}
