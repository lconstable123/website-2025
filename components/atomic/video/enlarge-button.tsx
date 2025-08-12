import Link from "next/link";
import React from "react";
import { IoGameController } from "react-icons/io5";
import { PiFrameCornersLight } from "react-icons/pi";
import { openNewWindow } from "@/lib/utils";
export default function EnlargeButton({
  isPlayable = false,
  handlePopover,
  playableLink = "",
}: {
  isPlayable?: boolean;
  handlePopover?: () => void;
  playableLink?: string;
}) {
  const enlargeStyle =
    "transition-all scale-100 hover:scale-110 video-shadow duration-200 delay-75 absolute top-2 right-3 z-30 text-white cursor-pointer";

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isPlayable) handlePopover?.();
  };

  if (isPlayable) {
    return (
      <nav
        onClick={(e) => openNewWindow(playableLink, e)}
        className={`${enlargeStyle}`}
      >
        <IoGameController className="  w-18 h-18" />
      </nav>
    );
  } else {
    return (
      <nav className={`${enlargeStyle}`} onClick={(e) => handleClick(e)}>
        <PiFrameCornersLight className=" w-12 h-12" />
      </nav>
    );
  }
}
