"use client";
import React, { createContext, useEffect, useRef, useState } from "react";
import {
  categories,
  DirectorData,
  ExperimentData,
  gameData,
  LoFiData,
  WebData,
} from "../lib/data/reel-data";
import { allSkills } from "../lib/data/data";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { Category } from "../lib/utils/types";

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
  // isGlobalModalOpen: boolean;
  // setIsGlobalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const searchParams = useSearchParams();
  const paramfromURL = searchParams.get("category");
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
  // const selectedVideoData = Videodata?.[selectedVideoIndex] || null;
  const [isInEyeline, setIsInEyeline] = useState(false);
  // const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
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
      // case "Web":
      //   setVideoData(WebData);
      //   break;
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

  // useEffect(() => {
  // setSelectedVideoData(Videodata?.[selectedVideoIndex] || null);
  // toast.success(`Video changed to ${selectedSkillSet}`);
  // }, [Videodata]);

  // useEffect(() => {
  //   setSelectedSkillSet((paramfromURL as Category) || "Direction");
  // }, []);

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
        // isGlobalModalOpen,
        // setIsGlobalModalOpen,
        //////
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
