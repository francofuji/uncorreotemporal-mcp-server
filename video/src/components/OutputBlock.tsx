import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO } from "../constants";

interface OutputLine {
  text: string;
  color?: string;
  bold?: boolean;
}

interface Props {
  lines: OutputLine[];
  startFrame: number;      // absolute frame when output starts appearing
  staggerFrames?: number;  // frames between each line appearing
  fontSize?: number;
}

export const OutputBlock: React.FC<Props> = ({
  lines,
  startFrame,
  staggerFrames = 12,
  fontSize = 20,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        borderLeft: `3px solid ${C.overlay}`,
        marginLeft: 8,
        paddingLeft: 16,
        marginTop: 8,
      }}
    >
      {lines.map((line, i) => {
        const lineStart = startFrame + i * staggerFrames;
        const opacity = interpolate(frame, [lineStart, lineStart + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(frame, [lineStart, lineStart + 8], [6, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              opacity,
              transform: `translateY(${translateY}px)`,
              fontFamily: FONT_MONO,
              fontSize,
              lineHeight: 1.6,
              color: line.color ?? C.subtext,
              fontWeight: line.bold ? 600 : 400,
              whiteSpace: "pre-wrap",
            }}
          >
            {line.text}
          </div>
        );
      })}
    </div>
  );
};
