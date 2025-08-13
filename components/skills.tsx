"use client";
import React from "react";

import { motion } from "framer-motion";
import clsx from "clsx";

import { shuffleArray } from "../lib/utils/utils";
import { RefinedSkillSelection } from "../lib/data/skills-data";
import { useSkillSetContext } from "../lib/context-providers/skillset-context";

type skillsType = {
  skills?: RefinedSkillSelection[];
  selectedSkills?: RefinedSkillSelection[];
  format?: "list" | "grid";
};

type skillsGridType = {
  skills?: RefinedSkillSelection[];
  selectedSkills?: RefinedSkillSelection[];
  isInEyeline?: boolean;
};

export default function Skills2({
  skills,
  selectedSkills,
  format = "grid",
}: skillsType) {
  // const { ref } = useSectionInView("Skills");

  const fadeInAnimationVariants = {
    initial: { opacity: 0, y: 100 },
    inView: { opacity: 1, y: 0 },

    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05 },
    }),
  };
  const { isInEyeline } = useSkillSetContext();

  return (
    <section className=" mb-4 px-3   text-center  font-light tracking-wider leading-tight  Text-secondary">
      <ul className=" flex flex-wrap justify-center sm:gap-x-[6px] gap-x-[8px] gap-y-[6px] sm:gap-y-[7px] text-[5pt] sm:text-[9pt] ">
        {format === "grid" ? (
          <SkillsGrid
            isInEyeline={isInEyeline}
            skills={skills}
            selectedSkills={selectedSkills}
          />
        ) : (
          <SkillsLine selectedSkills={selectedSkills} />
        )}
      </ul>
    </section>
  );
}
//----------------------------- sub components -----------------------------
const SkillsGrid = ({
  skills,
  isInEyeline,
  selectedSkills,
}: skillsGridType) => {
  return (
    <>
      {skills?.map((skill) => (
        <motion.li
          key={skill}
          transition={{ type: "tween", stiffness: 500, damping: 30 }}
          className={clsx(
            "border-0 bg-gray-950 rounded-b-md  overflow-hidden transition-all  outline-1 rounded-t-xs duration-600 delay-50 py-[1px] px-2  hover:bg-gray-800",
            isInEyeline
              ? selectedSkills?.includes(skill)
                ? "text-white outline-white/30     "
                : "text-white/10 outline-gray-950   "
              : "text-white/20 outline-gray-950/0  "
          )}
        >
          {skill}
        </motion.li>
      ))}
    </>
  );
};
//------------------------------------------------
const SkillsLine = ({ selectedSkills }: skillsGridType) => {
  return (
    <>
      {selectedSkills?.map((skill) => (
        <motion.li
          key={skill}
          transition={{ type: "tween", stiffness: 500, damping: 30 }}
          className={clsx(
            "text-white outline-white/30 border-0 bg-gray-950 rounded-b-md  overflow-hidden transition-all  outline-1 rounded-t-xs duration-600 delay-50 py-[1px] px-2  hover:bg-gray-800"
          )}
        >
          {skill}
        </motion.li>
      ))}
    </>
  );
};
