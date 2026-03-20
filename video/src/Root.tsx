import React from "react";
import { Composition, Sequence } from "remotion";
import { FPS, HEIGHT, SCENES, TOTAL_FRAMES, WIDTH } from "./constants";
import { Intro }         from "./scenes/Intro";
import { Problem }       from "./scenes/Problem";
import { SolutionTools } from "./scenes/SolutionTools";
import { ColabDemo }     from "./scenes/ColabDemo";
import { Architecture }  from "./scenes/Architecture";
import { CTA }           from "./scenes/CTA";

// ─── Full video composition ───────────────────────────────────────────────────
const AgentEmailVideo: React.FC = () => {
  return (
    <>
      <Sequence from={SCENES.intro.start}         durationInFrames={SCENES.intro.end         - SCENES.intro.start}>
        <Intro />
      </Sequence>
      <Sequence from={SCENES.problem.start}       durationInFrames={SCENES.problem.end       - SCENES.problem.start}>
        <Problem />
      </Sequence>
      <Sequence from={SCENES.solutionTools.start} durationInFrames={SCENES.solutionTools.end - SCENES.solutionTools.start}>
        <SolutionTools />
      </Sequence>
      <Sequence from={SCENES.colabDemo.start}     durationInFrames={SCENES.colabDemo.end     - SCENES.colabDemo.start}>
        <ColabDemo />
      </Sequence>
      <Sequence from={SCENES.architecture.start}  durationInFrames={SCENES.architecture.end  - SCENES.architecture.start}>
        <Architecture />
      </Sequence>
      <Sequence from={SCENES.cta.start}           durationInFrames={SCENES.cta.end           - SCENES.cta.start}>
        <CTA />
      </Sequence>
    </>
  );
};

// ─── Register composition ─────────────────────────────────────────────────────
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
      {/* Individual scene previews for fast iteration */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={450}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Problem"
        component={Problem}
        durationInFrames={600}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SolutionTools"
        component={SolutionTools}
        durationInFrames={450}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ColabDemo"
        component={ColabDemo}
        durationInFrames={1800}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="Architecture"
        component={Architecture}
        durationInFrames={750}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CTA"
        component={CTA}
        durationInFrames={450}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
