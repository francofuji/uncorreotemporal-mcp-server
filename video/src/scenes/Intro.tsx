import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1: "AI agents can execute code."
  const line1Spring = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });
  const line1Opacity = interpolate(line1Spring, [0, 1], [0, 1]);
  const line1Y       = interpolate(line1Spring, [0, 1], [20, 0]);

  // Line 2: "But they can't check email." — starts at frame 30
  const line2Spring = spring({ frame: frame - 30, fps, config: { damping: 18, stiffness: 100 } });
  const line2Opacity = interpolate(line2Spring, [0, 1], [0, 1]);
  const line2Y       = interpolate(line2Spring, [0, 1], [20, 0]);

  // Cursor blink after line 2 appears
  const cursorVisible = frame > 60 && Math.floor((frame - 60) / 18) % 2 === 0;

  // Subtitle fades in at frame 120
  const subtitleOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // URL badge at frame 180
  const badgeOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeScale = interpolate(frame, [180, 210], [0.85, 1], {
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
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.overlay} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.3,
        }}
      />

      {/* Main text block */}
      <div style={{ position: "relative", textAlign: "center", maxWidth: 1100 }}>
        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 72,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          AI agents can execute code.
        </div>

        <div
          style={{
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            fontFamily: FONT_SANS,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 32,
          }}
        >
          <span style={{ color: C.red }}>But they can't check email.</span>
          <span
            style={{
              display: "inline-block",
              width: 4,
              height: 68,
              background: C.red,
              marginLeft: 6,
              verticalAlign: "middle",
              opacity: cursorVisible ? 1 : 0,
            }}
          />
        </div>

        {/* Subtitle */}
        <div
          style={{
            opacity: subtitleOpacity,
            fontFamily: FONT_SANS,
            fontSize: 28,
            color: C.subtext,
            marginBottom: 48,
          }}
        >
          Here's how to fix that — in Google Colab, in 5 minutes.
        </div>

        {/* URL badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            display: "inline-block",
            background: C.surface,
            border: `1px solid ${C.overlay}`,
            borderRadius: 24,
            padding: "10px 28px",
          }}
        >
          <span style={{ fontFamily: FONT_MONO, fontSize: 22, color: C.accent }}>
            uncorreotemporal.com
          </span>
        </div>
      </div>
    </div>
  );
};
