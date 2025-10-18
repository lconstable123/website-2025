"use client";

import Intro from "../../components/intro";
import Projects from "../../components/projects";

import ContactLinks from "../../components/sub-components/contactLinks";

import ProfilePhoto from "../../components/profile-photo";

import { Suspense, useEffect } from "react";
import Loader from "../../components/sub-components/loader";
import Byline from "../../components/byline";
import Clients from "../../components/clients";
import Bg from "../../components/sub-components/bg";

import Experience from "../../components/experience";
import { useSkillSetContext } from "../../lib/context-providers/skillset-context";
import PageFooter from "../../components/sub-components/page-footer";
import Blurb from "../../components/blurb";
import { useInitialAnimation } from "../../lib/hooks/animation-hooks";
import { useActiveSection } from "../../lib/context-providers/active-section-context";
import { motion } from "framer-motion";
import { useScreenContext } from "../../lib/context-providers/screen-context";
export default function Home() {
  const {
    Videodata,
    selectedVideoData,
    selectedSkillSet,
    isCategoryChanging,
    imagesLoaded,
  } = useSkillSetContext();
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0); // just in case

    return () => {
      // Optional: restore default when component unmounts
      window.history.scrollRestoration = "auto";
    };
  }, []);
  const basePadding = "mt-15";
  const isMobile = useScreenContext();
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);
  return (
    <main className="relative flex flex-col items-center    ">
      <div className="pointer-events-none fixed h-full w-full border-none sm:border-8   border-yellow-900 z-4000" />
      {/* <div className="absolute pointer-events-none bg-gradient-to-r from-black/30 to-black/0 left-0 w-90 z-1 h-full" />
      <div className="absolute pointer-events-none bg-gradient-to-l from-black/30 to-black/0 right-0 w-90 z-100 h-full" /> */}
      {/* <div className="absolute left-50 h-full w-[1px] bg-gray-800" />
      <div className="absolute right-50 h-full w-[1px] bg-gray-800" /> */}
      <Suspense
        fallback={
          <>
            <div className="fixed top-1/2 sm:top-100 left-1/2 scale-120">
              <Loader isLoading={true} isMobile={false} />
            </div>
            <div className="w-screen h-screen bg-black"></div>
          </>
        }
      >
        <div className="pt-2 sm:pt-5  w-full md:w-[700px] lg:w-[950px]  flex flex-col  items-center    z-900">
          <Intro mt={` w-full  md:w-[500px]  sm:px-0  mt-10 sm:mt-30`} />
          <ProfilePhoto mt="mt-0 sm:mt-0" />
          <Byline mt="mt-11" />
          {/* <Blurb mt="mt-5 sm:mt-10" /> */}
          {/* <div className="absolute left-70 h-full w-[1px] bg-gray-800" /> */}
          <hr className="opacity-0 md:opacity-100 border-gray-900 sm:mb-18 sm:mt-20 w-screen border-1" />

          <Projects mt="mt-0 " />
        </div>

        {imagesLoaded && <Clients mt="mt-30" />}
        <PageFooter />
        <ContactLinks mt="mt-1" />
        <Bg />
      </Suspense>
    </main>
  );
}
