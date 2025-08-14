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

  return (
    <main className="  flex flex-col items-center   ">
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
        {/* <div className="fixed  text-sm flex gap-4  text-white top-2 left-2 z-[9999]">
        <p>{selectedSkillSet}</p>
        <p>category entry 1: {Videodata?.[3]?.title} |</p>
        <p>titele: {selectedVideoData?.title} |</p>
        <p>link: {selectedVideoData?.imageUrl} |</p>
      </div> */}
        <Intro mt="mt-15 lg:mt-30" />
        <div className=" pt-35 sm:pt-47 px-3 sm:px-6  w-full sm:w-[550px] lg:w-[750px]  flex flex-col  items-center    z-900">
          <ProfilePhoto mt="mt-12" />
          <Byline mt="mt-12" />
        </div>

        <Projects mt="mt-5 sm:mt-20" />
        {imagesLoaded && <Clients mt="mt-30 sm:mt-45" />}
        <PageFooter />
        <ContactLinks mt="mt-1" />
        <Bg />
      </Suspense>
    </main>
  );
}
