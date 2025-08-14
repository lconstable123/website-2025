"use client";
import React, { createContext, useEffect, useRef, useState } from "react";
import {
  categories,
  DirectorData,
  ExperimentData,
  gameData,
  LoFiData,
  WebData,
} from "../data/reel-data";
import { allSkills } from "../data/data";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Category } from "../utils/types";
import { Timer } from "lucide-react";

//////////////////// types

type Skillsets = (typeof categories)[number]["title"];
type VideoData = (typeof gameData)[number];

type SkillsetContextType = {
  skills: string[];
  selectedSkills?: string[];
  selectedSkillSet: Skillsets;
  Videodata: VideoData[] | null;
  setSelectedSkillSet: React.Dispatch<React.SetStateAction<Skillsets>>;
  setVideoData: React.Dispatch<React.SetStateAction<VideoData[] | null>>;
  isCategoryChanging: boolean;
  setIsCategoryChanging: React.Dispatch<React.SetStateAction<boolean>>;
  selectedVideoData: VideoData | null;
  setSelectedVideoIndex: React.Dispatch<React.SetStateAction<number>>;
  isInEyeline: boolean;
  setIsInEyeline: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUICategory: Category;
  setSelectedUICategory: React.Dispatch<React.SetStateAction<Category>>;
  imagesLoaded: boolean;
  setImagesLoaded: React.Dispatch<React.SetStateAction<boolean>>;
};

/////////////////// context

export const SkillsetContext = createContext<SkillsetContextType | null>(null);

/////////////////// provider

export default function SkillsetContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  ///////////////////// states
  // const searchParams = useSearchParams();
  // const paramfromURL = searchParams.get("category");
  let paramfromURL = "";

  // const paramfromURL = "";
  const [selectedSkillSet, setSelectedSkillSet] = useState<Skillsets>(
    (paramfromURL as Skillsets) || "Direction"
  );
  const [Videodata, setVideoData] = useState<VideoData[] | null>([]);
  const skills = allSkills;
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [selectedVideoData, setSelectedVideoData] = useState<VideoData | null>(
    Videodata?.[selectedVideoIndex] || null
  );
  const [selectedUICategory, setSelectedUICategory] =
    useState<Category>(selectedSkillSet);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isInEyeline, setIsInEyeline] = useState(false);

  const allData = [
    ...gameData,
    ...LoFiData,
    ...DirectorData,
    ...ExperimentData,
  ];
  //////////////////

  /////////////////////

  useEffect(() => {
    switch (selectedSkillSet) {
      case "Interactivity":
        setVideoData(gameData);
        break;
      case "Web":
        setVideoData(WebData);
        break;
      // case "Motion":
      //   setVideoData([...LoFiData, ...DirectorData]);
      //   break;
      case "Direction":
        setVideoData([...LoFiData, ...DirectorData]);
        break;
      case "Experiments":
        setVideoData(ExperimentData);
        break;
      default:
        setVideoData(gameData);
    }
  }, [selectedSkillSet]);

  useEffect(() => {
    setSelectedVideoData(Videodata?.[selectedVideoIndex] || null);
  }, [Videodata, selectedVideoIndex]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/not-found")
    ) {
      paramfromURL =
        new URL(window.location.href).searchParams.get("category") ||
        "Direction";
      timer = setTimeout(() => {
        // toast.success("chunaging form url");
        setSelectedSkillSet(paramfromURL as Skillsets);
        setSelectedUICategory(paramfromURL as Skillsets);
      }, 10);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <SkillsetContext.Provider
      value={{
        Videodata,
        setVideoData,
        selectedVideoData,
        skills,
        setSelectedSkillSet,
        selectedSkillSet,
        isCategoryChanging,
        setIsCategoryChanging,
        setSelectedVideoIndex,
        isInEyeline,
        setIsInEyeline,
        selectedUICategory,
        setSelectedUICategory,
        imagesLoaded,
        setImagesLoaded,
      }}
    >
      {children}
    </SkillsetContext.Provider>
  );
}

export const useSkillSetContext = () => {
  const context = React.useContext(SkillsetContext);
  if (!context) {
    throw new Error(
      "useSkillSetContext must be used within a SkillsetContextProvider"
    );
  }
  return context;
};
