"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-card";

export function TestimonyPage() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-neutral-950 dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "This app is amazing! My child loves tracing the letters and the cheering sounds when they get it right. It's really helped with their letter recognition.",
    name: "Emily S.",
    title: "Parent",
  },
  {
    quote:
      "I use this app in my classroom, and the kids are always excited to learn their letters. The confetti explosion is their favorite part!",
    name: "Mrs. Thompson",
    title: "Kindergarten Teacher",
  },
  {
    quote: "I like the cheering sound when I get the letter right. It's fun!",
    name: "Jake",
    title: "5-year-old",
  },
  {
    quote:
      "As a parent, I appreciate how engaging this app is for my daughter. The sad sound when she makes a mistake is gentle and helps her learn without feeling discouraged.",
    name: "Michael B.",
    title: "Parent",
  },
  {
    quote:
      "My son has improved so much in his letter tracing skills thanks to this app. The feedback sounds make it very interactive.",
    name: "Linda K.",
    title: "Parent",
  },
];
