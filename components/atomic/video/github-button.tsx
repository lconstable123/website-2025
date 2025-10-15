import Link from "next/link";
import React from "react";
import { IoGameController } from "react-icons/io5";
import { PiFrameCornersLight } from "react-icons/pi";
import { FaGithub } from "react-icons/fa";
import { FaFigma } from "react-icons/fa6";
import { openNewWindow } from "../../../lib/utils/utils";
export default function LinkButton({
  // link,
  git,
  figma,
  // gitlink,
  // figmalink,
  // type= "github"
}: {
  // gitlink?: string;
  // figmalink?: string;

  git?: string;
  figma?: string;
}) {
  const enlargeStyle =
    "video-shadow  delay-75 absolute top-2 right-3 z-30 text-white cursor-pointer";

  return (
    <div
      className={`${enlargeStyle} flex flex-col items-center  gap-3 justify-center`}
    >
      {git && (
        <FaGithub
          onClick={(e) => openNewWindow(git, e)}
          className="scale-100 hover:scale-110 transition-all  duration-200   w-10 h-10"
        />
      )}

      {figma && (
        <FaFigma
          onClick={(e) => openNewWindow(figma, e)}
          className="scale-100 hover:scale-110 transition-all  duration-200   w-10 h-10"
        />
      )}
    </div>
  );
}
