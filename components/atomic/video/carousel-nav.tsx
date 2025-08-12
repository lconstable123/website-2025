import React from "react";
import { FaCircleArrowLeft, FaCircleArrowRight } from "react-icons/fa6";

export default function CarouselNav({
  yOffset,
  scrollNext,
  scrollPrev,
  isInEyeline,
}: {
  yOffset: number;
  scrollNext: () => void;
  scrollPrev: () => void;
  isInEyeline: boolean;
}) {
  const navstyle = `selector-enhancer scale:100 hover:scale-120 active:scale-90 transition duration-200 absolute cursor-pointer  z-[9999] p-1 text-3xl text-white border-white/20 rounded-md`;
  return (
    <nav
      className={`transition-all delay-200 duration-500 z-999 ${isInEyeline ? "opacity-100" : "opacity-0"}`}
    >
      <div
        onClick={scrollNext}
        style={{ top: `${yOffset}px` }}
        className={`${navstyle} left-2 2xl:-left-15`}
      >
        <FaCircleArrowLeft />
      </div>
      <div
        onClick={scrollPrev}
        style={{ top: `${yOffset}px` }}
        className={`${navstyle} right-2 2xl:-right-15 `}
      >
        <FaCircleArrowRight />
      </div>
    </nav>
  );
}
