import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = spring({ frame,           fps, config: { damping: 18, stiffness: 100 } });
  const s2 = spring({ frame: frame-20, fps, config: { damping: 18, stiffness: 100 } });
  const s3 = spring({ frame: frame-45, fps, config: { damping: 18, stiffness: 100 } });
  const s4 = spring({ frame: frame-70, fps, config: { damping: 18, stiffness: 100 } });

  const fade  = (s: number) => interpolate(s, [0, 1], [0, 1]);
  const up    = (s: number) => interpolate(s, [0, 1], [24, 0]);
  const scale = (s: number) => interpolate(s, [0, 1], [0.88, 1]);

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
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 900px 600px at center, ${C.accent}18 0%, transparent 70%)`,
        }}
      />

      {/* URL */}
      <div
        style={{
          opacity: fade(s1),
          transform: `translateY(${up(s1)}px)`,
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
          opacity: fade(s2),
          transform: `translateY(${up(s2)}px)`,
          fontFamily: FONT_SANS,
          fontSize: 28,
          color: C.subtext,
          marginBottom: 48,
          textAlign: "center",
          maxWidth: 900,
        }}
      >
        If your agent needs email — for signups, OTPs, or anything in between —
        the inbox is one tool call away.
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 24, marginBottom: 48 }}>
        <div
          style={{
            opacity: fade(s3),
            transform: `scale(${scale(s3)})`,
            background: C.accent,
            borderRadius: 12,
            padding: "18px 40px",
            fontFamily: FONT_SANS,
            fontSize: 24,
            fontWeight: 700,
            color: C.bg,
          }}
        >
          Free plan — no credit card
        </div>
        <div
          style={{
            opacity: fade(s4),
            transform: `scale(${scale(s4)})`,
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
          MCP docs → /docs/mcp
        </div>
      </div>

      {/* Made with badge */}
      <div
        style={{
          opacity: interpolate(frame, [100, 130], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          display: "flex",
          alignItems: "center",
          gap: 16,
          background: C.surface,
          border: `1px solid ${C.overlay}`,
          borderRadius: 10,
          padding: "12px 28px",
          fontFamily: FONT_MONO,
          fontSize: 17,
          color: C.muted,
        }}
      >
        Built with{" "}
        <span style={{ color: C.text }}>Remotion</span> +
        <span style={{ color: C.green }}> Suno</span> +
        <span style={{ color: C.sapphire }}> ElevenLabs</span>
        <span style={{ color: C.muted }}> — all signed up via uncorreotemporal</span>
      </div>
    </div>
  );
};
