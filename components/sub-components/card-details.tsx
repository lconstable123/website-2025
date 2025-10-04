import React from "react";
import { useScreenContext } from "../../lib/context-providers/screen-context";

type cardDetailsProps = {
  title: string;
  byline: string;
  client?: string;
  tags: string[];
  isSquare?: boolean;
  isImagesLoaded: boolean;
};

export default function CardDetails({
  title,
  byline,
  client,
  isSquare = false,
  isImagesLoaded = true,
}: cardDetailsProps) {
  const { isMobile } = useScreenContext();
  return (
    <section className=" flex flex-col h-22 sm:h-26 left-5 pb-3 relative text-white transition-h duration-400 z-70 overflow-hidden ">
      {isImagesLoaded && (
        <>
          <p className="  text-[11pt] sm:text-[12pt]  pt-1 Text-tertiary font-semibold  tracking-wider ">
            {title}
          </p>
          <p
            className={`${!isSquare ? "w-[380px] sm:w-[500px]" : "w-[160px] "}   text-[7pt] sm:text-[8pt] text-white/90   pb-2 pt-1 tracking-wide`}
          >
            {client}
          </p>
          <p className="text-gray-200/50 mt-auto italic Text-tertiary text-[7pt] sm:text-[8pt] font-light tracking-widest">
            {byline}
          </p>
        </>
      )}
    </section>
  );
}
