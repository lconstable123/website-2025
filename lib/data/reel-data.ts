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
  clickthough?: boolean;
};

export type projectCard = projectType & {
  isInView: boolean;
  // isCategoryChanging: boolean;
};

/////////////////////////////////// Game Data

export const gameData: projectType[] = [
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
    imageUrl: "/new-images/thumbs/talk2_thumb.jpg",
    link: "https://lukeconstable.com/vids/Way-low.mp4",
    low: "https://lukeconstable.com/vids/Way-mobile.mp4",
    byline: "VR music video (2024)",
    playable: false,
  },
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
    imageUrl: "/new-images/thumbs/tb_thumb.jpg",
    link: "https://lukeconstable.com/vids/Tb-low.mp4",
    low: "https://lukeconstable.com/vids/Tb-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/fikaris_thumb.jpg",
    link: "https://lukeconstable.com/vids/Fikaris-low.mp4",
    low: "https://lukeconstable.com/vids/Fikaris-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/mars_thumb.jpg",
    link: "https://lukeconstable.com/vids/Deadspace-low.mp4",
    low: "https://lukeconstable.com/vids/Deadspace-mobile.mp4",
    byline: "Virtual Production (2023)",
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
    imageUrl: "/new-images/thumbs/pillars_thumb.jpg",
    link: "https://lukeconstable.com/vids/Pillars-low.mp4",
    low: "https://lukeconstable.com/vids/Pillars-mobile.mp4",
    byline: "Virtual Production (2023)",
    playable: false,
  },
];

/////////////////////////////////// Web Data

