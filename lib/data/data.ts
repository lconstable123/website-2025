import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "Reel",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "Graduated bootcamp",
    location: "Miami, FL",
    description:
      "I graduated after 6 months of studying. I immediately found a job as a front-end developer.",
    icon: React.createElement(LuGraduationCap),
    date: "2019",
  },
  {
    title: "Front-End Developer",
    location: "Orlando, FL",
    description:
      "I worked as a front-end developer for 2 years in 1 job and 1 year in another job. I also upskilled to the full stack.",
    icon: React.createElement(CgWorkAlt),
    date: "2019 - 2021",
  },
  {
    title: "Full-Stack Developer",
    location: "Houston, TX",
    description:
      "I'm now a full-stack developer working as a freelancer. My stack includes React, Next.js, TypeScript, Tailwind, Prisma and MongoDB. I'm open to full-time opportunities.",
    icon: React.createElement(FaReact),
    date: "2021 - present",
  },
] as const;

export const assets = ["Reliable", "Versatile", "Problem Solving"] as const;
export const frameworks = {
  title: "Frameworks",
  blurb:
    "I'm always refreshing my application of the latest development frameworks to ensure I have a strong technical foundation.",
  tools: [
    "React",
    "JavaScript",
    "TypeScript",
    "Python",
    "HTML",
    "C++",
    "C#",
    "Next.JS",
    "Vite",
    "Context API",
    "TanStack",
    "Zod",
  ],
} as const;
export const UI = {
  title: "UI",
  blurb:
    "I've got a strong design and UI background, having worked for many years with luxury clients and the education sector.",
  tools: [
    "CSS",
    "Tailwind",
    "Figma",
    "Illustrator",
    "After Effects",
    "Photoshop",
    "Shadcn",
    "RadixUI",
    "React-hook-form",
    "Formik",
    "Embla-carousel",
    "Framer.motion",
    "UI/UX",
    "Shader Design",
    "Simulations",
    "Fabrication",
  ],
} as const;
export const Game = {
  title: "3d and Game Development",
  blurb: "I love making games and 3d art. My practice is a deep dive",
  tools: [
    "Unity",
    "Unreal Engine",
    "Unreal Blueprints",
    "Unreal C++",
    "Houdini",
    "VEX",
    "Blender",
    "Maya",
    "C4D",
    "Substance",
  ],
} as const;
export const backend = {
  title: "Backend",
  blurb:
    "Backend is newer for me, but I've been making myself familiar using the latest tools.",
  tools: [
    "Flask",
    "Express",
    "SQLAlchemy",
    "SQL-lite",
    "Prisma",
    "Pytest",
    "SQLite",
    "Docker",
    "Git",
    "Amazon EC2",
    "Jest",
    "Vercel",
  ],
} as const;
export const other = {
  title: "Lo-fi",
  blurb:
    "I have a diverse skill set that stretches the entire produciton pipline.  I've worked in many roles, with many different hats.",
  tools: [
    "Management",
    "Lighting",
    "Post-Production",
    "Public Speaking",
    "Immersive Design",
    "Workshop Facilitation",
    "Learning Design",
    "Art Direction",
    "Cinematography",
    "Editing",
    "Game Design",
    "Full Stack Development",
    "Web Design",
    "3d Motion Design",
    "2d Motion Design",
    "VR",
    "Motion Capture",
    "Project Management",
    "3d Assets",
    "Puppetry",
  ],
} as const;

export const allSkills = [
  ...frameworks.tools,
  ...UI.tools,
  ...Game.tools,
  ...backend.tools,
  ...other.tools,
];

export type SkillSelection = (typeof allSkills)[number];

export const headerData = {
  name: "Luke Constable",
  label: "Creative Developer",
  blurb:
    "I'm a technical artist, accomplished interactive developer, and award-winning director with a strong track record of collaborating with some of Melbourne’s most respected cultural and educational institutions.",
} as const;
