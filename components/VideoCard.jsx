"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { formatCount, initials } from "@/lib/format";
import { HeartIcon, PlayIcon, VerifiedIcon } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";

export function VideoCard({ video, scrollRootRef, onOpen, onLike }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const entry = useInView(containerRef, {
    root: scrollRootRef,
    rootMargin: "0px 260px 0px 260px",
    threshold: [0, 0.55, 1]
  });

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !entry) return;

    if (entry.isIntersecting) {
      if (!element.src) {
        element.src = element.dataset.src;
        element.load();
      }
      if (entry.intersectionRatio >= 0.55) {
        element.play().catch(() => {});
      } else {
        element.pause();
      }
    } else {
      element.pause();
      if (element.src) {
        element.removeAttribute("src");
        element.load();
        setLoaded(false);
      }
    }
  }, [entry]);

  return (
    <div
      ref={containerRef}
      className={`sa-card${playing ? "" : " is-paused"}`}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      <video
        ref={videoRef}
        data-src={video.videoUrl}
        poster={video.thumbnailUrl}
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setLoaded(true)}
        onPlaying={() => setLoaded(true)}
        onWaiting={() => setLoaded(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="sa-veil" />
      <Spinner hidden={loaded} />

      <div className="sa-mini-play">
        <span className="sa-glass">
          <PlayIcon />
        </span>
      </div>

      <div className="sa-card-top">
        <span className="sa-avatar">{initials(video.creatorHandle)}</span>
        <span className="sa-handle">@{video.creatorHandle}</span>
        {video.isVerified ? <VerifiedIcon /> : null}
      </div>

      <div className="sa-card-bottom">
        <p className="sa-caption">{video.title}</p>
        <p className="sa-place">{video.location}</p>
      </div>

      <button
        type="button"
        className={`sa-like-pill${video.liked ? " is-on" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onLike(video.id);
        }}
        aria-pressed={video.liked}
        aria-label={video.liked ? "Unlike video" : "Like video"}
      >
        <span className="sa-hw">
          <HeartIcon filled={video.liked} />
        </span>
        <span className="sa-cnt">{formatCount(video.likeCount)}</span>
      </button>
    </div>
  );
}
