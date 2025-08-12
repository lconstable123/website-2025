"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSectionInView } from "../../lib/hooks/hooks";
import toast from "react-hot-toast";

export default function Animbox() {
  const { ref } = useSectionInView("Home");
  const [flaming, setFlaming] = useState(true);
  const toggleFlaming = () => {
    setFlaming((prev) => !prev);
  };
  // Assuming you want to use the first project for the intro
  return (
    <section className="" id="home" ref={ref}>
      {/* <IntroCard /> */}

      <div
        onMouseEnter={() => {
          toast.success("Click to toggle animation!");
          toggleFlaming();
        }}
        onMouseLeave={() => toggleFlaming()}
      >
        {!flaming ? (
          <Image
            src="/16-4-2-3.gif"
            loading="eager"
            alt="Intro Image"
            width={150}
            height={70}
          />
        ) : (
          <Image
            src="/29-4-2-2.gif"
            loading="eager"
            alt="Intro Image"
            width={150}
            height={50}
          />
        )}
      </div>

      {/* <div className="w-full h-[2px] bg-amber-400"></div> */}
    </section>
  );
}
