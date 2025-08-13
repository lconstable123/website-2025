"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CardDetails from "./card-details";
import clsx from "clsx";
import NativeVideoPlayer from "./NativevideoPlayer";
import { useCarouseAnimation } from "../../lib/hooks/animation-hooks";

import ProjectLightbox from "../atomic/video/project-lightbox";
import PortalPorter from "../../lib/hooks/portal-porter";
import { useSkillSetContext } from "../../context-providers/skillset-context";
import toast from "react-hot-toast";

import { projectCard } from "../../lib/data/reel-data";
import Image from "next/image";
import LinkButton from "../atomic/video/github-button";

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
        className="  group mb-0 sm:mb-0 last:mb-0 border-2 rounded-2xl -z-100  styleDarker hover:border-gray-500/70   border-white/20"
        onMouseEnter={handleMouseOver}
        onMouseLeave={handleMouseOut}
      >
        <section
          className={clsx(
            " relative overflow-hidden  rounded-xl border-white/20 bg-black-200/90  group transition-opacity duration-500 text-left flex flex-col justify-center dark:text-white dark:hover:bg-white/20",
            !isInView || !isInEyeline ? "opacity-10" : "opacity-100",
            square ? "w-full sm:w-[337px] " : "w-full"
          )}
        >
          <div className="overflow-hidden h-50 md:h-85 lg:h-85 rounded-t-lg mb-1 ">
            <LinkButton link={""} />
            <div className="group-hover:scale-110 group-hover:rotate-3  scale-100 transition-all duration-500">
              <Image
                src={imageUrl}
                alt={title}
                layout="cover"
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
