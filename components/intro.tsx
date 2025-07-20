"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
export default function Intro() {
  return (
    <section className="mb-28 max-w-[50rem] sm:mb-0 scroll-mt-28" id="home">
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "tween", duration: 0.1, delay: 0.1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              alt="profile pic"
              width={192}
              height={192}
              quality={95}
              priority={true}
              className="h-24 w-24 rounded-full border-[0.35rem] object-cover shadow-xl"
            />
          </motion.div>
          <motion.span
            className="absolute text-4xl bottom-0 right-0"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 125,
              duration: 0.7,
              delay: 0.1,
            }}
          >
            👋
          </motion.span>
        </div>
      </div>
      <motion.h1
        className="text-center mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Hi, I'm John Doe. I'm a{" "}
        <span className="font-bold">software engineer</span> with a passion for
        building web applications.
      </motion.h1>
      <motion.div
        className="flex flex-col sm:flex-row gap-2 px-4 text-lg font-medium  items-center justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link
          href="contact"
          className="group transition bg-gray-900 text-white px-7 py-3 rounded-full flex justify-center items-center gap-2 outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105"
        >
          Contact me here{" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>
        <a
          className=" border border-black/10 cursor:pointer transition group flex items-center justify-center gap-2 bg-white rounded-full py-3 px-7 outline-none focus:scale-110 hover:scale-110 active:scale-105"
          href="/CV.pdf"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-70 group-hover:translate-y-1 transition" />
        </a>
        <a
          className="border hover:text-gray-950 border-black/10 cursor:pointer transition group flex items-center justify-center gap-2 bg-white  text-gray-700 rounded-full p-4 outline-none focus:scale-110 hover:scale-110 active:scale-105"
          href="https://www.linkedin.com/in/johndoe"
          target="_blank"
        >
          <BsLinkedin />
        </a>

        <a
          className="border hover:text-gray-950 border-black/10 cursor:pointer transition group flex items-center justify-center gap-2 text-gray-700  bg-white rounded-full py-3 px-7 outline-none focus:scale-110 hover:scale-110 active:scale-105"
          href="https://www.linkedin.com/in/johndoe"
          target="_blank"
        >
          <FaInstagram />
        </a>
      </motion.div>
    </section>
  );
}
