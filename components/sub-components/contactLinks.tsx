"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import { BsLinkedin } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import IntroCardTemplate from "./intro-card-template";

import { useActiveSection } from "../../lib/context-providers/active-section-context";

export default function ContactLinks({ mt = "mt-25" }: { mt?: string }) {
  const { setActiveSection, setTimeOfLastClick } = useActiveSection();
  const SmalliconSize = "7";
  const iconSize = "8";
  const sizeStyling = `w-${SmalliconSize} h-${SmalliconSize} sm:w-${iconSize} sm:h-${iconSize}`;
  return (
    <motion.div
      className={`relative select-none w-full  ${mt}`}
      // initial={{ opacity: 0, y: 50 }}
      // animate={controls}
    >
      <IntroCardTemplate canSelect={true}>
        <div className=" text-white  py-2 sm:py-2 flex flex-row sm:flex-row gap-10 sm:gap-14 text-sm font-medium  items-center justify-center">
          <Link
            href="https://www.instagram.com/virtuallyanything.xyz/"
            className=" group transition  flex justify-center items-center gap-2 outline-none focus:scale-110 hover:scale-110  active:scale-105"
          >
            <FaInstagram className="w-6 h-auto sm:w-7" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/lukeconstable/"
            className=" group transition  flex justify-center items-center gap-2 outline-none focus:scale-110 hover:scale-120 active:scale-105"
          >
            <BsLinkedin className="w-5 h-auto sm:w-6" />
          </Link>
          <Link
            href="mailto:luke@lukeconstable.com"
            className=" group transition   flex justify-center items-center gap-2 outline-none focus:scale-110 hover:scale-110 active:scale-105"
          >
            <IoIosMail className="w-6 h-auto sm:w-10 text-2xl opacity-100 transition" />
          </Link>
          <Link
            href="https://github.com/lconstable123/website-2025"
            className=" group transition  flex justify-center items-center gap-2 outline-none focus:scale-110 hover:scale-120 active:scale-105"
          >
            <FaGithub className="w-5 h-auto sm:w-7" />
          </Link>
          {/* <a
            className="  borderBlack cursor:pointer transition group flex items-center justify-center gap-2    outline-none focus:scale-110 hover:scale-110 active:scale-105"
            href="/CV.pdf"
            download
          >
            <PiReadCvLogoFill className="w-6 h-auto sm:w-9" />
          </a> */}
        </div>
      </IntroCardTemplate>
    </motion.div>
  );
}
