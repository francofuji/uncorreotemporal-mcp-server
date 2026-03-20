import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = spring({ frame,      fps, config: { damping: 18, stiffness: 100 } });
  const s2 = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 100 } });
  const s3 = spring({ frame: frame - 45, fps, config: { damping: 18, stiffness: 100 } });
  const s4 = spring({ frame: frame - 70, fps, config: { damping: 18, stiffness: 100 } });

  const fadeIn  = (s: number) => interpolate(s, [0, 1], [0, 1]);
  const slideUp = (s: number) => interpolate(s, [0, 1], [24, 0]);
  const scaleIn = (s: number) => interpolate(s, [0, 1], [0.88, 1]);

  const notebookOpacity = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Subtle gradient backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 900px 600px at center, ${C.accent}18 0%, transparent 70%)`,
        }}
      />

      {/* Main URL */}
      <div
        style={{
          opacity: fadeIn(s1),
          transform: `translateY(${slideUp(s1)}px)`,
          fontFamily: FONT_MONO,
          fontSize: 80,
          fontWeight: 700,
          color: C.accent,
          letterSpacing: "-0.02em",
          marginBottom: 16,
        }}
      >
        uncorreotemporal.com
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: fadeIn(s2),
          transform: `translateY(${slideUp(s2)}px)`,
          fontFamily: FONT_SANS,
          fontSize: 30,
          color: C.subtext,
          marginBottom: 48,
        }}
      >
        Programmable temporary email infrastructure for AI agents.
      </div>

      {/* Two action badges */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 56,
        }}
      >
        <div
          style={{
            opacity: fadeIn(s3),
            transform: `scale(${scaleIn(s3)})`,
            background: C.accent,
            borderRadius: 12,
            padding: "18px 40px",
            fontFamily: FONT_SANS,
            fontSize: 24,
            fontWeight: 700,
            color: C.bg,
          }}
        >
          Try the API — free plan
        </div>
        <div
          style={{
            opacity: fadeIn(s4),
            transform: `scale(${scaleIn(s4)})`,
            background: C.surface,
            border: `2px solid ${C.overlay}`,
            borderRadius: 12,
            padding: "18px 40px",
            fontFamily: FONT_SANS,
            fontSize: 24,
            fontWeight: 600,
            color: C.text,
          }}
        >
          Read the docs  →  /docs/mcp
        </div>
      </div>

      {/* Colab badge */}
      <div
        style={{
          opacity: notebookOpacity,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: C.surface,
          border: `1px solid ${C.overlay}`,
          borderRadius: 10,
          padding: "12px 28px",
        }}
      >
        <span style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.muted }}>
          Companion notebook:
        </span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 20, color: C.sapphire }}>
          Open in Colab  ↗
        </span>
      </div>
    </div>
  );
};
