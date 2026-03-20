import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";
import { ToolBadge } from "../components/ToolBadge";

const TOOLS = [
  { name: "create_signup_inbox",         description: "Provision a live SMTP inbox on demand" },
  { name: "wait_for_verification_email", description: "Block until a matching email arrives" },
  { name: "get_latest_email",            description: "Read full message with parsed body" },
  { name: "extract_otp_code",            description: "Pull numeric OTP from message text" },
  { name: "extract_verification_link",   description: "Extract the most likely verification URL" },
  { name: "complete_signup_flow",        description: "All of the above — in one call" },
];

export const MCPTools: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const subOpacity = interpolate(frame, [15, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
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
        padding: "0 180px",
        gap: 28,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            opacity: headingOpacity,
            fontFamily: FONT_SANS,
            fontSize: 46,
            fontWeight: 700,
            color: C.text,
            marginBottom: 8,
          }}
        >
          How it works under the hood
        </div>
        <div
          style={{
            opacity: subOpacity,
            fontFamily: FONT_SANS,
            fontSize: 20,
            color: C.subtext,
          }}
        >
          Six MCP tools — discoverable via{" "}
          <span style={{ color: C.accent, fontWeight: 600, fontFamily: FONT_MONO }}>
            tools/list
          </span>
          {" "}from any compatible agent runtime
        </div>
      </div>

      <div style={{ width: "100%" }}>
        {TOOLS.map((tool, i) => (
          <ToolBadge
            key={tool.name}
            name={tool.name}
            description={tool.description}
            startFrame={30 + i * 18}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};
