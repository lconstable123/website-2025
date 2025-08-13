import { useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { useSkillSetContext } from "../context-providers/skillset-context";
import { useActiveSection } from "../context-providers/active-section-context";

export const useCarouseAnimation = () => {
  const { isCategoryChanging } = useSkillSetContext();
  const controls = useAnimation();
  const fadeInAnimationVariants = {
    initial: (index: number) => ({
      opacity: 0,
      scale: 0.4,
      transition: {
        delay: 0.1,
      },
    }),
    animate: (index: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        // delay: 0.1,
      },
    }),
    scaleDown: (index: number) => ({
      opacity: 0.0,
      scale: 0.7,
      transition: {
        duration: 0.17,
      },
    }),
    exit: {
      opacity: 0.8,
      scale: 0.1,
      transition: {
        duration: 0.1,
      },
    },
  };

  useEffect(() => {
    controls.start("animate");
  }, []);

  useEffect(() => {
    if (isCategoryChanging) {
      controls.start("scaleDown");
    } else {
      controls.start("animate");
    }
  }, [isCategoryChanging]);

  return {
    controls,
    fadeInAnimationVariants,
    // scaleDown,
  };
};

/////////////////////////

export const useInitialAnimation = (
  delay = 0,
  toOpacity = 1,
  trigger: boolean
) => {
  const controls = useAnimation();

  const { profileClicked } = useActiveSection();
  const fadeIn = () => {
    controls.start({
      opacity: toOpacity,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 20,
        duration: 0.4,
        delay,
      },
    });
  };

  useEffect(() => {
    if (trigger) {
      fadeIn();
    }
  }, [trigger]);

  return {
    controls,
  };
};

////////////////////////////

type UseAnimationTriggerOptions = {
  delay?: number;
  fromOpacity?: number;
  fromScale?: number;
  toOpacity?: number;
  toScale?: number;
  handleClose?: () => void;
  debug?: boolean;
  duration?: number;
};

//////////////////////////////

export const useAnimationTrigger = ({
  // -- accepts animation in and out values
  // -- accepts a handleClose to fire on close event for side effects
  // -- animates in on component mount
  // -- animates out on returned AnimateOut handle
  delay = 0,
  fromOpacity = 0,
  fromScale = 0.5,
  toOpacity = 1,
  toScale = 1,
  debug = false,
  duration = 0.4,
  handleClose,
}: UseAnimationTriggerOptions) => {
  const controls = useAnimation();
  //in react strict mode, you need to use ref becuase it mount twice, workaround.
  const animateStateRef = useRef(false);

  const [animateState, setAnimateState] = useState(false);

  const AnimateIn = async () => {
    if (animateStateRef.current) return; // Prevent re-triggering if already animated
    await controls.start({
      opacity: toOpacity,
      scale: toScale,
      transition: {
        type: "tween",
        duration: duration,
        delay,
      },
    });
    animateStateRef.current = true;
    debug && toast.success("Animation triggered successfully");
  };
  const AnimateOut = async () => {
    if (!animateStateRef.current) {
      debug && toast.error("Already closed");
      return;
    }
    await controls.start({
      opacity: fromOpacity,
      scale: fromScale,
      transition: {
        type: "tween",

        duration: duration,
        delay,
      },
    });
    setAnimateState(false);
    animateStateRef.current = false;
    debug && toast.success("Animation reset to initial state");
    handleClose?.();
  };

  useEffect(() => {
    if (animateState) return;
    debug && toast.success("Animation hook initialized");

    AnimateIn();
  }, []);

  return [controls, AnimateOut] as const;
};
