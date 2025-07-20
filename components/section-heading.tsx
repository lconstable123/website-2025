import React from "react";

type SectionType = {
  children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionType) {
  return (
    <h2 className="text-3xl font-medium text-center capitalize mb-8">
      {children}
    </h2>
  );
}
