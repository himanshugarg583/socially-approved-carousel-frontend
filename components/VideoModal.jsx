"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ModalSlide } from "@/components/ModalSlide";
import { ChevronIcon, CloseIcon } from "@/components/Icons";

export function VideoModal({ videos, startIndex, onClose, onLike, onShare, showToast }) {
  const innerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const handleActive = useCallback((index) => setActiveIndex(index), []);

  const goTo = useCallback(
    (offset) => {
      const node = innerRef.current;
      if (!node) return;
      const next = Math.min(videos.length - 1, Math.max(0, activeIndex + offset));
      const child = node.children[next];
      if (child) child.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    },
    [activeIndex, videos.length]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const node = innerRef.current;
    if (!node) return;
    const child = node.children[startIndex];
    if (child) {
      requestAnimationFrame(() => child.scrollIntoView({ inline: "center", block: "nearest" }));
    }
  }, [startIndex]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goTo(1);
      if (event.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, onClose]);

  return (
    <div className="sa-modal" role="dialog" aria-modal="true" aria-label="Socially Approved reel">
      <div className="sa-backdrop" onClick={onClose} />
      <div className="sa-modal-shell">
        <div className="sa-modal-bar">
          <div className="sa-modal-title">
            <span className="sa-dot" /> Socially Approved
            <span className="sa-modal-count">
              {activeIndex + 1} / {videos.length}
            </span>
          </div>
          <button type="button" className="sa-icon-btn" onClick={onClose} aria-label="Close reel">
            <CloseIcon />
          </button>
        </div>

        <div className="sa-modal-stage">
          <button type="button" className="sa-arrow sa-arrow-prev" onClick={() => goTo(-1)} aria-label="Previous video">
            <ChevronIcon direction="left" />
          </button>

          <div className="sa-inner" ref={innerRef}>
            {videos.map((video, index) => (
              <ModalSlide
                key={video.id}
                video={video}
                index={index}
                scrollRootRef={innerRef}
                onActive={handleActive}
                onLike={onLike}
                onShare={onShare}
                showToast={showToast}
              />
            ))}
          </div>

          <button type="button" className="sa-arrow sa-arrow-next" onClick={() => goTo(1)} aria-label="Next video">
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}
