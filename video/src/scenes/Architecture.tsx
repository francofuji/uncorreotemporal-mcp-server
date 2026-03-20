import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

interface NodeProps {
  label: string;
  sublabel?: string;
  startFrame: number;
  color?: string;
  x: number;
  y: number;
}

const ArchNode: React.FC<NodeProps> = ({ label, sublabel, startFrame, color, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale   = interpolate(s, [0, 1], [0.7, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        background: C.surface,
        border: `2px solid ${color ?? C.overlay}`,
        borderRadius: 12,
        padding: "16px 24px",
        textAlign: "center",
        minWidth: 200,
      }}
    >
      <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: color ?? C.text, fontWeight: 600 }}>
        {label}
      </div>
      {sublabel && (
        <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: C.muted, marginTop: 4 }}>
          {sublabel}
        </div>
      )}
    </div>
  );
};

interface ArrowProps {
  x1: number; y1: number;
  x2: number; y2: number;
  label?: string;
  startFrame: number;
  color?: string;
}

const Arrow: React.FC<ArrowProps> = ({ x1, y1, x2, y2, label, startFrame, color }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const midX = x1 + dx * 0.5;
  const midY = y1 + dy * 0.5;

  // Draw arrow as SVG line
  const strokeDasharray = len;
  const strokeDashoffset = len * (1 - progress);

  return (
    <svg
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      width={WIDTH}
      height={HEIGHT}
    >
      <defs>
        <marker
          id={`arrowhead-${startFrame}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color ?? C.accent} opacity={progress} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color ?? C.accent}
        strokeWidth={2}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        markerEnd={`url(#arrowhead-${startFrame})`}
        opacity={0.8}
      />
      {label && progress > 0.5 && (
        <text
          x={midX + 8}
          y={midY - 8}
          fill={C.subtext}
          fontSize={15}
          fontFamily={FONT_MONO}
          opacity={interpolate(progress, [0.5, 1], [0, 1])}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export const Architecture: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Node positions (centered layout, 1920x1080)
  // Row 1: External sender → AWS SES
  // Row 2: SNS webhook → FastAPI
  // Row 3: PostgreSQL   Redis pub/sub
  // Row 4: WebSocket client

  const N = {
    sender:    { x: 180,  y: 180,  label: "External Sender", sublabel: "any SMTP client", color: C.subtext },
    ses:       { x: 600,  y: 180,  label: "AWS SES",          sublabel: "spam filter + inbound", color: C.yellow },
    sns:       { x: 1020, y: 180,  label: "SNS webhook",      sublabel: "POST /api/v1/ses/inbound", color: C.yellow },
    api:       { x: 800,  y: 440,  label: "FastAPI",          sublabel: "deliver_raw_email()", color: C.accent },
    postgres:  { x: 400,  y: 680,  label: "PostgreSQL",       sublabel: "message stored", color: C.blue },
    redis:     { x: 900,  y: 680,  label: "Redis pub/sub",    sublabel: "channel: mailbox:{addr}", color: C.red },
    ws:        { x: 900,  y: 880,  label: "WebSocket",        sublabel: "/ws/inbox/{address}", color: C.green },
    agent:     { x: 1400, y: 440,  label: "Agent tool call",  sublabel: "wait_for_verification_email()", color: C.teal },
  };

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: C.bg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Heading */}
      <div
        style={{
          opacity: headingOpacity,
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_SANS,
          fontSize: 42,
          fontWeight: 700,
          color: C.text,
        }}
      >
        How a real email reaches your agent
      </div>

      {/* Arrows — drawn before nodes so nodes sit on top */}
      <Arrow x1={430}  y1={212} x2={610}  y2={212} label="SMTP"          startFrame={25} />
      <Arrow x1={840}  y1={212} x2={1030} y2={212} label="SNS notify"    startFrame={50} />
      <Arrow x1={1100} y1={250} x2={920}  y2={430} label=""              startFrame={75} />
      <Arrow x1={800}  y1={510} x2={550}  y2={670} label="store"         startFrame={100} />
      <Arrow x1={860}  y1={510} x2={920}  y2={670} label="pub/sub"       startFrame={110} />
      <Arrow x1={950}  y1={760} x2={950}  y2={870} label="push"          startFrame={135} />
      <Arrow x1={1060} y1={460} x2={1400} y2={460} label="→ result"      startFrame={160} color={C.teal} />

      {/* Nodes */}
      <ArchNode {...N.sender}   startFrame={20}  />
      <ArchNode {...N.ses}      startFrame={40}  />
      <ArchNode {...N.sns}      startFrame={60}  />
      <ArchNode {...N.api}      startFrame={80}  />
      <ArchNode {...N.postgres} startFrame={105} />
      <ArchNode {...N.redis}    startFrame={115} />
      <ArchNode {...N.ws}       startFrame={140} />
      <ArchNode {...N.agent}    startFrame={155} />

      {/* Footer note */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: interpolate(frame, [200, 220], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: FONT_SANS,
          fontSize: 18,
          color: C.muted,
        }}
      >
        Each inbox is isolated — 50 parallel agent sessions, zero shared state.
      </div>
    </div>
  );
};
