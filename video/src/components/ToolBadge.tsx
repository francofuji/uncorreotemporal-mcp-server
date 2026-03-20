import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO } from "../constants";

interface Props {
  name: string;
  description: string;
  startFrame: number;
  index: number;
}

export const ToolBadge: React.FC<Props> = ({ name, description, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.9 },
  });

  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-20, 0]);
  const scale      = interpolate(s, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: C.surface,
        border: `1px solid ${C.overlay}`,
        borderRadius: 10,
        padding: "14px 20px",
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontFamily: FONT_MONO,
          fontSize: 20,
          color: C.accent,
          fontWeight: 600,
          minWidth: 340,
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 18,
          color: C.subtext,
        }}
      >
        {description}
      </span>
    </div>
  );
};
