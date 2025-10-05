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
  const { profileClicked } = useActiveSection();
  const { controls } = useInitialAnimation(0.2, 1, profileClicked > 0);
  return (
    <main className="relative flex flex-col items-center    ">
      <div className="pointer-events-none fixed h-full w-full border-8   border-yellow-900 z-4000" />
      <div className="absolute pointer-events-none bg-gradient-to-r from-black/30 to-black/0 left-0 w-90 z-1 h-full" />
      <div className="absolute pointer-events-none bg-gradient-to-l from-black/30 to-black/0 right-0 w-90 z-100 h-full" />
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
        <Intro mt=" w-[90%] sm:w-[650px] lg:w-[800px] px-5 sm:px-0  mt-25 lg:mt-25" />
        <div className="pt-10 sm:pt-10  w-[90%] sm:w-[650px] lg:w-[800px]  flex flex-col  items-center    z-900">
          <ProfilePhoto mt="mt-0 sm:mt-0" />
          <Byline mt="mt-15" />
          {/* <Blurb mt="mt-5 sm:mt-10" /> */}
        </div>

        <Projects mt=" " />

        {imagesLoaded && <Clients mt="mt-30" />}
        <PageFooter />
        <ContactLinks mt="mt-1" />
        <Bg />
      </Suspense>
    </main>
  );
}
