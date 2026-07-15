"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";
import { formatCount, formatTime, initials, shareLink } from "@/lib/format";
import { ProgressBar } from "@/components/ProgressBar";
import { Spinner } from "@/components/Spinner";
import {
  ChatIcon,
  ChevronDownIcon,
  HeartIcon,
  PauseIcon,
  PlayIcon,
  ShareIcon,
  SoundOffIcon,
  SoundOnIcon,
  VerifiedIcon
} from "@/components/Icons";

export function ModalSlide({ video, index, scrollRootRef, onActive, onLike, onShare, showToast }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [draft, setDraft] = useState("");

  const entry = useInView(containerRef, {
    root: scrollRootRef,
    rootMargin: "0px 240px 0px 240px",
    threshold: [0, 0.6, 1]
  });

  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = videoRef.current;
    if (!element || !entry) return;

    if (entry.isIntersecting) {
      if (!element.src) {
        element.src = element.dataset.src;
        element.load();
      }
      const isActive = entry.intersectionRatio >= 0.6;
      setActive(isActive);
      if (isActive) {
        element.play().catch(() => {});
        onActive(index);
      } else {
        element.pause();
      }
    } else {
      element.pause();
      if (element.src) {
        element.removeAttribute("src");
        element.load();
      }
      setActive(false);
      setLoaded(false);
    }
  }, [entry, index, onActive]);

  const togglePlay = () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => {});
    else element.pause();
  };

  const toggleMute = () => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = !element.muted;
    setMuted(element.muted);
  };

  const handleSeek = (fraction) => {
    const element = videoRef.current;
    if (element && element.duration) {
      element.currentTime = fraction * element.duration;
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareLink(video.id));
    } catch (error) {
    }
    onShare(video.id, "link");
    showToast("Link copied · shared");
  };

  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((current) => [{ id: Date.now(), author: "you", text }, ...current]);
    setDraft("");
  };

  return (
    <div ref={containerRef} className={`sa-slide${active ? " is-active" : ""}${playing ? "" : " is-paused"}`}>
      <video
        ref={videoRef}
        data-src={video.videoUrl}
        poster={video.thumbnailUrl}
        loop
        muted={muted}
        playsInline
        preload="none"
        onLoadedData={() => setLoaded(true)}
        onPlaying={() => setLoaded(true)}
        onWaiting={() => setLoaded(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => {
          const target = event.currentTarget;
          setDuration(target.duration || 0);
          setCurrentTime(target.currentTime || 0);
          setProgress(target.duration ? target.currentTime / target.duration : 0);
        }}
      />
      <div className="sa-veil" />
      <Spinner hidden={loaded} />

      <button type="button" className="sa-center-play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
        <span className="sa-center-glass">
          <PlayIcon />
        </span>
      </button>

      <div className="sa-slide-top">
        <span className="sa-avatar">{initials(video.creatorHandle)}</span>
        <span className="sa-slide-handle">@{video.creatorHandle}</span>
        {video.isVerified ? <VerifiedIcon /> : null}
      </div>

      <div className="sa-slide-controls">
        <p className="sa-slide-caption">
          {video.title} · {video.location}
        </p>

        <ProgressBar value={progress} onSeek={handleSeek} />

        <div className="sa-ctl-row">
          <button type="button" className="sa-ctl" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className="sa-ctl" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
          <span className="sa-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <span className="sa-spacer" />
          <button
            type="button"
            className={`sa-ctl sa-wide${video.liked ? " is-on" : ""}`}
            onClick={() => onLike(video.id)}
            aria-pressed={video.liked}
            aria-label={video.liked ? "Unlike video" : "Like video"}
          >
            <HeartIcon filled={video.liked} />
            <span className="sa-cnt">{formatCount(video.likeCount)}</span>
          </button>
          <button type="button" className="sa-ctl" onClick={() => setShowComments(true)} aria-label="Open comments">
            <ChatIcon />
          </button>
          <button type="button" className="sa-ctl" onClick={handleShare} aria-label="Share video">
            <ShareIcon />
          </button>
        </div>
      </div>

      <div className={`sa-comments${showComments ? " is-open" : ""}`}>
        <div className="sa-cm-head">
          <b>Comments</b>
          <button type="button" className="sa-icon-btn" onClick={() => setShowComments(false)} aria-label="Close comments">
            <ChevronDownIcon />
          </button>
        </div>
        <div className="sa-cm-list">
          {comments.length === 0 ? (
            <p className="sa-cm-empty">Be the first to comment</p>
          ) : (
            comments.map((comment) => (
              <div className="sa-cm-item" key={comment.id}>
                <span className="sa-cm-av">{comment.author.charAt(0).toUpperCase()}</span>
                <div>
                  <p className="sa-cm-who">@{comment.author}</p>
                  <p className="sa-cm-txt">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="sa-cm-form">
          <input
            type="text"
            value={draft}
            maxLength={140}
            placeholder="Add a comment…"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") postComment();
            }}
          />
          <button type="button" onClick={postComment}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
