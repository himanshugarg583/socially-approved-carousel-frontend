"use client";

import { useRef } from "react";

export function ProgressBar({ value, onSeek }) {
  const trackRef = useRef(null);
  const seekingRef = useRef(false);

  const seekFromEvent = (clientX) => {
    const node = trackRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onSeek(fraction);
  };

  const percent = `${Math.min(100, Math.max(0, value * 100))}%`;

  return (
    <div
      ref={trackRef}
      className="sa-progress"
      onPointerDown={(event) => {
        seekingRef.current = true;
        trackRef.current.setPointerCapture(event.pointerId);
        seekFromEvent(event.clientX);
      }}
      onPointerMove={(event) => {
        if (seekingRef.current) seekFromEvent(event.clientX);
      }}
      onPointerUp={() => {
        seekingRef.current = false;
      }}
    >
      <span className="sa-progress-fill" style={{ width: percent }} />
      <span className="sa-progress-knob" style={{ left: percent }} />
    </div>
  );
}
