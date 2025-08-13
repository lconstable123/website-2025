"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ScrollerProps {
  scrollSpeed: number;
  affiliatesCount: number;
  pagination?: boolean;
  pages?: number;
  page?: number;
  affiliateWidth?: number;
  affiliateHeight?: number;
}

export default function AffiliatesScroller({
  scrollSpeed,
  affiliatesCount = 44,
  direction = "left", // default
  pagination = false,
  pages = 1,
  page = 1,
  affiliateWidth = 10,
  affiliateHeight = 4,
}: ScrollerProps & { direction?: "left" | "right" }) {
  const [affiliates, setAffiliates] = useState<string[]>([]);
  const affiliatesCountPerPage = pagination
    ? Math.floor(affiliatesCount / pages)
    : affiliatesCount;

  const baseAffiliates: string[] = Array.from(
    { length: affiliatesCountPerPage },
    (_, i) =>
      `/new-images/logos/${i + 1 + (page - 1) * affiliatesCountPerPage}.jpg`
  );

  useEffect(() => {
    const randomAffiliates = [...baseAffiliates];
    for (let i = randomAffiliates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomAffiliates[i], randomAffiliates[j]] = [
        randomAffiliates[j],
        randomAffiliates[i],
      ];
      setAffiliates([...randomAffiliates, ...randomAffiliates]);
    }
  }, [affiliatesCount]);

  // const affiliates = [...randomAffiliates, ...randomAffiliates];
  if (affiliates.length === 0) return null;
  const totalScrollWidth = affiliatesCountPerPage * affiliateWidth;

  const startX = direction === "right" ? -totalScrollWidth : 0;
  const endX = direction === "right" ? 0 : -totalScrollWidth;

  return (
    <div className="flex relative h-[47px]">
      <motion.div
        className="flex gap-[10px] absolute"
        initial={{ x: startX }}
        animate={{ x: endX }}
        transition={{
          repeat: Infinity,
          duration: scrollSpeed,
          ease: "linear",
        }}
        style={{ width: `${totalScrollWidth * 2}px` }}
      >
        {affiliates.map((affiliate, index) => (
          <div
            key={index}
            className="transition-all hover:border-yellow-300 flex items-center  justify-center rounded-xl overflow-hidden bg-gray-600 border-2 border-gray-600"
          >
            <Image
              src={affiliate}
              alt={`affiliate-${index}`}
              width={affiliateWidth}
              height={affiliateHeight}
              quality={70}
              loading="eager"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
