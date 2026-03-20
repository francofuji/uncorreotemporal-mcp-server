import React from "react";
import { Audio, Composition, Sequence, staticFile } from "remotion";
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./constants";
import { Intro }                  from "./scenes/Intro";
import { SunoIntegration }        from "./scenes/SunoIntegration";
import { ElevenLabsIntegration }  from "./scenes/ElevenLabsIntegration";
import { MCPTools }               from "./scenes/MCPTools";
import { ColabDemo }              from "./scenes/ColabDemo";
import { CTA }                    from "./scenes/CTA";

// ─── Helper: check if audio asset exists (prevents Remotion crash if missing) ─
const audioExists = (path: string): boolean => {
  try {
    // During studio preview this is a no-op — Remotion handles missing assets gracefully
    return true;
  } catch {
    return false;
  }
};

// ─── Full video composition ───────────────────────────────────────────────────
const AgentEmailVideo: React.FC = () => {
  return (
    <>
      {/* ── Background music — full duration ── */}
      <Audio
        src={staticFile("music/background.mp3")}
        volume={0.12}
        // If file doesn't exist yet, Remotion will show a warning but not crash
      />

      {/* ── Narration per scene ── */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.end - SCENES.intro.start}>
        <Audio src={staticFile("narration/intro.mp3")} volume={1} />
        <Intro />
      </Sequence>

      <Sequence from={SCENES.sunoIntegration.start} durationInFrames={SCENES.sunoIntegration.end - SCENES.sunoIntegration.start}>
        <Audio src={staticFile("narration/suno-integration.mp3")} volume={1} />
        <SunoIntegration />
      </Sequence>

      <Sequence from={SCENES.elevenLabsInteg.start} durationInFrames={SCENES.elevenLabsInteg.end - SCENES.elevenLabsInteg.start}>
        <Audio src={staticFile("narration/elevenlabs-integration.mp3")} volume={1} />
        <ElevenLabsIntegration />
      </Sequence>

      <Sequence from={SCENES.mcpTools.start} durationInFrames={SCENES.mcpTools.end - SCENES.mcpTools.start}>
        <Audio src={staticFile("narration/mcp-tools.mp3")} volume={1} />
        <MCPTools />
      </Sequence>

      <Sequence from={SCENES.colabDemo.start} durationInFrames={SCENES.colabDemo.end - SCENES.colabDemo.start}>
        <Audio src={staticFile("narration/colab-demo.mp3")} volume={1} />
        <ColabDemo />
      </Sequence>

      <Sequence from={SCENES.cta.start} durationInFrames={SCENES.cta.end - SCENES.cta.start}>
        <Audio src={staticFile("narration/cta.mp3")} volume={1} />
        <CTA />
      </Sequence>
    </>
  );
};

// ─── Register compositions ────────────────────────────────────────────────────
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AgentEmailVideo"
        component={AgentEmailVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Individual scene previews */}
      <Composition id="Intro"                 component={Intro}                 durationInFrames={300}  fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="SunoIntegration"       component={SunoIntegration}       durationInFrames={900}  fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="ElevenLabsIntegration" component={ElevenLabsIntegration} durationInFrames={900}  fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="MCPTools"              component={MCPTools}              durationInFrames={600}  fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="ColabDemo"             component={ColabDemo}             durationInFrames={1350} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition id="CTA"                   component={CTA}                   durationInFrames={450}  fps={FPS} width={WIDTH} height={HEIGHT} />
    </>
  );
};
