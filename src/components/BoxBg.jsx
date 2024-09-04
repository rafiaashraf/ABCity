"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Boxes } from "./ui/background-boxes";
import { ParticleHeader } from "./ParticleHeader";
import { FaArrowRight } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi";
import { Link } from "react-router-dom";

export function BoxBg() {
  return (
    <div className="text-white h-screen relative w-full overflow-hidden  bg-navy flex flex-col items-center justify-start pt-32 rounded-lg">
      <div className="absolute inset-0 w-full h-full  z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <h1
        className={cn("md:text-8xl font-bold text-6xl text-white relative z-20")}
      >
        ABCity
      </h1>

      <p className="text-center mt-2 text-xl text-blue-300 font-semibold  relative z-20">
        The only place you need to teach your child!
      </p>
      {/* <div className="flex  mt-24 w-1/4 mx-auto justify-between items-center bg-gradient-to-r from-purple-400 to-purple-700 z-20 px-4 py-2 pl-3 rounded-full">
        <div className="bg-neutral-900 px-4 py-2 rounded-full flex gap-2 items-center">
           AI Inside <HiSparkles/> 
        </div>
        <Link to={"/parent"} className="flex gap-2 items-center font-medium">
            Get Started <FaArrowRight/>
        </Link>
      </div> */}

      {/* Chat GPT Code */}
      <div className="flex flex-col sm:flex-row mt-14 sm:mt-14 md:mt-20 lg:mt-20 w-3/4 sm:w-1/2 lg:w-1/4 mx-auto justify-between items-center bg-gradient-to-r from-cyan-600 to-purple-600 z-20 px-4 py-2 pl-3 rounded-full">
        <div className="bg-neutral-900 px-4 py-2 rounded-full flex gap-2 items-center mb-2 sm:mb-0">
          AI Inside <HiSparkles />
        </div>
        <Link to={"/child"} className="flex gap-2 items-center font-medium bg-white bg-opacity-20 px-4 py-2 rounded-full">
          Get Started <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}
