import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Three tool logos fade in staggered
  const tools = [
    { name: "Remotion",  emoji: "🎬", color: C.accent,   delay: 0  },
    { name: "Suno",      emoji: "🎵", color: C.green,    delay: 15 },
    { name: "ElevenLabs",emoji: "🎙️", color: C.sapphire, delay: 30 },
  ];

  // Main headline appears at frame 50
  const headlineS = spring({ frame: frame - 50, fps, config: { damping: 18, stiffness: 90 } });
  const headlineOpacity    = interpolate(headlineS, [0, 1], [0, 1]);
  const headlineTranslateY = interpolate(headlineS, [0, 1], [20, 0]);

  // Connector line
  const lineOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Subline
  const subS = spring({ frame: frame - 120, fps, config: { damping: 18, stiffness: 80 } });
  const subOpacity = interpolate(subS, [0, 1], [0, 1]);
  const subY       = interpolate(subS, [0, 1], [12, 0]);

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
        gap: 48,
      }}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.overlay} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          opacity: 0.25,
        }}
      />

      {/* Three tool badges */}
      <div style={{ display: "flex", gap: 40, alignItems: "center", position: "relative" }}>
        {tools.map((tool, i) => {
          const s = spring({ frame: frame - tool.delay, fps, config: { damping: 16, stiffness: 120 } });
          const opacity = interpolate(s, [0, 1], [0, 1]);
          const scale   = interpolate(s, [0, 1], [0.7, 1]);

          return (
            <React.Fragment key={tool.name}>
              <div
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  background: C.surface,
                  border: `2px solid ${tool.color}`,
                  borderRadius: 16,
                  padding: "20px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  minWidth: 180,
                }}
              >
                <span style={{ fontSize: 40 }}>{tool.emoji}</span>
                <span
                  style={{
                    fontFamily: FONT_SANS,
                    fontSize: 22,
                    fontWeight: 700,
                    color: tool.color,
                  }}
                >
                  {tool.name}
                </span>
              </div>
              {/* Arrow between badges */}
              {i < tools.length - 1 && (
                <span
                  style={{
                    opacity: lineOpacity,
                    fontFamily: FONT_MONO,
                    fontSize: 28,
                    color: C.muted,
                  }}
                >
                  →
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineTranslateY}px)`,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 52,
            fontWeight: 700,
            color: C.text,
            lineHeight: 1.25,
          }}
        >
          Three AI tools built this video.
        </div>
      </div>

      {/* Subline */}
      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        <div
          style={{
            fontFamily: FONT_SANS,
            fontSize: 28,
            color: C.subtext,
            lineHeight: 1.5,
          }}
        >
          Each one needed an email to sign up.{" "}
          <span style={{ color: C.accent, fontWeight: 600 }}>
            A temporary inbox connected them.
          </span>
        </div>
      </div>
    </div>
  );
};
