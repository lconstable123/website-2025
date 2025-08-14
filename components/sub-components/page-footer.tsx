"use client";
import React from "react";
import { motion } from "framer-motion";
export default function PageFooter() {
  return (
    <footer className="italic text-center px-6 text-gray-400/60 text-[7pt] leading-tight sm:text-[8pt] flex mt-30 mb-2">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 100 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-auto"
      >
        © Designed and developed by Luke Constable, 2025 . I acknowledge the
        traditional Wurrunderi Woi Wurrung owners of the land on which I work.
      </motion.p>
    </footer>
  );
}
