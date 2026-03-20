import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FONT_SANS, C } from "../constants";

interface Props {
  text: string;
  startFrame: number;
  style?: React.CSSProperties;
  wordDelay?: number; // frames between each word
}

export const TextReveal: React.FC<Props> = ({
  text,
  startFrame,
  style,
  wordDelay = 4,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");

  return (
    <span style={{ fontFamily: FONT_SANS, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * wordDelay;
        const opacity = interpolate(frame, [wordStart, wordStart + 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(frame, [wordStart, wordStart + 8], [8, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${translateY}px)`,
              marginRight: "0.25em",
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
