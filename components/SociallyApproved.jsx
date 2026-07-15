"use client";

import { useEffect, useMemo, useState } from "react";
import { useVideos } from "@/hooks/useVideos";
import { formatCount } from "@/lib/format";
import { OuterCarousel } from "@/components/OuterCarousel";
import { VideoModal } from "@/components/VideoModal";
import { CheckIcon } from "@/components/Icons";

const FEATURES = [
  "Outer slider · 30 clips",
  "IntersectionObserver lazy-load",
  "Inner modal · 3-up carousel",
  "Play / Pause · Mute / Unmute",
  "Seekable progress bar",
  "Loading spinners",
  "Realtime like / comment / share",
  "Off-screen pause + unload"
];

export function SociallyApproved() {
  const { videos, status, error, reload, toggleLike, share } = useVideos();
  const [openIndex, setOpenIndex] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 1900);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const likes = videos.reduce((total, video) => total + video.likeCount, 0);
    const creators = new Set(videos.map((video) => video.creatorHandle)).size;
    return { likes, creators };
  }, [videos]);

  return (
    <section className="sa-page">
      <p className="sa-topline">
        <span className="sa-dot" /> Real stories from our community
      </p>
      <h1 className="sa-heading">
        Socially <em>Approved</em>
      </h1>
      <p className="sa-sub">
        Real people, real trips. A high-performance reel of <b>{videos.length || 30}</b> customer videos — lazy-loaded,
        auto-paused off-screen, and capped to a handful of active players so the DOM never chokes.
      </p>

      <div className="sa-metrics">
        <div className="sa-metric">
          <span className="sa-metric-n">{videos.length}</span>
          <span className="sa-metric-l">Videos in feed</span>
        </div>
        <div className="sa-metric">
          <span className="sa-metric-n">{formatCount(stats.likes)}</span>
          <span className="sa-metric-l">Community likes</span>
        </div>
        <div className="sa-metric">
          <span className="sa-metric-n">{stats.creators}</span>
          <span className="sa-metric-l">Creators</span>
        </div>
      </div>

      {status === "loading" ? (
        <div className="sa-state">
          <span className="sa-ring" />
          <p>Loading the community reel…</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="sa-state">
          <p className="sa-state-title">Couldn’t reach the video service</p>
          <p className="sa-state-msg">{error}</p>
          <button type="button" className="sa-retry" onClick={reload}>
            Try again
          </button>
        </div>
      ) : null}

      {status === "ready" ? (
        <OuterCarousel videos={videos} onOpen={setOpenIndex} onLike={toggleLike} />
      ) : null}

      {openIndex !== null ? (
        <VideoModal
          videos={videos}
          startIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          onLike={toggleLike}
          onShare={share}
          showToast={setToast}
        />
      ) : null}

      <footer className="sa-foot">
        <b>What this section demonstrates</b>
        <div className="sa-chips">
          {FEATURES.map((feature) => (
            <span className="sa-chip" key={feature}>
              {feature}
            </span>
          ))}
        </div>
      </footer>

      <div className={`sa-toast${toast ? " is-visible" : ""}`}>
        <CheckIcon />
        <span>{toast}</span>
      </div>
    </section>
  );
}
