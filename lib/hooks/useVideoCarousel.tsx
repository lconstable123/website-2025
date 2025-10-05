"use client";
import { useEffect, useRef, useState } from "react";

import { useDoubleIntersectionObserver } from "./double-intersection-observer";
import { useCarousel } from "./hooks";
import { Category } from "../utils/types";

import toast from "react-hot-toast";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import { useScreenContext } from "../context-providers/screen-context";
import { useSkillSetContext } from "../context-providers/skillset-context";

export const useVideoCarousel = (searchParams: ReadonlyURLSearchParams) => {
  //------------------------------------------ derived states

  const { isMobileLandscape } = useScreenContext();
  const { ref, isInViewDeep, isInViewShort } = useDoubleIntersectionObserver(
    0.4,
    0.7,
    "Projects",
    isMobileLandscape
  );
  const { setApi, scrollNext, scrollPrev, page, resetCarousel } = useCarousel();
  const {
    isInEyeline,
    setIsInEyeline,
    Videodata,
    setSelectedSkillSet,
    setSelectedUICategory,
    selectedUICategory,
    selectedVideoData,
    selectedSkillSet,
    isCategoryChanging,
    setIsCategoryChanging,
  } = useSkillSetContext();

  //-------------------------------------------internal states
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [carouselInitial, setCarouselInitial] = useState(true);
  const [navOffsetTop, setNavOffsetTop] = useState(0);
  const carouselSectionRef = useRef<HTMLDivElement>(null);

  const params = new URLSearchParams(searchParams.toString());
  //-------------------------------------------Change category, first animation, then data

  const handleSelectCategory = (category: Category) => {
    if (category === selectedSkillSet) return;
    setSelectedUICategory(category);
    setCarouselInitial(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsCategoryChanging(true);

    params.set("category", category);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    // router.replace(newUrl, { scroll: false });
    // window.history.replaceState({}, "", newUrl);
    window.history.replaceState(null, "", newUrl);

    timerRef.current = setTimeout(() => {
      setIsCategoryChanging(false);
      setSelectedSkillSet(category);
      resetCarousel();
    }, 150);
  };

  //-------------------------------------------set Eyeline (y)
  useEffect(() => {
    setIsInEyeline(isInViewDeep);
  }, [isInViewDeep]);

  ////////----------------------------------- carousel nav caclutate

  useEffect(() => {
    if (carouselSectionRef.current) {
      const offset = carouselSectionRef.current.offsetHeight / 2 + 70;
      setNavOffsetTop(offset);
    }
  }, [isInViewShort]);

  return {
    ref,
    carouselSectionRef,
    isInViewDeep,
    isInViewShort,
    setApi,
    scrollNext,
    scrollPrev,
    page,
    resetCarousel,
    isInEyeline,
    setIsInEyeline,
    Videodata,
    setSelectedSkillSet,
    selectedVideoData,
    selectedSkillSet,
    isCategoryChanging,
    setIsCategoryChanging,
    handleSelectCategory,
    navOffsetTop,
    selectedUICategory,
    carouselInitial,
  };
};
