"use client";
import React from "react";
import { useSectionInView } from "../lib/hooks";

export default function Contact() {
  const { ref } = useSectionInView("Contact", 0.5);

  return (
    <section
      className="text-center mb-28 max-w-[45rem] leading-8 sm:mb-40 scroll-mt-28"
      id="contact"
      ref={ref}
    >
      Contact
    </section>
  );
}
