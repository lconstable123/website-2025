"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  // useEffect(() => {
  //   toast.success(activeSection);
  // }, [activeSection]);

  return (
    <div className="z-[999] relative ">
      <motion.div
        className="  windowBorder fixed top-0 left-1/2
        h-[4.5rem]  border-opacity-40 rounded-none
         sm:top-6 sm:h-[2.25rem] w-full 
        "
        initial={{ opacity: 0, y: -100, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        layout="position"
      >
        {/* <Navigator position={"right"} /> */}
      </motion.div>
    </div>
    //   <nav className="fixed flex top-[0.15rem] left-1/2 -translate-x-1/2 h-12 py-2 sm:top-[2.0rem] sm:h-[initial] sm:py-0">
    //     <div className="relative ">
    //       <ul
    //         className="flex w-[22rem] flex-wrap items-center justify-center gap-y-1 text-[0.9rem] font-medium text-gray-500
    //         sm:w-[initial] sm:flex-nowrap sm:gap-5
    //         "
    //       >
    //         {links.map((link) => (
    //           <motion.li
    //             className="relative h-3/4 flex items-center justify-center"
    //             key={link.hash}
    //             initial={{ opacity: 0, y: -100, x: 0 }}
    //             animate={{ opacity: 1, y: 0, x: 0 }}
    //           >
    //             <Link
    //               className={clsx(
    //                 " relative flex w-full h-full items-center justify-center px-3  hover:text-gray-950 transition",
    //                 activeSection === link.name ? "text-black" : "text-gray-700"
    //               )}
    //               href={link.hash}
    //               onClick={() => {
    //                 setActiveSection(link.name);
    //                 setTimeOfLastClick!(Date.now());
    //               }}
    //             >
    //               {link.name}
    //             </Link>
    //             {link.name === activeSection && (
    //               <motion.span
    //                 className="absolute border border-blue-300  bg-blue-700/10 rounded-lg w-full h-full -z-10"
    //                 layoutId="activeSection"
    //                 transition={{
    //                   type: "tween",
    //                   stiffness: 380,
    //                 }}
    //                 style={{
    //                   top: 0,
    //                   y: 0, // lock Framer Motion y-animation
    //                 }}
    //               ></motion.span>
    //             )}
    //           </motion.li>
    //         ))}
    //       </ul>
    //     </div>
    //   </nav>
    // </div>
  );
}
