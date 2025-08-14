# 🎨 Luke Constable's Portfolio Site

A self-built portfolio powered by **Next.js**, showcasing custom components, animation, and performant media handling.

## 🔧 Tech Stack

- **Next.js**
- **TypeScript**
- **Framer Motion**
- **React Icons**
- **Embla Carousel**
- **shadcn/ui**

---

## Featured Components

### Native Video Player

> I was sick of paying for Vimeo, so I built a self-hosted streaming video player from scratch.

- Adapts video source by device and bandwidth (H.264).
- Optional Lightbox modal with GitHub or game clickthrough.
- Main logic in `useNativeVideoPlayer` and `video-player-hooks.ts`.
- Video is instantiated outside the component and passed in by reference — allowing it to be reused across the DOM (e.g. in a lightbox).

---

### Double Intersection Observer

Tracks a DOM element’s position in the vertical viewport using **two thresholds** (wide and narrow).  
Useful for differentiating full visibility vs. eyeline detection.

---

### Portal Porter

A small utility I’m proud of.

Allows a React ref (like a video) to be passed around the DOM using a portal. Enables a single instance to exist in multiple places without reload or duplication.

---

### Navigator

Handles category switching and animations:

- Delays content change until out-animation completes.
- Improves perceived smoothness when navigating between sections.

---

### Image Loader

Preloads critical thumbnail images before they're displayed:

- Prevents "90s-style" image shudder.
- Shows key visuals early, with a radiating circle animation to allow for load time.
- Avoids FOUM (Flash of Unstyled Media) by delaying text and fading in background only after load is complete.

---

## Context Providers

Custom React contexts power global state:

- **`useActiveSection`** – Tracks the current scroll section. Initially meant to integrate more deeply with the double intersection observer, but was scaled back for simplicity.
- **`useScreenContext`** – Detects device type and bandwidth to dynamically adjust layout and video source.
- **`useSkillSetContext`** – Manages categories and selected projects.

> I could have used context more heavily to avoid prop drilling, but chose to keep project components "dumb" and performant — relying on carousel mapping and downward data flow.

---

## Final Note

This portfolio blends design, development, and a bit of obsessive micro-optimization.  
Hope you enjoy exploring it — the source code is open if you're curious.
