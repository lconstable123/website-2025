"use client";
import Image from "next/image";
import React, { Suspense, use, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import IntroCardTemplate from "./sub-components/intro-card-template";

import Rings from "./atomic/profile/rings";

import { useActiveSection } from "../context/active-section-context";
import ClickPrompt from "./sub-components/click-prompt";
import PhotoGradient from "./atomic/profile/photo-gradient";
import BgSpotlight from "./atomic/profile/bg-spotlight";

import ClickListener from "./atomic/click-listener";
import ScrollListener from "./atomic/scroll-listener";
import toast from "react-hot-toast";
import { useScreenContext } from "../context/screen-context";

export default function ProfilePhoto({ mt = "25" }: { mt?: string }) {
  const controls = useAnimation(); // 👈 useAnimation hook
  const { isMobile } = useScreenContext();
  const { scrollRef, scrollToElement } = useActiveSection();
  // const { buttonRef, pageClicked } = useContentClicked({
  //   ignoreSelf: false,
  //   debug: true,
  // });
  const { setProfileClicked, profileClicked } = useActiveSection();
  const handlePress = (e?: any) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (isPressed) {
      // toast.success("Already clicked!");
      return;
    }

    setProfileClicked((prev) => prev + 1);

    if (e) {
      controls.start({
        scale: [1, 0.94, 1.03, 1],

        transition: {
          duration: 0.65,
          times: [0, 0.2, 0.4, 1],
        },
      });
    }

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
        type: "spring",
        stiffness: 250,
        damping: 20,
        duration: 0.4,
      },
    });
  }, [controls]);

  return (
    <div className={` relative  ${mt} `}>
      {!profileClicked && <ClickListener handle={handlePress} />}
      {!profileClicked && <ScrollListener handle={handlePress} />}
      <motion.div
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
        // onMouseDown={() => setIsPressed(true)}
        onMouseDown={(e) => handlePress(e)}
        className={`ease-in-out -z-4`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <IntroCardTemplate
            rounded="rounded-full"
            secondaryRounded="rounded-full
          "
            outline={true}
          >
            <div className="cursor-pointer  bg-amber-200">
              <Image
                src="/new-images/profile2.jpg"
                alt="profile pic"
                width={400}
                height={400}
                quality={95}
                priority={true}
                className="h-50 w-50 sm:h-80 sm:w-80 z-30 object-cover shadow-xl pointer-events-none"
              />
            </div>

            <PhotoGradient />
          </IntroCardTemplate>
        </Suspense>
      </motion.div>
      <BgSpotlight />

      <Rings pressed={isPressed} />
      {/* <Rings pressed={isPressed} /> */}
      <ClickPrompt trigger={profileClicked > 0} />
    </div>
  );
}
