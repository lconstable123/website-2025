import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openNewWindow(url = "", e: React.MouseEvent<HTMLElement>) {
  e.stopPropagation();
  e.preventDefault();
  window.open(
    url,
    "popupWindow",
    "width=800,height=600,scrollbars=yes,resizable=yes"
  );
}
