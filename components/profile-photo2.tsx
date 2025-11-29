"use client";
import Image from "next/image";
import React, { Suspense, use, useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import Rings from "./atomic/profile/rings";

import ClickPrompt from "./sub-components/click-prompt";
import PhotoGradient from "./atomic/profile/photo-gradient";
import BgSpotlight from "./atomic/profile/bg-spotlight";

import ClickListener from "./atomic/click-listener";
import ScrollListener from "./atomic/scroll-listener";
import toast from "react-hot-toast";
import { useScreenContext } from "../lib/context-providers/screen-context";
import { useActiveSection } from "../lib/context-providers/active-section-context";
import ClickPrompt2 from "./atomic/click-prompt";
import { mainThumbs } from "../lib/data/reel-data";

export default function ProfilePhoto2({ mt = "25" }: { mt?: string }) {
  const controls = useAnimation(); // 👈 useAnimation hook

  const { setProfileClicked, profileClicked } = useActiveSection();

  const handlePress = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isPressed) {
      return;
    }

    setProfileClicked((prev) => prev + 1);

    // if (e) {
    //   controls.start({
    //     scale: [1, 0.94, 1.03, 1],

    //     transition: {
    //       duration: 0.65,
    //       times: [0, 0.2, 0.4, 1],
    //     },
    //   });
    // }

    setIsPressed(true);

    setTimeout(() => {
      setIsPressed(false);
      // toast.success("Unclicked!");
    }, 300);
  };

  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    controls.start({
      opacity: 1,
      scale: 1,
      transition: {
        type: "tween",
        ease: "easeOut",
        stiffness: 250,
        damping: 20,
        duration: 0.4,
      },
    });
  }, [controls]);

  return (
    <div
      id="profilephoto"
      className={`pointer-events-auto! py-15 h-full relative  `}
    >
      {!profileClicked && <ClickListener handle={handlePress} />}
      {!profileClicked && <ScrollListener handle={handlePress} />}

      {/* <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={controls}
        // onTap={(e) => handlePress(e)}
        // whileHover={{ scale: 1.1 }}
        transition={{
          type: "tween",
          bounce: 2,
          stiffness: 200,
          damping: 20,
          duration: 2,
          delay: 0.5,
        }}
        onMouseDown={(e) => handlePress(e)}
        className={`origin-center  ease-in-out h-60 w-60 -z-4`}
      >
  
        <IntroCardTemplate
          rounded={true}
          secondaryRounded={true}
          outline={true}
        >
          <div className="cursor-pointer flex flex-row    bg-black">
            <Image
              src="/new-images/profile2.jpg"
              alt="profile pic"
              width={500}
              height={500}
              quality={95}
              priority={true}
              className="z-30 object-cover scale-150 translate-y-10  pointer-events-none"
            />
        
          </div>

   
        </IntroCardTemplate>
     
      </motion.div>
      <BgSpotlight /> */}

      <ClickPrompt trigger={profileClicked > 0} />
    </div>
  );
}

// const FADE_DURATION = 200; // in ms
// const DISPLAY_DURATION = 1000; // in ms
// const AttractorGallery = () => {
//   const [indexes, setIndexes] = useState([0, 1, 2]);
//   const [currentIndex, setCurrentIndex] = useState(3);
//   const [lastSlot, setLastSlot] = useState(-1);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Pick random slot (not same as last time)
//       let slot = Math.floor(Math.random() * 3);
//       while (slot === lastSlot) {
//         slot = Math.floor(Math.random() * 3);
//       }

//       // Calculate next image index
//       const next = (currentIndex + 1) % mainThumbs.length;

//       // Swap that slot with the new image
//       setIndexes((prev) => {
//         const newIndexes = [...prev];
//         newIndexes[slot] = next;
//         return newIndexes;
//       });

//       setCurrentIndex(next);
//       setLastSlot(slot);
//     }, FADE_DURATION + DISPLAY_DURATION);

//     return () => clearInterval(interval);
//   }, [currentIndex, lastSlot]);

//   return (
//     <div className="pointer-events-none opacity-90 bg-gray-800 flex flex-col h-full items-center justify-center">
//       {indexes.map((thumbIndex, i) => (
//         <div className="w-full h-1/3 overflow-hidden" key={i}>
//           <FadeImage key={thumbIndex} src={mainThumbs[thumbIndex]} />
//         </div>
//       ))}
//     </div>
//   );
// };

// const FadeImage = ({ src }: { src: string }) => (
//   <motion.img
//     key={src}
//     src={src}
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     transition={{ duration: FADE_DURATION / 1000 }}
//     className="h-[100px] w-[200px] object-cover fade-image"
//   />
// );
