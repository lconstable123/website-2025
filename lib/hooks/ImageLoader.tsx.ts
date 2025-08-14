"use client";

import { useEffect, useState } from "react";
import { Category } from "../utils/types";
import {
  ExperiThumbs,
  LoFiThumbs,
  webThumbs,
  InterThumbs,
} from "../data/reel-data";
import toast from "react-hot-toast";

import { useSkillSetContext } from "../context-providers/skillset-context";

type Props = {
  currentCategory: Category;
};

export default function ImageLoader({ currentCategory }: Props) {
  const [primaryImagesLoaded, setPrimaryImagesLoaded] = useState(false);
  const { imagesLoaded, setImagesLoaded } = useSkillSetContext();
  // const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  // Choose image array based on category
  const getImageArray = (): string[] => {
    switch (currentCategory) {
      case "Experiments":
        return ExperiThumbs;
      case "Direction":
        return LoFiThumbs;
      case "Web":
        return webThumbs;
      case "Interactivity":
        return InterThumbs;
      default:
        return [];
    }
  };

  const getSecondaryImageArray = (): string[] => {
    switch (currentCategory) {
      case "Experiments":
        return [...LoFiThumbs, ...InterThumbs, ...webThumbs];
      case "Direction":
        return [...ExperiThumbs, ...InterThumbs, ...webThumbs];
      case "Web":
        return [...ExperiThumbs, ...LoFiThumbs, ...InterThumbs];
      case "Interactivity":
        return [...ExperiThumbs, ...LoFiThumbs, ...webThumbs];
      default:
        return [];
    }
  };

  // Preload images and optionally wait until all are loaded
  const preloadImages = (imageUrls: string[]) => {
    let loadedCount = 0;
    const total = imageUrls.length;

    if (total === 0) {
      if (primaryImagesLoaded) {
        setImagesLoaded(true);
      } else {
        setPrimaryImagesLoaded(true);
      }
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
          if (primaryImagesLoaded) {
            // toast.success("secondary images loaded");
            setImagesLoaded(true);
          } else {
            setPrimaryImagesLoaded(true);
            // toast.success("primary images loaded");
          }
        }
      };
      img.onerror = () => {
        loadedCount++; // Still count errors as "loaded" to avoid hanging
        if (loadedCount === total) {
          setImagesLoaded(true);
        }
      };
    });
  };

  useEffect(() => {
    const Primaryurls = getImageArray();
    preloadImages(Primaryurls);
  }, [currentCategory]);

  useEffect(() => {
    if (primaryImagesLoaded) {
      const Secondaryurls = getSecondaryImageArray();
      preloadImages(Secondaryurls);
    }
  }, [primaryImagesLoaded]);

  return null;
}
