"use client";
import React, { RefObject, useEffect, useState } from "react";

import {
  MdSubdirectoryArrowRight,
  MdSubdirectoryArrowLeft,
} from "react-icons/md";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
export default function ClickPrompt2({
  children,
  Trigger,
  ref,
  direction,
}: {
  Trigger: boolean;
  children: React.ReactNode;
  ref: RefObject<HTMLDivElement | null>;
  direction?: "up" | "across";
}) {
  const [prompting, setPrompting] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // trigger prompting in
  useEffect(() => {
    if (!prompting && !interacted) {
      //   toast.success("prompting");
      setPrompting(true);
    }
  }, [Trigger]);

  //trigger prompting out
  useEffect(() => {
    setPrompting(false);
    // toast.success("interacting");
  }, [interacted]);

  useEffect(() => {
    //timer logic

    const handleClick = () => {
      // toast.success("ref clicked");
      ref.current?.removeEventListener("mouseup", handleClick);
      setInteracted(true);
    };

    const node = ref.current;
    if (node) {
      node.addEventListener("mouseup", handleClick);
    }

    //cleanup
    return () => {
      if (node) {
        node.removeEventListener("mouseup", handleClick);
      }
    };
  }, []);

  return (
    <p
      className={`${prompting ? "opacity-100" : "opacity-0"} pointer-events-none text-center text-[10pt]  transition-all duration-900 delay-100 ${interacted ? "py-0" : "py-2"}  text-[7pt] sm:text-[10pt] text-gray-300`}
    >
      {direction === "up" && (
        <MdSubdirectoryArrowLeft className="inline-block mr-1 rotate-90" />
      )}
      {direction === "across" && <FaArrowLeft className="inline-block mr-2 " />}
      {children}
      {direction === "up" && (
        <MdSubdirectoryArrowRight className="inline-block ml-1 -rotate-90" />
      )}
      {direction === "across" && (
        <FaArrowRight className="inline-block ml-2 " />
      )}
    </p>
  );
}
