"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import "react-alice-carousel/lib/alice-carousel.css";

// Alice Carousel SSR-safe
const AliceCarousel = dynamic(() => import("react-alice-carousel"), {
  ssr: false,
});

// Slider data (same file)
const sliderData = [
  {
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=80",
    path: "/",
  },

  
  {
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=2000&q=80",
    path: "/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2000&q=80",
    path: "/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80",
    path: "/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=80",
    path: "/",
  },
];

export default function HomeCrousal() {
  const items = sliderData.map((item, index) => (
    <div key={index} className="w-full">
      <img
        src={item.image}
        alt="banner"
        width={2000}
        height={800}
        className="w-full h-[190px] lg:h-[33rem] object-cover"
      />
    </div>
  ));

  return (
    <main>
      <AliceCarousel
        items={items}
        autoPlay
        autoPlayInterval={2000}
        infinite
        disableButtonsControls
        disableDotsControls
      />
    </main>
  );
}
