import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";

// ─── Reusable FlowStep (same as SunoIntegration) ─────────────────────────────
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
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 30, stiffness: 100 } });
  const opacity    = interpolate(s, [0, 1], [0, 1]);
  const translateX = interpolate(s, [0, 1], [-24, 0]);

  const borderColor = isDone ? C.sapphire : isActive ? C.yellow : C.overlay;

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
          <div style={{ fontFamily: FONT_MONO, fontSize: 16, color: valueColor ?? C.accent, marginTop: 4 }}>
            {value}
          </div>
        )}
      </div>
      {isDone && <span style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.sapphire }}>✓</span>}
      {isActive && <span style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.yellow }}>⟳</span>}
    </div>
  );
};

// ─── API key reveal component ─────────────────────────────────────────────────
const ApiKeyReveal: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 18, stiffness: 100 } });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const scale   = interpolate(s, [0, 1], [0.88, 1]);

  // Simulate key appearing character by character
  const fullKey = "sk_9f3a...••••••••••••••••••••••••";
  const revealedLen = Math.min(
    fullKey.length,
    Math.floor(interpolate(frame, [startFrame + 5, startFrame + 35], [0, fullKey.length], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }))
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: C.surface,
        border: `2px solid ${C.sapphire}`,
        borderRadius: 12,
        padding: "18px 28px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginTop: 8,
      }}
    >
      <span style={{ fontSize: 24 }}>🔑</span>
      <div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 15, color: C.muted, marginBottom: 4 }}>
          ElevenLabs API key — remotion-video
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 18, color: C.sapphire, letterSpacing: "0.05em" }}>
          {fullKey.slice(0, revealedLen)}
          <span style={{ opacity: 0.3 }}>{fullKey.slice(revealedLen)}</span>
        </div>
      </div>
      <div
        style={{
          marginLeft: "auto",
          background: `${C.sapphire}22`,
          border: `1px solid ${C.sapphire}`,
          borderRadius: 6,
          padding: "4px 12px",
          fontFamily: FONT_MONO,
          fontSize: 13,
          color: C.sapphire,
        }}
      >
        ACTIVE
      </div>
    </div>
  );
};

export const ElevenLabsIntegration: React.FC = () => {
  const frame = useCurrentFrame();

  const headingOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Voice waveform after API key
  const voiceOpacity = interpolate(frame, [480, 510], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const voiceBars = Array.from({ length: 32 }, (_, i) => {
    const base = 12 + Math.abs(Math.sin(i * 0.9)) * 30;
    const anim = Math.sin((frame * 0.2) + i * 0.55) * 10;
    return Math.max(6, base + anim);
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
        gap: 24,
        padding: "0 200px",
      }}
    >
      {/* Header */}
      <div style={{ opacity: headingOpacity, textAlign: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 10 }}>
          <span style={{ fontSize: 40 }}>🎙️</span>
          <span style={{ fontFamily: FONT_SANS, fontSize: 44, fontWeight: 700, color: C.text }}>
            ElevenLabs — voice synthesis
          </span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.muted }}>
          Same pattern — different tool
        </div>
      </div>

      {/* Flow steps */}
      <div>
        <FlowStep
          icon="📬"
          label="create_signup_inbox('ElevenLabs', ttl_minutes=30)"
          value="eleven-user-47@uncorreotemporal.com"
          valueColor={C.teal}
          startFrame={20}
          isDone={frame >= 80}
        />
        <FlowStep
          icon="🌐"
          label="Navigate to elevenlabs.io → sign up with inbox email"
          value="Registration submitted"
          startFrame={60}
          isDone={frame >= 130}
        />
        <FlowStep
          icon="⏳"
          label="wait_for_verification_email(inbox_id, timeout=90)"
          value={frame >= 130 && frame < 195 ? "Polling... email received in 6s" : frame >= 195 ? "Email received ✓" : undefined}
          valueColor={C.green}
          startFrame={110}
          isActive={frame >= 130 && frame < 195}
          isDone={frame >= 195}
        />
        <FlowStep
          icon="🔗"
          label="extract_verification_link → click → account verified"
          value="https://elevenlabs.io/verify?token=..."
          valueColor={C.blue}
          startFrame={195}
          isDone={frame >= 280}
        />
        <FlowStep
          icon="⚙️"
          label="Settings → API Keys → Create new key → 'remotion-video'"
          startFrame={300}
          isDone={frame >= 390}
        />
      </div>

      {/* API key reveal */}
      {frame >= 390 && <ApiKeyReveal startFrame={390} />}

      {/* Voice waveform */}
      <div style={{ opacity: voiceOpacity, display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.sapphire, marginRight: 12 }}>
          🎙️ Narration:
        </span>
        {voiceBars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: h,
              background: `linear-gradient(to top, ${C.sapphire}, ${C.accent})`,
              borderRadius: 2,
              opacity: 0.85,
            }}
          />
        ))}
        <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: C.muted, marginLeft: 12 }}>
          voice: Adam · ElevenLabs TTS
        </span>
      </div>
    </div>
  );
};
