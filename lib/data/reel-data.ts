import React from "react";
import { AiTwotoneExperiment } from "react-icons/ai";
import { BiMovie } from "react-icons/bi";
import { FaCode } from "react-icons/fa";
import { TbKeyframes } from "react-icons/tb";
import { RefinedSkillSelection } from "./skills-data";
import { TbDeviceGamepad } from "react-icons/tb";

export const categories = [
  // { title: "Reel", icon: React.createElement(FaCode) },
  { title: "Web", icon: React.createElement(FaCode) },
  { title: "Interactivity", icon: React.createElement(TbDeviceGamepad) },
  // { title: "Motion", icon: React.createElement(TbKeyframes) },
  { title: "Direction", icon: React.createElement(BiMovie) },
  { title: "Experiments", icon: React.createElement(AiTwotoneExperiment) },
] as const;

export const mainThumbs = [
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/melbstreet.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/tb_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/poke_thumb.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/hooks_thumb.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/fikaris_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/mars_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/plans_thumb.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/kawsplaytime_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/sa_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/terracotta_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/haring_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/dali_thumb2.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/lyi_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/god_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/29-4-diffusion[square]_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/flippies_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/social_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/shoe_thumb.jpg",
];

type projectType = {
  title: string;
  client: string;
  description?: string;
  tags: RefinedSkillSelection[];
  imageUrl: string;
  link?: string;
  low?: string;
  byline?: string;
  playable?: boolean;
  playableLink?: string;
  square?: boolean;
  IsCodeDemo?: boolean;
  git?: string;
  figma?: string;
  clickthough?: boolean;
};

export type projectCard = projectType & {
  isInView: boolean;
  isImagesLoaded: boolean;
  // isCategoryChanging: boolean;
};

//////////////////////////////// Image Data

export const webThumbs = [
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/tb_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/fikaris_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/mars_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/talk_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/pillars_thumb.webp",
];

export const InterThumbs = [
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/website_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/melbstreet.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/hooks_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/shoe_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/poke_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/plans_thumb.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/kawsplaytime_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/react_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/anzac_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/manyhands_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/ict_thumb.webp",
];

export const LoFiThumbs = [
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/reel25_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/sa_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/terracotta_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/haring_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/companionship_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/social_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/dali_thumb2.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/lyi_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/god_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/pxels2_thumbs.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/bu_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/event_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/heroes.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/Ict_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/mia_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/rennie_thumb.png",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/one_thumb.webp",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/missme_thumb.webp",
];

export const ExperiThumbs = [
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/29-4-diffusion[square]_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/flippies_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/ringo_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/floppy_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/30-2-24_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/20-2_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/24-3_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/12-10_2_1_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/4-12_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/4-5_thumb.jpg",
  "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/livecode_thumb.jpg",
];

/////////////////////////////////// Game Data

