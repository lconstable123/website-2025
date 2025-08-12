import React from "react";
import { motion, type useAnimation } from "framer-motion";
import { BsFillPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs";

type PauseButtonProps = {
  isPaused: boolean;
  controls: ReturnType<typeof useAnimation>;
  isEngaged?: boolean;
  isMobile?: boolean;
};

export default function PauseButton({
  isPaused,
  controls,
  isEngaged = false,
  isMobile = false,
}: PauseButtonProps) {
  if (isMobile) {
    return (
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.5 }}
        transition={{
          type: "tween",
          duration: 0.3,
        }}
        className=" absolute-center z-10 pointer-events-none"
      >
        <BsFillPlayCircleFill className="text-[30pt] video-shadow opacity-890 " />
      </motion.div>
    );
  } else {
    return (
      <>
        {!isEngaged && <StaticPlaybutton />}

        <motion.div
          animate={controls}
          initial={{ opacity: 0, scale: 0.5 }}
          transition={{
            type: "tween",
            duration: 0.6,
            times: [0, 0.5, 1],
          }}
          className=" absolute-center z-10 pointer-events-none"
        >
          {isPaused && isEngaged ? (
            //player is unpause and engaged
            <BsFillPauseCircleFill className="text-[70pt] video-shadow " />
          ) : isEngaged ? (
            //player is paused and engaged
            <BsFillPlayCircleFill className="text-[70pt] video-shadow " />
          ) : (
            // player is paused and not engaged
            <BsFillPlayCircleFill className="text-[70pt] video-shadow " />
          )}
        </motion.div>
      </>
    );
  }
}

export function StaticPlaybutton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.0 }}
      animate={{ opacity: 1, scale: 0.5 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className=" absolute-center z-10 pointer-events-none"
    >
      <BsFillPlayCircleFill className="text-[70pt] " />
    </motion.div>
  );
}
