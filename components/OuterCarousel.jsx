"use client";

import { useRef } from "react";
import { VideoCard } from "@/components/VideoCard";
import { ChevronIcon } from "@/components/Icons";

export function OuterCarousel({ videos, onOpen, onLike }) {
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    const node = scrollRef.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.85, 760) * direction;
    node.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="sa-strip">
      <div className="sa-strip-head">
        <div>
          <h2 className="sa-strip-title">Tap any clip to open the reel</h2>
          <p className="sa-strip-hint">Muted autoplay in view · swipe or use arrows inside</p>
        </div>
        <div className="sa-nav">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <ChevronIcon direction="left" />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>

      <div className="sa-outer" ref={scrollRef}>
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={video}
            scrollRootRef={scrollRef}
            onOpen={() => onOpen(index)}
            onLike={onLike}
          />
        ))}
      </div>
    </div>
  );
}