export const gameData: projectType[] = [
  {
    title: "Return of the Time Bandit",
    client: "Matt Blue | Backwoods Gallery",
    description:
      "I adapted visual artist Matt Blue's graphic novel into 3d adventure game, as part of an exhibition residency at Backwoods Gallery, Fitzroy.",
    tags: [
      "Unity",
      "C#",
      "Blender",
      "Game Design",
      "Art Direction",
      "3d Assets",
      "UI/UX",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/tb_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tb-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tb-mobile.mp4",
    byline: "Interactive Installation (2025)",
    playable: true,
    playableLink:
      "https://play.unity.com/en/games/53ff6141-9b43-42f6-b07c-daba626c4c4a/the-time-bandit-beta-v12",
  },

  {
    title: "Studio",
    client: "Fikaris | Melbourne International Games Week",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Unreal Engine",
      "C++",

      "Project Management",
      "Game Design",
      "3d Assets",
      "Shader Design",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/fikaris_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Fikaris-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Fikaris-mobile.mp4",
    byline: "Interactive Installation (2023)",
    playable: false,
  },
  {
    title: "Distant Space",
    client: "Deakin MotionLab ",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Unreal Engine",
      "Game Design",
      "3d Assets",

      "Blender",
      "Art Direction",
      "Substance",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/mars_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Deadspace-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Deadspace-mobile.mp4",
    byline: "Virtual Production (2023)",
    playable: false,
  },
  {
    title: "The Way You Talk",
    client: "Darling James",
    description:
      "I captured Darling James with a Rokoko smartuit, I augmented the data with some tools I developed in houdini, and then sent it for realtime render in Unreal.",
    tags: [
      "Unreal Engine",
      "Houdini",
      "C++",

      "Art Direction",

      "Blender",

      "Cinematography",
      "VEX",

      "Project Management",
      "3d Assets",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/talk_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Way-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Way-mobile.mp4",
    byline: "VR music video (2024)",
    playable: false,
  },
  {
    title: "Four Pillars",
    client: "Deakin MotionLab",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Unreal Engine",
      "3d Assets",
      "Learning Design",
      "Blender",
      "Art Direction",
      "Substance",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/pillars_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Pillars-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Pillars-mobile.mp4",
    byline: "Virtual Production (2023)",
    playable: false,
  },
];

/////////////////////////////////// Web Data

export const WebData: projectType[] = [
  {
    title: "Kaws Playtime",
    client: "Kaws | National Gallery of Victoria",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne City Library during Melbourne International Games Week.",
    tags: ["UI/UX", "2d Motion Design", "After Effects", "Learning Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/kawsplaytime_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Kawsplaytime-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Kawsplaytime-mobile.mp4",
    byline: "Interactive Installation (2023)",
    playable: false,
  },
  {
    title: "Plans for the Planet",
    client: "Olaf Breuning | National Gallery of Victoria",
    description:
      "I worked on the design, animation and UI for this permanent exhibition at NGV kids.",
    tags: ["UI/UX", "2d Motion Design", "Immersive Design", "Learning Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/plans_thumb.png",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Plans-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Plans-mobile.mp4",

    byline: "Interactive Installation (2025)",
    playable: false,
  },

  {
    title: "Australian War Memorial- Anzac Hall",
    client:
      "Working with Grumpy Sailor to develop a touch screen kiosk experience built in Unreal for the Australian War Memorial's Anzac Hall.",
    description: "",
    tags: ["Figma", "Unreal Engine"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/anzac_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Anzac_low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Anzac_mobile.mp4",
    byline: "Interactive Kiosk",

    playable: false,

    // playableLink: "https://melbglyphs.vercel.app/",
    IsCodeDemo: false,

    // git: "https://github.com/lconstable123/melbGlyphs",
  },
  {
    title: "PokeApp",
    client:
      "I designed this app that fetches from an API and stores on Postgres to with cutting edge full-stack, optimistic UI, and authentication.",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "React",
      "TypeScript",
      "Framer.motion",
      "Authentication",
      "Full-Stack",
      "Web Design",
      "Figma",
      "Tailwind",
      "Next.JS",
      "UI/UX",
      "Framer.motion",
      "Back-End",
      "Optimistic UI",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/poke_thumb.png",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/react-mid.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/react-low.mp4",
    byline: "React App",

    playable: true,

    playableLink: "https://pokemanager.vercel.app/",
    IsCodeDemo: true,

    git: "https://github.com/lconstable123/pokemanager",
    figma:
      "https://www.figma.com/site/ZcR2vHTTx1aPtWgONZFTHe/Untitled?node-id=0-1&t=WxxQnBj1wSVkmk0L-1",
  },
  {
    title: "Ecommerce demo",
    client:
      "A headless cms ready, mobile-first ecommerce site with Figma, React and Next.",
    description:
      "A headless cms ready, mobile-first ecommerce site for a totally made up shoe company",
    tags: [
      "React",
      "TypeScript",
      "Full-Stack",
      "Web Design",
      "Figma",
      "Tailwind",
      "Next.JS",
      "UI/UX",
      "Headless",
    ],

    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    byline: "Ecommerce Site",
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/melbstreet.png",

    // imageUrl: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/hooks_thumb.png",
    playable: true,
    playableLink: "https://shoesite-sooty.vercel.app/",
    IsCodeDemo: true,
    git: "https://github.com/lconstable123/shoesite",
    figma:
      "https://www.figma.com/design/GPhhJDOqG3orqjtD3CGDkr/Shoesite?t=L8ffhdv0HnExpe2W-1",
  },
  {
    title: "Many Hands Plugin - Make Light Work",
    client:
      "I developed a Three.js extension to make designing lights in WebGL fast and designer-friendly.",
    description: "",
    tags: ["React", "TypeScript", "Web Design", "UI/UX", "Three.js", "WebGL"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/manyhands_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Manyhands_low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Manyhands_mobile.mp4",
    byline: "Three.js App",

    playable: false,

    playableLink: "https://melbglyphs.vercel.app/",
    IsCodeDemo: false,

    git: "https://8617126054488.gumroad.com/l/manyhands",
  },
  {
    title: "Melbourne Street Project",
    client:
      "A full stack app that geotags and maps street art in Melbourne and with GraphQL, AWS Lambda, S3 and DynamoDB.",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "React",
      "TypeScript",
      "Framer.motion",
      "Full-Stack",
      "Web Design",
      "Figma",
      "Tailwind",
      "Next.JS",
      "UI/UX",
      "Back-End",
      "AWS",
      "DynamoDB",
      "GraphQL",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/melbstreet.png",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    byline: "Full Stack Community Project",

    playable: true,

    playableLink: "https://melbglyphs.vercel.app/",
    IsCodeDemo: true,

    git: "https://github.com/lconstable123/melbGlyphs",
  },

  {
    title: "Let's Build the Internet",
    client: "ClickView",
    description:
      "I produced, designed, and animated this internationally popular curriculum series on ICT principles.",
    tags: ["UI/UX", "2d Motion Design", "Immersive Design", "Learning Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/ict_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ict_Mobile.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ict_Mobile.mp4",

    byline: "Educational Series (2018)",
    playable: false,
  },

  {
    title: "React Hooks",
    client: "A repo of useful hooks i've developed. Checkout the Readme",
    // link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    // low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: ["React", "TypeScript", "Framer.motion"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/hooks_thumb.png",
    byline: "React Repo",
    clickthough: false,
    playable: false,
    IsCodeDemo: true,
    git: "https://github.com/lconstable123/BespokeHooks",
  },
  {
    title: "lukeconstable.com",
    client:
      "I developed this self hosted media streaming player and interface.  Readme on GIT.",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "React",
      "Web Design",
      "Tailwind",

      "Tailwind",
      "TypeScript",

      "UI/UX",
      "Figma",
      "Next.JS",

      "Framer.motion",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/website_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    byline: "React App",
    playable: true,
    playableLink: "https://lukeconstable.com",
    IsCodeDemo: true,
    git: "https://github.com/lconstable123/website-2025",
    clickthough: false,
  },
];

/////////////////////////////////// Animation Data

export const LoFiData: projectType[] = [
  {
    title: "Highlights Reel",
    client: "VirtuallyAnything",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "3d Motion Design",
      "Immersive Design",
      "Learning Design",

      "2d Motion Design",
      "Web Design",
      "Art Direction",

      "Cinematography",
      "Post-Production",

      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/reel25_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Reel25-mobile.mp4",
    byline: "Showreel",
    playable: false,
  },
  {
    title: "Street Art Alive!",
    client: "The Lume | Grande Experiences",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "3d Motion Design",
      "2d Motion Design",
      "Immersive Design",
      "After Effects",
      "C4D",
      "Simulations",
      "Art Direction",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/sa_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/SA-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Sa-mobile.mp4",
    byline: "Interactive Installation (2023)",
    playable: false,
  },

  {
    title: "Terracotta Warriors & Cai Guo-Qiang",
    client: "NGV | Cai Guo-Qiang",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Editing",
      "2d Motion Design",
      "Cinematography",
      "Post-Production",

      "3d Motion Design",
      "Art Direction",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/terracotta_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tc2-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tc2-mobile.mp4",
    byline: "Motion Design",
    playable: false,
    square: true,
  },

  {
    title: "Crossing Lines",
    client: "NGV | Haring x Basquiat",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Immersive Design",
      "Editing",
      "Art Direction",
      "2d Motion Design",
      "Cinematography",
      "Post-Production",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/haring_thumb.jpg",

    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Haring2-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Haring2-mobile.mp4",
    byline: "Marketing Content, Exhibition screen content (2023)",
    playable: false,
  },
  {
    title: "Kaws: Companionship",
    client: "National Gallery of Victoria | Kaws",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "Editing",
      "Art Direction",
      "Lighting",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/companionship_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Kaws-social-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Kaws-social-mobile.mp4",
    byline: "Marketing content",
    playable: false,
    square: true,
  },
  {
    title: "Social Media Screens",
    client: "Mushroom Group | Frontier Touring",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "3d Motion Design",
      "2d Motion Design",
      "After Effects",
      "C4D",
      "Simulations",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/social_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Social-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Social-mobile.mp4",
    byline: "Social Media (2017-2022)",
    playable: false,
    square: true,
  },

  {
    title: "Dali Alive!",
    client: "The LUME | Grande Experiences",
    description:
      "I adapted visual artist Matt Blue's graphic novel into 3d adventure game, as part of an exhibition residency at Backwoods Gallery, Fitzroy.",
    tags: [
      "Immersive Design",
      "2d Motion Design",
      "3d Motion Design",
      "Editing",
      "Post-Production",
      "After Effects",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/dali_thumb2.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Dali-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Dali-mobile.mp4",
    byline: "Immersive Experience (2025)",
    playable: false,
  },

  {
    title: "Letting You In",
    client: "Mid Ayr",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Cinematography",
      "Art Direction",
      "Editing",
      "Project Management",
      "Post-Production",
      "Fabrication",
      "Lighting",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/lyi_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Lyi-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Lyi-mobile.mp4",
    byline: "Music Video (2019)",
    playable: false,
  },
  {
    title: "God's Graffiti",
    client: "Darling James",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "Editing",
      "Art Direction",
      "Lighting",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/god_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Gg-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Gg-mobile.mp4",
    byline: "Music Video (2017)",
    playable: false,
  },
  {
    title: "Why Don't We Do Something",
    client: "Hey Geronimo",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Editing",

      "2d Motion Design",
      "Cinematography",
      "Post-Production",
      "Lighting",
      "3d Motion Design",
      "Art Direction",
      "Fabrication",
      "After Effects",
      "Project Management",
      "Post-Production",
      "Web Design",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/pxels2_thumbs.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Wdwds-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Wdwds-mobile.mp4",
    byline: "Viral Video",
    playable: false,
  },

  {
    title: "Burger Urge Campaigns",
    client: "Burger Urge",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "Editing",

      "2d Motion Design",
      "Cinematography",
      "Post-Production",
      "Lighting",
      "3d Motion Design",
      "Art Direction",
      "Simulations",
      "After Effects",
      "Project Management",
      "Post-Production",
      "Web Design",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/bu_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Bu2-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Bu2-mobile.mp4",
    byline: "Motion Design",
    playable: false,
    square: true,
  },

  {
    title: "Event Screens",
    client: "Mushroom Group | Chugg Entertainment | Frontier Touring",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: [
      "3d Motion Design",
      "2d Motion Design",
      "Immersive Design",
      "After Effects",
      "C4D",
      "Simulations",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/event_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Events2-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Events2-mobile.mp4",
    byline: "Live Event Visuals (2019-2022)",
    playable: false,
  },

  {
    title: "Heroes in Half Shell: TMNT 20 Year Anniversary",
    client: "Paramount | TNMT",
    description:
      "I adapted visual artist Matt Blue's graphic novel into 3d adventure game, as part of an exhibition residency at Backwoods Gallery, Fitzroy.",
    tags: [
      "Immersive Design",
      "2d Motion Design",
      "Editing",
      "Post-Production",
      "After Effects",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/heroes.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tmnt-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Tmnt-mobile.mp4",
    byline: "Immersive Experience (2025)",
    playable: false,
  },

  // {
  //   title: "Let's Build: The Internet",
  //   client: "ClickView",
  //   description:
  //     "I adapted visual artist Matt Blue's graphic novel into 3d adventure game, as part of an exhibition residency at Backwoods Gallery, Fitzroy.",
  //   tags: [
  //     "3d Motion Design",
  //     "Art Direction",
  //     "C4D",
  //     "Learning Design",
  //     "2d Motion Design",
  //     "Editing",
  //     "Post-Production",
  //     "After Effects",
  //     "Project Management",
  //   ],
  //   imageUrl: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/Ict_thumb.webp",
  //   link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ict-low.mp4",
  //   low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ict-Mobile.mp4",
  //   byline: "Eductational Programme (2017)",
  //   playable: false,
  // },
];
/////////////////////////////////// Animation Data

export const DirectorData: projectType[] = [
  {
    title: "Beautiful and Bittersweet",
    client: "Mia Rodriguez",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "2d Motion Design",
      "Editing",
      "Art Direction",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/mia_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Mia-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Mia-mobile.mp4",

    byline: "Music Video (2020)",
    playable: false,
  },

  {
    title: "21",
    client: "Josh Rennie Hynes",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "Editing",
      "Art Direction",
      "Lighting",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/rennie_thumb.png",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/27-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/27-mobile.mp4",
    byline: "Music Video (2018)",
    playable: false,
  },
  {
    title: "You're the Only One I Need Now",
    client: "Darling James",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "Editing",
      "Art Direction",
      "Lighting",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/one_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ytoo-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ytoo-mobile.mp4",
    byline: "Music Video (2017)",
    playable: false,
  },

  {
    title: "Go Away and Miss Me",
    client: "Stephen Grady",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "Cinematography",
      "Post-Production",
      "Editing",
      "Art Direction",
      "Project Management",
    ],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/missme_thumb.webp",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Missme-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Missme-mobile.mp4",
    byline: "Music Video (2020)",
    playable: false,
  },
];

export const ExperimentData: projectType[] = [
  {
    title: "Cell Diffusion",
    client: "created a cell diffusion solver",
    description: "",
    tags: ["Houdini", "3d Motion Design", "VEX", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/29-4-diffusion[square]_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/29-4-diffusion[square].mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/29-4-diffusion[square].mp4",
    byline: "Solver study",
    playable: false,
    square: true,
  },
  {
    title: "Gsap + Gaussian distribution ",
    client: "A test using React and GSAP",
    description:
      "Exploring the interactive web motion capabilities of React and GSAP, with a little maths.",
    tags: ["Web Design", "GSAP", "React", "TypeScript", "Tailwind"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/livecode_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Livecode_low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Livecode_mobile.mp4",
    byline: "A test using React and GSAP",
    playable: false,
    square: true,
  },
  {
    title: "Study in spiral",
    client: "created a procedural tool that creates a cute ball animation",
    description: "",
    tags: ["Houdini", "3d Motion Design", "VEX", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/2_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/2.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/2.mp4",
    byline: "procedual VEX study",
    playable: false,
    square: true,
  },
  {
    title: "Spline to Animation",
    client: "Procedual animation from spine tool built in VEX",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: ["Houdini", "VEX", "3d Motion Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/flippies_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/flippies_bts[square].mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/flippies_bts[square].mp4",
    byline: "Houdini tool",
    playable: false,
    square: true,
  },
  {
    title: "Ringo's Stressful Trip",
    client: "2d Unity and Mobile test",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: ["UI/UX", "2d Motion Design", "Unity", "C#"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/ringo_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ringo-low.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/main/Ringo-low.mp4",
    byline: "mobile app",
    playable: false,

    square: true,
    playableLink: "",
  },

  {
    title: "Floppy",
    client: "Just a bit of fun with vellum simulation",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: ["Houdini", "VEX", "Blender", "3d Motion Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/floppy_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/30-4-4.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/30-4-4.mp4",
    byline: "Blender Animation",
    playable: false,
    square: true,
  },
  {
    title: "Trig",
    client: "Procedural Geometry and a bespoke particle solver",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: ["Houdini", "VEX", "Blender", "Simulations", "3d Motion Design"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/30-2-24_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/12_2_24_glass_square.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/12_2_24_glass_square.mp4",
    byline: "Trigonometry Experiment",
    playable: false,
    square: true,
  },

  {
    title: "Gross",
    client: "Procedural Shaders, simulated.  A study in gross.",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/24-2-24_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/24-2-24.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/24-2-24.mp4",
    byline: "Simulation study",
    playable: false,
    square: true,
  },
  {
    title: "Advection",
    client: "Pushing particles around with a gas field.",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/20-2_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/20-2.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/20-2.mp4",
    byline: "Particle advection study",
    playable: false,
    square: true,
  },
  {
    title: "Performance",
    client: "Mocap and particles",
    description: "",
    tags: ["Houdini", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/24-3_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/24_3.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/24_3.mp4",
    byline: "Motion capture study",
    playable: false,
    square: true,
  },
  {
    title: "Pyro",
    client: "Animation and Pyro",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/29-4-2_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/29-4-2.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/29-4-2.mp4",
    byline: "Pyro solver study",
    playable: false,
    square: true,
  },
  {
    title: "Cloth growth",
    client: "Cloth Study",
    description: "",
    tags: ["Houdini", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/12-10_2_1_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/12-10_2_1.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/12-10_2_1.mp4",
    byline: "Cloth solver study",
    playable: false,
    square: true,
  },
  {
    title: "AI",
    client: "Feeding Stable diffusion into Blender, and playing with particles",
    description: "",
    tags: ["Blender", "Python", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/4-12_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/4-12.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/4-12.mp4",
    byline: "Ai and 3d study",
    playable: false,
    square: true,
  },
  {
    title: "Flap",
    client: "More fooling around with animation and vellum",
    description: "",
    tags: ["Blender", "Python", "3d Motion Design", "Simulations"],
    imageUrl:
      "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/thumbs/4-5_thumb.jpg",
    link: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/4-5.mp4",
    low: "https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/va/4-5.mp4",
    byline: "Animation study",
    playable: false,
    square: true,
  },
];
