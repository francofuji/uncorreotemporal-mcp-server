import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_SANS, FONT_MONO, WIDTH, HEIGHT } from "../constants";

interface BlockerCardProps {
  icon: string;
  title: string;
  detail: string;
  startFrame: number;
}

const BlockerCard: React.FC<BlockerCardProps> = ({ icon, title, detail, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - startFrame, fps, config: { damping: 18, stiffness: 90, mass: 1 } });
  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateY = interpolate(s, [0, 1], [40, 0]);
  const scale      = interpolate(s, [0, 1], [0.92, 1]);

  // "BLOCKED" tag appears 30 frames after card
  const tagOpacity = interpolate(
    frame,
    [startFrame + 30, startFrame + 45],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        background: C.surface,
        border: `1px solid ${C.overlay}`,
        borderRadius: 16,
        padding: "28px 32px",
        width: 440,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red left accent */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: C.red,
          borderRadius: "16px 0 0 16px",
          opacity: tagOpacity,
        }}
      />
      <div style={{ fontFamily: FONT_SANS, fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 24,
          fontWeight: 700,
          color: C.text,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONT_SANS,
          fontSize: 18,
          color: C.subtext,
          lineHeight: 1.5,
        }}
      >
        {detail}
      </div>

      {/* BLOCKED badge */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          opacity: tagOpacity,
          background: `${C.red}22`,
          border: `1px solid ${C.red}`,
          borderRadius: 6,
          padding: "4px 10px",
          fontFamily: FONT_MONO,
          fontSize: 14,
          color: C.red,
          fontWeight: 700,
          letterSpacing: "0.08em",
        }}
      >
        BLOCKED
      </div>
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  // Heading appears immediately (frame 0 = scene-local; but we use absolute frames via Sequence offset)
  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
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
        gap: 48,
        padding: "0 80px",
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          fontFamily: FONT_SANS,
          fontSize: 48,
          fontWeight: 700,
          color: C.text,
          textAlign: "center",
        }}
      >
        Every real automation hits the{" "}
        <span style={{ color: C.red }}>same wall.</span>
      </div>

      {/* Three blocker cards */}
      <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
        <BlockerCard
          icon="📝"
          title="Signup confirmation"
          detail="Service sends a confirmation email. Agent can't click the link. Account never activates."
          startFrame={20}
        />
        <BlockerCard
          icon="🔐"
          title="OTP verification"
          detail="2FA sends a 6-digit code to your email. Agent has nowhere to receive it."
          startFrame={50}
        />
        <BlockerCard
          icon="🔑"
          title="Email-gated access"
          detail="API key, reset link, or invite arrives by email. Agent is stuck waiting."
          startFrame={80}
        />
      </div>

      {/* Footer note */}
      <div
        style={{
          opacity: interpolate(frame, [150, 170], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: FONT_SANS,
          fontSize: 20,
          color: C.muted,
          textAlign: "center",
        }}
      >
        Mocking the email step doesn't help. The real service controls its own delivery.
      </div>
    </div>
  );
};
