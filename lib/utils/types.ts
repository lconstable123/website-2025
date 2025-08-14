import { links } from "../data/data";
import { categories } from "../data/reel-data";
import { RefObject, SetStateAction } from "react";
export type SectionNameType = (typeof links)[number]["name"];
export type ProjectProps = {
  title: string;
  client: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
  low?: string;
  byline: string;
  sectionTitle?: string;
  standalone?: boolean;
  index?: number;
  isInView?: boolean;
  isCategoryChanging?: boolean;
  isInEyeline?: boolean;
  isPlayable?: boolean;
  blurb?: string;
  isOnPage?: boolean;
};
export type VideoPlayerProps = {
  srcHigh: string;
  srcLow?: string;
  poster?: string;
  isSquare?: boolean;
  isInView?: boolean;
  isFocussed?: boolean;
  setIsFocussed: React.Dispatch<React.SetStateAction<boolean>>;
  isInEyeline?: boolean;
  isPlayable?: boolean;
  resetPlayPrompt?: boolean;
  handlePopover?: (state: "in" | "out") => void;
  externalVideoRef: RefObject<HTMLVideoElement | null>;
  monitorCurrentTime?: number;
  setMonitorCurrentTime?: React.Dispatch<SetStateAction<number>>;
  isModalOpen?: boolean;
  widthStyling?: string;
  playableLink?: string;
  isImagesLoaded?: boolean;
};
export type Category = (typeof categories)[number]["title"];

export type navigatorTypes = {
  selectedCategory: (typeof categories)[number]["title"];
  inView: boolean;
  handleSelectCategory: (
    category: (typeof categories)[number]["title"]
  ) => void;
  links?: { name: string; link: string }[];
};
