import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

// ─── Animated flow step ───────────────────────────────────────────────────────
interface FlowStepProps {
  icon: string;
  label: string;
  value?: string;
  valueColor?: string;
  startFrame: number;
  isActive?: boolean;
  isDone?: boolean;
}

const FlowStep: React.FC<FlowStepProps> = ({
  icon, label, value, valueColor, startFrame, isActive, isDone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 16, stiffness: 110 } });
  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-24, 0]);

  const borderColor = isDone ? C.green : isActive ? C.yellow : C.overlay;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: "flex",
        alignItems: "center",
        gap: 20,
        background: C.surface,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 12,
        padding: "16px 24px",
        marginBottom: 12,
        minWidth: 720,
      }}
    >
      <span style={{ fontSize: 28, minWidth: 36, textAlign: "center" }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 18, color: C.subtext }}>{label}</div>
        {value && (
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 16,
              color: valueColor ?? C.accent,
              marginTop: 4,
            }}
          >
            {value}
          </div>
        )}
      </div>
      {isDone && (
        <span style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.green }}>✓</span>
      )}
      {isActive && (
        <span style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.yellow }}>⟳</span>
      )}
    </div>
  );
};

export const SunoIntegration: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Music waveform animation after step 5
  const waveOpacity = interpolate(frame, [420, 450], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const waveform = Array.from({ length: 40 }, (_, i) => {
    const base = 20 + Math.sin(i * 0.7) * 15 + Math.cos(i * 1.3) * 10;
    const anim = Math.sin((frame * 0.15) + i * 0.4) * 8;
    return Math.max(8, base + anim);
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
        gap: 32,
        padding: "0 200px",
      }}
    >
      {/* Header */}
      <div style={{ opacity: headingOpacity, textAlign: "center", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 40 }}>🎵</span>
          <span style={{ fontFamily: FONT_SANS, fontSize: 44, fontWeight: 700, color: C.text }}>
            Suno — music generation
          </span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.muted }}>
          Signup automated with a temporary inbox
        </div>
      </div>

      {/* Flow steps */}
      <div>
        <FlowStep
          icon="📬"
          label="create_signup_inbox('Suno', ttl_minutes=30)"
          value="suno-user-91@uncorreotemporal.com"
          valueColor={C.teal}
          startFrame={20}
          isDone={frame >= 80}
        />
        <FlowStep
          icon="🌐"
          label="Navigate to suno.com → sign up with inbox email"
          value="Registration submitted"
          startFrame={60}
          isDone={frame >= 130}
        />
        <FlowStep
          icon="⏳"
          label="wait_for_verification_email(inbox_id, timeout=90)"
          value={frame >= 130 && frame < 200 ? "Polling... email received in 4s" : frame >= 200 ? "Email received ✓" : undefined}
          valueColor={C.green}
          startFrame={110}
          isActive={frame >= 130 && frame < 200}
          isDone={frame >= 200}
        />
        <FlowStep
          icon="🔗"
          label="extract_verification_link → click → account verified"
          value="https://suno.com/verify?token=eyJh..."
          valueColor={C.blue}
          startFrame={200}
          isDone={frame >= 280}
        />
        <FlowStep
          icon="🎶"
          label="Generate: 'ambient lo-fi synthwave, dark, no vocals, cinematic'"
          value={frame >= 380 ? "✓ background.mp3 — 2:30 min" : "Generating..."}
          valueColor={C.green}
          startFrame={310}
          isActive={frame >= 310 && frame < 380}
          isDone={frame >= 380}
        />
      </div>

      {/* Waveform visualization */}
      <div style={{ opacity: waveOpacity, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.green, marginRight: 12 }}>♪ Playing:</span>
        {waveform.map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              background: `linear-gradient(to top, ${C.green}, ${C.accent})`,
              borderRadius: 2,
              opacity: 0.8,
            }}
          />
        ))}
        <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.muted, marginLeft: 12 }}>
          ambient-lofi-bg.mp3
        </span>
      </div>
    </div>
  );
};