export const WebData: projectType[] = [
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
    imageUrl: "/new-images/thumbs/website_thumb.jpg",
    link: "https://lukeconstable.com/vids/react-mid.mp4",
    low: "https://lukeconstable.com/vids/react-low.mp4",
    byline: "React App",
    playable: true,
    playableLink: "https://lukeconstable.com",
    IsCodeDemo: true,
    git: "https://github.com/lconstable123/website-2025",
    clickthough: false,
  },
  {
    title: "Plans for the Planet",
    client: "Olaf Breuning | National Gallery of Victoria",
    description:
      "I worked on the design, animation and UI for this permanent exhibition at NGV kids.",
    tags: ["UI/UX", "2d Motion Design", "Immersive Design", "Learning Design"],
    imageUrl: "/new-images/thumbs/plans_thumb.png",
    link: "https://lukeconstable.com/vids/Plans-low.mp4",
    low: "https://lukeconstable.com/vids/Plans-mobile.mp4",

    byline: "Interactive Installation (2025)",
    playable: false,
  },
  {
    title: "Kaws Playtime",
    client: "Kaws | National Gallery of Victoria",
    description:
      "I developed bespoke shaders and a custom wireless controller to augment street artist Fikaris's decisive visual style into an interactive experience. It had a residency at Melbourne city library during Melbourne International Games week.",
    tags: ["UI/UX", "2d Motion Design", "After Effects", "Learning Design"],
    imageUrl: "/new-images/thumbs/kawsplaytime_thumb.jpg",
    link: "https://lukeconstable.com/vids/Kawsplaytime-low.mp4",
    low: "https://lukeconstable.com/vids/Kawsplaytime-mobile.mp4",
    byline: "Interactive Installation (2023)",
    playable: false,
  },
  {
    title: "Job Search App",
    client:
      "An app that allows users to search for jobs using a contemporary React-TanStack framework",
    description:
      "An app that allows users to search, save, and apply for jobs.",
    tags: [
      "React",

      "Tailwind",
      "Vite",

      "Tailwind",
      "TypeScript",

      "UI/UX",

      "Framer.motion",

      "Web Design",
    ],
    imageUrl: "/new-images/thumbs/react_thumb.jpg",
    link: "https://lukeconstable.com/vids/Jobsite-mid.mp4",
    // low: "https://lukeconstable.com/vids/Jobsite-mid.mp4",
    byline: "React App",
    playable: true,

    playableLink: "https://jobsite2.vercel.app/",
    IsCodeDemo: true,
    git: "https://github.com/lconstable123/jobsite2",
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
    imageUrl: "/new-images/thumbs/reel25_thumb.jpg",
    link: "https://lukeconstable.com/vids/Reel25-low.mp4",
    low: "https://lukeconstable.com/vids/Reel25-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/sa2_thumb.jpg",
    link: "https://lukeconstable.com/vids/SA-low.mp4",
    low: "https://lukeconstable.com/vids/Sa-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/terracotta_thumb.jpg",
    link: "https://lukeconstable.com/vids/Tc2-low.mp4",
    low: "https://lukeconstable.com/vids/Tc2-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/haring_thumb.jpg",

    link: "https://lukeconstable.com/vids/Haring2-low.mp4",
    low: "https://lukeconstable.com/vids/Haring2-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/companionship_thumb.jpg",
    link: "https://lukeconstable.com/vids/Kaws-social-low.mp4",
    low: "https://lukeconstable.com/vids/Kaws-social-mobile.mp4",
    byline: "Marketing content",
    playable: false,
    square: true,
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
    imageUrl: "/new-images/thumbs/god_thumb.jpg",
    link: "https://lukeconstable.com/vids/Gg-low.mp4",
    low: "https://lukeconstable.com/vids/Gg-mobile.mp4",
    byline: "Music Video (2017)",
    playable: false,
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
    imageUrl: "/new-images/thumbs/dali_thumb2.jpg",
    link: "https://lukeconstable.com/vids/Dali-low.mp4",
    low: "https://lukeconstable.com/vids/Dali-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/lyi_thumb.jpg",
    link: "https://lukeconstable.com/vids/Lyi-low.mp4",
    low: "https://lukeconstable.com/vids/Lyi-mobile.mp4",
    byline: "Music Video (2019)",
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
    imageUrl: "/new-images/thumbs/bg_thumb.jpg",
    link: "https://lukeconstable.com/vids/Bu2-low.mp4",
    low: "https://lukeconstable.com/vids/Bu2-mobile.mp4",
    byline: "Motion Design",
    playable: false,
    square: true,
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
    imageUrl: "/new-images/thumbs/pxels2_thumbs.jpg",
    link: "https://lukeconstable.com/vids/Wdwds-low.mp4",
    low: "https://lukeconstable.com/vids/Wdwds-mobile.mp4",
    byline: "Viral Video",
    playable: false,
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
    imageUrl: "/new-images/thumbs/event_thumb.jpg",
    link: "https://lukeconstable.com/vids/Events2-low.mp4",
    low: "https://lukeconstable.com/vids/Events2-mobile.mp4",
    byline: "Live Event Visuals (2019-2022)",
    playable: false,
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
    imageUrl: "/new-images/thumbs/social_thumb.jpg",
    link: "https://lukeconstable.com/vids/Social-low.mp4",
    low: "https://lukeconstable.com/vids/Social-mobile.mp4",
    byline: "Social Media (2017-2022)",
    playable: false,
    square: true,
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
    imageUrl: "/new-images/thumbs/heroes_thumb.jpg",
    link: "https://lukeconstable.com/vids/Tmnt-low.mp4",
    low: "https://lukeconstable.com/vids/Tmnt-mobile.mp4",
    byline: "Immersive Experience (2025)",
    playable: false,
  },

  {
    title: "Let's Build: The Internet",
    client: "ClickView",
    description:
      "I adapted visual artist Matt Blue's graphic novel into 3d adventure game, as part of an exhibition residency at Backwoods Gallery, Fitzroy.",
    tags: [
      "3d Motion Design",
      "Art Direction",
      "C4D",
      "Learning Design",
      "2d Motion Design",
      "Editing",
      "Post-Production",
      "After Effects",
      "Project Management",
    ],
    imageUrl: "/new-images/thumbs/Ict_thumb.jpg",
    link: "https://lukeconstable.com/vids/Ict-low.mp4",
    low: "https://lukeconstable.com/vids/Ict-mobile.mp4",
    byline: "Eductational Programme (2017)",
    playable: false,
  },
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
    imageUrl: "/new-images/thumbs/mia_thumb.jpg",
    link: "https://lukeconstable.com/vids/Mia-low.mp4",
    low: "https://lukeconstable.com/vids/Mia-mobile.mp4",

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
    imageUrl: "/new-images/thumbs/rennie_thumb.png",
    link: "https://lukeconstable.com/vids/27-low.mp4",
    low: "https://lukeconstable.com/vids/27-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/one_thumb.jpg",
    link: "https://lukeconstable.com/vids/Ytoo-low.mp4",
    low: "https://lukeconstable.com/vids/Ytoo-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/missme_thumb.jpg",
    link: "https://lukeconstable.com/vids/Missme-low.mp4",
    low: "https://lukeconstable.com/vids/Missme-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/29-4-diffusion[square]_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/29-4-diffusion[square].mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/29-4-diffusion[square].mp4",
    byline: "Solver study",
    playable: false,
    square: true,
  },
  {
    title: "Study in spiral",
    client: "created a procedural tool that creates a cute ball animation",
    description: "",
    tags: ["Houdini", "3d Motion Design", "VEX", "Simulations"],
    imageUrl: "/new-images/thumbs/2_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/2.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/2.mp4",
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
    imageUrl: "/new-images/thumbs/flippies_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/flippies_bts[square].mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/flippies_bts[square].mp4",
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
    imageUrl: "/new-images/thumbs/Ringo_thumb.jpg",
    link: "https://lukeconstable.com/vids/Ringo-low.mp4",
    low: "https://lukeconstable.com/vids/mobile/Ringo-mobile.mp4",
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
    imageUrl: "/new-images/thumbs/floppy_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/30-4-4.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/30-4-4.mp4",
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
    imageUrl: "/new-images/thumbs/30-2-24_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/12_2_24_glass_square.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/12_2_24_glass_square.mp4",
    byline: "Trigonometry Experiment",
    playable: false,
    square: true,
  },

  {
    title: "Gross",
    client: "Procedural Shaders, simulated.  A study in gross.",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/24-2-24_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/24-2-24.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/24-2-24.mp4",
    byline: "Simulation study",
    playable: false,
    square: true,
  },
  {
    title: "Advection",
    client: "Pushing particles around with a gas field.",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/20-2_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/20-2.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/20-2.mp4",
    byline: "Particle advection study",
    playable: false,
    square: true,
  },
  {
    title: "Performance",
    client: "Mocap and particles",
    description: "",
    tags: ["Houdini", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/24-3_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/24_3.mp4",
    low: "https://lukeconstable.com/vids/mobile/VA/24_3.mp4",
    byline: "Motion capture study",
    playable: false,
    square: true,
  },
  {
    title: "Pyro",
    client: "Animation and Pyro",
    description: "",
    tags: ["Blender", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/29-4-2_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/29-4-2.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/29-4-2.mp4",
    byline: "Pyro solver study",
    playable: false,
    square: true,
  },
  {
    title: "Cloth growth",
    client: "Cloth Study",
    description: "",
    tags: ["Houdini", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/12-10_2_1_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/12-10_2_1.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/12-10_2_1.mp4",
    byline: "Cloth solver study",
    playable: false,
    square: true,
  },
  {
    title: "AI",
    client: "Feeding Stable diffusion into Blender, and playing with particles",
    description: "",
    tags: ["Blender", "Python", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/4-12_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/4-12.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/4-12.mp4",
    byline: "Ai and 3d study",
    playable: false,
    square: true,
  },
  {
    title: "Flap",
    client: "More fooling around with animation and vellum",
    description: "",
    tags: ["Blender", "Python", "3d Motion Design", "Simulations"],
    imageUrl: "/new-images/thumbs/4-5_thumb.jpg",
    link: "https://lukeconstable.com/vids/VA/4-5.mp4",
    low: "https://lukeconstable.com/vids/VA/mobile/4-5.mp4",
    byline: "Animation study",
    playable: false,
    square: true,
  },
];
