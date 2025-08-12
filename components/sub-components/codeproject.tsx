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
import { useSkillSetContext } from "../../context/skillset-context";
import toast from "react-hot-toast";

import { projectCard } from "../../lib/data/reel-data";
import Image from "next/image";
import LinkButton from "../atomic/video/github-button";
import { openNewWindow } from "@/lib/utils";

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
  IsCodeDemo = false,
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
            <LinkButton link={git || ""} />
            {/* <div className="transition-all opacity-50 duration-800 video-shadow shadow-black/20 absolute z-11 pointer-events-none left-1/2 -translate-x-1/2 -translate-y-1/2 top-2/4 ">
              <FaRegArrowAltCircleUp className="text-[70pt]" />
            </div> */}
            <div className=" absolute z-10 pointer-events-none inset-0 bg-radial from-black/0 to-black/70 via-black/20"></div>
            <div
              onClick={(e) => openNewWindow(playableLink, e)}
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
          </div>

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
