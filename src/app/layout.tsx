import { Toaster } from "react-hot-toast";

import "./globals.css";

import { Montserrat, Outfit, Roboto } from "next/font/google";
import ScreenContextProvider from "../../lib/context-providers/screen-context";
import ActiveSectionContextProvider from "../../lib/context-providers/active-section-context";
import SkillsetContextProvider from "../../lib/context-providers/skillset-context";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});
<link rel="preload" href="/new-images/bg/BG16.jpg" as="image" />;

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Luke Constable",
  description:
    "Luke Constable is a technical artist, accomplished interactive developer, and award-winning director creating immersive digital experiences. He is extremely comfortable with self-learning and working with new technologies. He has a proven track record of delivering tasteful and timely results to high-end clients across a wide range of mediums. He loves to learn, to share, and to celebrate wins as part of a team. Some of his skills include web design with React and TypeScript, 3D motion graphics and VFX using Houdini, Blender, Maya, and Cinema 4D, 2D promotional marketing graphics, game design, app and interactive design with Unity and Unreal, virtual production and VR, immersive design, learning design, direction, cinematography and end-to-end production.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth bg-black">
      <head>
        <meta property="og:title" content="Luke Constable" />
        <meta
          property="og:description"
          content="Technical artist, interactive developer, award-winning director."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.lukeconstable.com" />
        <meta
          property="og:image"
          content="https://www.lukeconstable.com/new-images/opengraph-low.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
      </head>

      <body
        className={`bg-black overflow-x-hidden  ${montserrat.variable} ${outfit.variable} ${roboto.variable} relative`}
      >
        <div className=" text-gray-950   ">
          <Toaster position="top-right" />

          <div className="">
            <ScreenContextProvider>
              <ActiveSectionContextProvider>
                <SkillsetContextProvider>
                  {/* <Header /> */}
                  <div id="lightbox"></div>

                  {children}
                </SkillsetContextProvider>
              </ActiveSectionContextProvider>
            </ScreenContextProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
