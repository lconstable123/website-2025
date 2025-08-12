import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveSection } from "../../context/active-section-context";
import { useInView } from "react-intersection-observer";
import { SectionNameType } from "../utils/types";
import toast from "react-hot-toast";
import { CarouselApi } from "@/components/ui/carousel";
import { useSkillSetContext } from "../../context/skillset-context";

export function useSectionInView(
  SectionName: SectionNameType,
  threshold: number = 0.75
) {
  const { ref, inView } = useInView({ threshold });

  const { activeSection, setActiveSection, timeOfLastClick } =
    useActiveSection();

  useEffect(() => {
    // toast.success(`${SectionName} is ${inView}`);
    if (inView && Date.now() - timeOfLastClick > 1000) {
      setActiveSection((prev) => {
        if (prev === SectionName) {
          return prev; // No change if already active
        }
        return SectionName;
      });
    }
  }, [inView, setActiveSection, timeOfLastClick]);

  return { ref, inView };
}

export const useCarousel = () => {
  const { setSelectedVideoIndex } = useSkillSetContext();
  const [api, setApi] = useState<CarouselApi>();

  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on("select", () => {
      const hash = api.selectedScrollSnap();
      // toast.success(`moving carousel ${hash}`);
      setSelectedVideoIndex(hash);

      setPage(hash);
    });
  }, [api]);

  const resetCarousel = () => {
    if (api) {
      api.scrollTo(0);
    }
  };

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return { api, setApi, resetCarousel, page, scrollNext, scrollPrev } as const;
};

type UseContentClickedOptions = {
  ignoreSelf?: boolean;
  debug?: boolean;
  handleEvent?: () => void;
};

export const useContentClicked = ({
  ignoreSelf = false,
  debug = false,
  handleEvent,
}: UseContentClickedOptions = {}) => {
  const [pageClicked, setPageClicked] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.target instanceof HTMLElement) {
        if (ignoreSelf && !buttonRef.current?.contains(e.target)) {
          toast.success(
            `Clicked on: ${e.target.tagName} and target is ${buttonRef.current}`
          );
          setPageClicked(true);
          handleEvent?.();
          // debug && toast.success("Page clicked outside the button");
        } else if (!ignoreSelf) {
          // debug && toast.success("Page clicked");
          handleEvent?.();
          setPageClicked(true);
        }
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      setPageClicked(false);
    };
  }, []);

  return { buttonRef, pageClicked };
};

///-------------
export const useReorderedList = (
  skills: string[],
  selectedSkills: string[]
) => {
  const [reorderedSkills, setReorderedSkills] = useState<string[]>([""]);

  useEffect(() => {
    setReorderedSkills([
      ...(skills?.filter((skill) => selectedSkills?.includes(skill)) || []), // common first
      ...(skills?.filter((skill) => !selectedSkills?.includes(skill)) || []), // then the rest
    ]);
  }, [selectedSkills, skills]);

  //utility
  function getNonUnique<T>(arr: T[]): T[] {
    const counts = new Map<T, number>();

    for (const item of arr) {
      counts.set(item, (counts.get(item) || 0) + 1);
    }

    return [...new Set(arr)].filter((item) => (counts.get(item) ?? 0) > 1);
  }

  return reorderedSkills;
};
