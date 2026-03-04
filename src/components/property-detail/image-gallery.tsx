"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  name: string;
}

export function ImageGallery({ images, name }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Ensure at least 5 images for the mosaic (duplicate if needed)
  const gallery =
    images.length >= 5
      ? images.slice(0, 5)
      : [...images, ...images, ...images, ...images, ...images].slice(0, 5);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Mosaic grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[280px] sm:h-[360px] md:h-[480px] card-enter">
        {/* Main large image */}
        <button
          onClick={() => openLightbox(0)}
          className="relative md:col-span-2 md:row-span-2 overflow-hidden rounded-2xl md:rounded-r-none group cursor-pointer"
        >
          <Image
            src={gallery[0]}
            alt={`${name} — main`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* 4 thumbnail grid */}
        {gallery.slice(1, 5).map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i + 1)}
            className={cn(
              "relative hidden md:block overflow-hidden group cursor-pointer",
              i === 1 && "rounded-tr-2xl",
              i === 3 && "rounded-br-2xl"
            )}
          >
            <Image
              src={img}
              alt={`${name} — ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>
        ))}

        {/* Show all photos button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-5 right-5 md:bottom-6 md:right-6 z-10 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-md rounded-full text-sm font-semibold text-stone-800 shadow-lg hover:bg-white hover:shadow-xl transition-all active:scale-95"
        >
          <Images className="w-4 h-4" />
          Show all photos
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-stone-900/95 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                (lightboxIndex - 1 + images.length) % images.length
              );
            }}
            className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="relative w-full max-w-5xl aspect-[3/2] mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex] || gallery[lightboxIndex]}
              alt={`${name} — ${lightboxIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((lightboxIndex + 1) % images.length);
            }}
            className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium tabular-nums">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
