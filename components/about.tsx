"use client";
import React from "react";
import SectionHeading from "./section-heading";
import { delay, motion } from "framer-motion";
export default function About() {
  return (
    <motion.section
      className="text-center mb-28 max-w-[45rem] leading-8 sm:mb-40 scroll-mt-28"
      id="about"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
    >
      <SectionHeading>About Me</SectionHeading>

      <p>
        I am a software engineer with a passion for building web applications.
      </p>
      <p>
        I have experience in various technologies, including React, Node.js, and
        MongoDB.
      </p>
    </motion.section>
  );
}
