import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS } from "../constants";
import { CodeBlock } from "./CodeBlock";

interface Props {
  cellNumber: number;
  code: string;
  output?: React.ReactNode;
  startFrame: number;     // absolute frame when this cell starts animating
  typingDuration?: number; // frames to type all code
  executedAt?: number;    // absolute frame when [ ] → [n] flips
}

export const ColabCell: React.FC<Props> = ({
  cellNumber,
  code,
  output,
  startFrame,
  typingDuration = 60,
  executedAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide in from below
  const slideProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
  });
  const translateY = interpolate(slideProgress, [0, 1], [30, 0]);
  const opacity    = interpolate(slideProgress, [0, 1], [0, 1]);

  // Typing progress
  const revealedChars = interpolate(
    frame,
    [startFrame, startFrame + typingDuration],
    [0, code.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Execution indicator
  const isExecuted = executedAt !== undefined && frame >= executedAt;
  const runnerOpacity = interpolate(
    frame,
    [startFrame, startFrame + 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        gap: 12,
        marginBottom: 12,
      }}
    >
      {/* Gutter */}
      <div
        style={{
          width: 64,
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          paddingTop: 14,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 14,
            color: isExecuted ? C.sapphire : C.muted,
            opacity: runnerOpacity,
            transition: "color 0.2s",
          }}
        >
          {isExecuted ? `[${cellNumber}]` : "[ ]"}
        </span>
      </div>

      {/* Cell body */}
      <div
        style={{
          flex: 1,
          background: C.surface,
          borderRadius: 8,
          border: `1px solid ${C.overlay}`,
          padding: "14px 18px",
          minHeight: 52,
        }}
      >
        <CodeBlock code={code} revealedChars={revealedChars} fontSize={22} />
        {output && <div style={{ marginTop: 8 }}>{output}</div>}
      </div>
    </div>
  );
};

// ─── Progress bar sub-component used in Cell 1 output ─────────────────────────
export const ProgressBar: React.FC<{ startFrame: number; duration: number }> = ({
  startFrame,
  duration,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doneOpacity = interpolate(
    frame,
    [startFrame + duration, startFrame + duration + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 6,
          background: C.overlay,
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${C.accent}, ${C.sapphire})`,
            borderRadius: 3,
            transition: "width 0.05s linear",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 18,
          color: C.green,
          marginTop: 6,
          opacity: doneOpacity,
        }}
      >
        ✓ mcp, httpx, requests installed
      </div>
    </div>
  );
};
