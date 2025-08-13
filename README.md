This is Luke Constable's portfolio site
/////////////////////////////////////////////////////////////////////////////////

-Next.js
-Framer.motion
-React-icons
-Embla
-TS
-ShadCN

////////////////////////////////////////////////////////////////////////////////

[COMPONENT SHOWCASE]

--------Native VideoPlayer------
I was sick of paying for vimeo, so I built and designed a self hosted streaming video player and interface.

Swaps video depending on device and bandwidth. Operates with h264 videos hosted anywhere.

Optional Lightbox, github clickthough, game clickthough

Main functionality in UseNativeVideoPlayer, video-player-hooks.ts.

Video is instanciated and referenced outside of the component and passed in as reference param
so it can be passed around the dom- for example to the lightbox.

-------double-intersection-observer------
Observes the occurance of a referenced dom element in the vertical height of the viewport, by two thresholds, wide and narrow.

-------Portal Porter---------------------
It's a small function but it allows a video reference, or any other reference to be passed around the dom, by implementing a portal.
I was proud of this one.

-------Navigator-------------------------
Changes categories- but most effectively, prompts animations and offsets the changing to allow for out animation transition.

------Context Providers------------------
useActiveSection is a store of where we are in the site. I was gong to impliment this furter with my doubleintersection observer, but it was overkill.
I don't have the heart to remove it.

useScreenContext is a store of the device and bandwidth to swap layout, features and video source.

useSkillSetContex monitores the category, and the projects.

I would note I could have used this more to prevent prop drilling but I wanted to keep my project components dumb,
it was more peformant as they were relying on being mapped into the carousel and let the data trickle down..

/////anyway, enjoy!
