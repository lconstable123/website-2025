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
    <main className="relative flex flex-col items-center   ">
      <div className="pointer-events-none fixed h-full w-full border-7   border-yellow-900 z-1000" />
      <div className="absolute bg-gradient-to-r from-black/10 to-black/0 left-0 w-70 -z-1 h-full" />
      <div className="absolute bg-gradient-to-l from-black/10 to-black/0 right-0 w-70 -z-1 h-full" />
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
        <div className="pt-5 sm:pt-5  w-[90%] sm:w-[650px] lg:w-[800px]  flex flex-col  items-center    z-900">
          <Intro mt="mt-10 lg:mt-15" />
          <ProfilePhoto mt="mt-10 sm:mt-10" />
          <Byline mt="mt-10" />
          {/* <Blurb mt="mt-5 sm:mt-10" /> */}
        </div>
        {/* <motion.hr
          initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          // transition={{ duration: 1, delay: 0.5 }}
          // onViewportEnter={{ opacity: 1 }}
          className="border-gray-800 border-2 ring-3 w-full my-30 text-center"
        /> */}

        <Projects mt=" " />
        {/* <motion.hr
          initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0 }}
          viewport={{ once: true }}
          // transition={{ duration: 1, delay: 0.5 }}
          // onViewportEnter={{ opacity: 1 }}
          className="border-gray-800 border-2 ring-3 w-full my-30 text-center"
        /> */}
        {imagesLoaded && <Clients mt="mt-30" />}
        <PageFooter />
        <ContactLinks mt="mt-1" />
        <Bg />
      </Suspense>
    </main>
  );
}
