"use client";
import React, { useRef } from "react";
import { categories } from "../../lib/data/reel-data";
import clsx from "clsx";
import { motion } from "framer-motion";
import { navigatorTypes } from "../../lib/utils/types";

import ClickPrompt2 from "./click-prompt";
import { useRouter } from "next/router";

export default function Navigator({
  selectedCategory,
  handleSelectCategory,
  inView,
}: navigatorTypes) {
  const navRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={navRef} className=" flex flex-col items-center">
      <nav className="  pt-5 sm:pt-7 flex flex-row  items-center justify-center relative ">
        <div
          className={clsx(
            "    group border-2  shadow-xl  shadow-black/20 transition-all  duration-600 border-yellow-700   hover:border-yellow-600 rounded-full my-0   flex flex-row gap-0 styleDarker top-0 text-center overflow-hidden "
          )}
        >
          {categories.map((category) => (
            <div
              key={category.title}
              onClick={() => {
                handleSelectCategory(category.title);
              }}
              className={clsx(
                "group w-[75px] sm:w-25 h-12 relative cursor-pointer not-last:border-r-1  border-white/5  transition-all duration-500 font-normal Text-primary text-md py-3 px-3  tracking-wider z-100  text-center"
              )}
            >
              {selectedCategory === category.title && (
                <motion.span
                  className="pointer-events-none absolute border-0 inset-0 border-yellow-600       bg-gray-900  w-full h-full z-0"
                  layoutId="activeSection"
                  transition={{
                    type: "tween",
                    duration: 0.12,
                  }}
                  style={{
                    y: 0, // lock Framer Motion y-animation
                  }}
                ></motion.span>
              )}
            </div>
          ))}

          {/*top writing*/}

          <div className=" flex absolute w-full h-full z-3000">
            {categories.map((category) => (
              <div
                key={category.title}
                onClick={() => {
                  handleSelectCategory(category.title);
                }}
                className={clsx(
                  "group w-18 sm:w-25 h-12   cursor-pointer transition-all duration-500 font-normal Text-primary text-md py-3 px-3  tracking-wide z-100  text-center"
                )}
              >
                <div className=" flex items-center  justify-center gap-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2   relative z-[999]">
                  {/* {category.title} */}
                  <div
                    className={clsx("text-xl transition-all ", {
                      "text-yellow-600": selectedCategory === category.title,
                    })}
                  >
                    {category.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <ClickPrompt2 Trigger={inView} ref={navRef} direction="up">
        explore categories
      </ClickPrompt2>
    </div>
  );
}
