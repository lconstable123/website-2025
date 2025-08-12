"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  buffered = 0,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { buffered?: number }) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "absolute   bottom-0  flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-gray-900  relative grow overflow-hidden  data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <div
          className="absolute top-0 left-0 h-full bg-gray-400"
          style={{ width: `${buffered * 100}%` }}
        />
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-gray-600 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="selector-enhancer
            cursor-pointer relative ring-7 w-2 h-4  bg-white ring-white/0 hover:ring-white/70   block size-4 shrink-0 rounded-md duration-500  shadow-sm transition-all hover:focus-visible:ring-white/70  focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
