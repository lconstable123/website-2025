import Link from "next/link";
import React from "react";
import { IoGameController } from "react-icons/io5";
import { PiFrameCornersLight } from "react-icons/pi";
import { FaGithub } from "react-icons/fa";
import { openNewWindow } from "@/lib/utils";
export default function LinkButton({ link }: { link: string }) {
  const enlargeStyle =
    "transition-all scale-100 hover:scale-110 video-shadow duration-200 delay-75 absolute top-2 right-3 z-30 text-white cursor-pointer";

  // const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   window.open(
  //     link,
  //     "popupWindow",
  //     "width=800,height=600,scrollbars=yes,resizable=yes"
  //   );
  // };

  return (
    <div
      onClick={(e) => openNewWindow(link, e)}
      className={`${enlargeStyle} flex flex-col items-center  gap-0 justify-center`}
    >
      <FaGithub className="w-12 h-12" />
    </div>
  );
}
