"use client";
import { motion, useAnimation } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import MuteButton from "../atomic/video/mute-button";
import EnlargeButton from "../atomic/video/enlarge-button";
import { VideoPlayerProps } from "../../lib/utils/types";
import { useNativeVideoPlayer } from "../../lib/hooks/video-player-hooks";
import PauseButton from "../atomic/video/pause-button";
import { useEffect, useState } from "react";
import { useAnimationTrigger } from "../../lib/hooks/animation-hooks";
import Loader from "./loader";
import { useSkillSetContext } from "../../context/skillset-context";

export default function NativeVideoPlayer({
  isInView = true,
  isFocussed = false,
  poster = "",
  isSquare = false,
  srcHigh = "",
  srcLow = "",
  playableLink = "",
  setIsFocussed,
  isInEyeline = false,
  isPlayable = false,
  handlePopover,
  externalVideoRef,
  monitorCurrentTime,
  setMonitorCurrentTime,
  isModalOpen = false,

  widthStyling = `    w-full h-[200px] sm:h-[250px] md:h-[337px]  md:w-[600px] `,

  //params
}: VideoPlayerProps) {
  const { selectedVideoData } = useSkillSetContext();
  const {
    //-------------------------------------- video out params
    videoRef,
    toggleMute,
    isLocallyMuted,
    togglePlay,
    duration,
    currentTime,
    setCurrentTime,
    seeking,
    handleSeekMouseDown,
    handleSeekMouseUp,
    IsPaused,
    buffered,
    interactedEnough,
    isMobile,
    selectedSrc,
    isEngaged,
    res,

    //------------------------------------ video functionality
  } = useNativeVideoPlayer(
    //------------------------------------ video in params

    isInView,
    isInEyeline,
    externalVideoRef,
    setMonitorCurrentTime,
    monitorCurrentTime,
    isModalOpen,
    srcHigh,
    srcLow
  );

  const [vidControls, handleAnimateClose] = useAnimationTrigger({
    fromOpacity: 1,
    delay: 0.11,
    toOpacity: 0,
    duration: 0.3,
  });

  // ------------------------  states
  const Animcontrols = useAnimation();

  const [videoIsLoading, setVideoIsLoading] = useState(true);
  // ------------------------ animation handlers
  const handleClick = async () => {
    togglePlay();
    if (isEngaged) {
      await Animcontrols.start({
        opacity: [1, 1, 0],
        scale: [0.7, 1],
        transition: {
          duration: 0.65,
          times: [0, 0.5, 1],
        },
      });
    } else {
      Animcontrols.start({
        opacity: [1, 1, 0],
        scale: [0.7, 1],
        transition: {
          duration: 0.65,
          times: [0, 0.5, 1],
        },
      });
    }
  };

  const handleMouseIn = () => {
    // setIsMouseIn(true);
    setIsFocussed(true);
  };
  const handleMouseOut = () => {
    // setIsMouseIn(false);
    setIsFocussed(false);
  };
  //use effects

  useEffect(() => {
    if (!videoRef.current) return;

    const timeout = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = monitorCurrentTime || 0;
      }
      handleAnimateClose();
    }, 200); // allow layout reflow

    return () => clearTimeout(timeout);
  }, [isModalOpen]);

  return (
    <div
      onMouseEnter={handleMouseIn}
      onMouseLeave={handleMouseOut}
      className=" relative group"
    >
      <MuteButton
        isFocussed={isFocussed}
        toggleMute={toggleMute}
        isLocallyMuted={isLocallyMuted}
      />
      {!isMobile && !isModalOpen && (
        <EnlargeButton
          isPlayable={isPlayable}
          playableLink={playableLink}
          handlePopover={() => {
            handlePopover?.("in");
          }}
        />
      )}
      {!videoIsLoading && (
        <PauseButton
          isPaused={IsPaused}
          controls={Animcontrols}
          isEngaged={isEngaged}
          isMobile={isMobile}
        />
      )}
      <motion.div
        animate={vidControls}
        className="absolute bg-black  top-0 left-0  z-[9999]"
      />

      <Loader
        isLoading={videoIsLoading && interactedEnough}
        isMobile={isMobile}
      />
      {/* {res && <div className="absolute inset-0 ">{selectedSrc}</div>} */}
      <video
        ref={videoRef}
        id="youtube_video"
        className={` ${widthStyling} ${!isSquare ? "object-cover" : ""} video-js vjs-default-skin`}
        // src={selectedSrc}
        src={selectedSrc}
        preload="metadata"
        poster={poster}
        controls={false}
        // playsInline={isMobile}
        muted={isLocallyMuted || isMobile}
        autoPlay={isMobile}
        onClick={handleClick}
        disablePictureInPicture
        onLoadedData={() => setVideoIsLoading(false)}
      />
      <div
        className={`relative z-20' ${isFocussed ? "opacity-100" : "opacity-0"} transition-opacity duration-800`}
      >
        {!isMobile && (
          <Slider
            buffered={buffered}
            max={duration}
            value={[currentTime]}
            step={0.1}
            onValueChange={(val) => {
              setCurrentTime(val[0]);
              if (videoRef?.current && !seeking) {
                videoRef.current.currentTime = val[0];
              }
            }}
            onPointerDown={handleSeekMouseDown}
            onPointerUp={handleSeekMouseUp}
          />
        )}
      </div>
    </div>
  );
}
