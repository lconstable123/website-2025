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
  const {
    imagesLoaded,
    setImagesLoaded,
    affiliateImagesLoaded,
    setAffiliateImagesLoaded,
  } = useSkillSetContext();

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

  // Affiliate logos live on R2 at logos/1.webp ... logos/44.webp
  const getAffiliateImageArray = (): string[] =>
    Array.from(
      { length: 44 },
      (_, i) =>
        `https://pub-545b5a9f7a3d4468946219f6d7837e3c.r2.dev/logos/${i + 1}.webp`,
    );

  const preloadAffiliateImages = (imageUrls: string[]) => {
    let loadedCount = 0;
    const total = imageUrls.length;

    if (total === 0) {
      setAffiliateImagesLoaded(true);
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      const done = () => {
        loadedCount++;
        if (loadedCount === total) {
          setAffiliateImagesLoaded(true);
        }
      };
      img.onload = done;
      img.onerror = done; // count errors as loaded to avoid hanging
    });
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
    if (!affiliateImagesLoaded) {
      preloadAffiliateImages(getAffiliateImageArray());
    }
  }, []);

  useEffect(() => {
    if (primaryImagesLoaded) {
      const Secondaryurls = getSecondaryImageArray();
      preloadImages(Secondaryurls);
    }
  }, [primaryImagesLoaded]);

  return null;
}
