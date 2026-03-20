import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";
import { ColabCell, ProgressBar } from "../components/ColabCell";
import { OutputBlock } from "../components/OutputBlock";

// ─── Code strings for each cell ──────────────────────────────────────────────
const CELL1_CODE = `!pip install mcp httpx requests -q`;

const CELL2_CODE = `import asyncio, json
from mcp import ClientSession
from mcp.client.streamable_http import streamablehttp_client

UCT_API_KEY = "uct_your_key_here"
MCP_URL = "https://uncorreotemporal.com/mcp"

async def list_tools():
    async with streamablehttp_client(
        url=MCP_URL,
        headers={"Authorization": f"Bearer {UCT_API_KEY}"}
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            return [t.name for t in tools.tools]

asyncio.run(list_tools())`;

const CELL3_CODE = `async def create_inbox(service_name: str):
    async with streamablehttp_client(
        url=MCP_URL, headers={"Authorization": f"Bearer {UCT_API_KEY}"}
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool(
                "create_signup_inbox",
                {"service_name": service_name, "ttl_minutes": 15}
            )
            return json.loads(result.content[0].text)

inbox = asyncio.run(create_inbox("MyService"))
print(f"Inbox address: {inbox['email']}")`;

const CELL4_CODE = `async def complete_flow(service_name: str):
    async with streamablehttp_client(
        url=MCP_URL, headers={"Authorization": f"Bearer {UCT_API_KEY}"}
    ) as (read, write, _):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.call_tool(
                "complete_signup_flow",
                {"service_name": service_name,
                 "timeout_seconds": 90,
                 "ttl_minutes": 15}
            )
            return json.loads(result.content[0].text)

flow = asyncio.run(complete_flow("MyService"))
print(f"Status: {flow['status']}")
print(f"Email:  {flow['email']}")
print(f"Link:   {flow['verification_link']}")`;

// ─── Frame timing (scene-local, scene starts at frame 1500 absolute) ──────────
// Cell 1: types at 0, executes at 50, output bar 55–95
const C1_START    = 0;
const C1_TYPED    = 40;
const C1_EXEC     = 50;
const C1_BAR      = 55;
const C1_BAR_DUR  = 40;

// Cell 2: starts at 110
const C2_START    = 110;
const C2_TYPED    = 200;
const C2_EXEC     = 215;
const C2_OUT      = 220;

// Cell 3: starts at 320
const C3_START    = 320;
const C3_TYPED    = 390;
const C3_EXEC     = 400;
const C3_OUT      = 405;

// Cell 4: starts at 510
const C4_START    = 510;
const C4_TYPED    = 610;
const C4_EXEC     = 622;
const C4_OUT      = 628;

export const ColabDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Header
  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
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
        padding: "40px 100px",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Colab-style top bar */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {/* Colab logo proxy */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.yellow}, ${C.red})`,
          }}
        />
        <span
          style={{
            fontFamily: FONT_SANS,
            fontSize: 20,
            color: C.subtext,
            fontWeight: 500,
          }}
        >
          colab-email-agent.ipynb
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: FONT_MONO,
            fontSize: 16,
            color: C.muted,
          }}
        >
          uncorreotemporal.com/mcp
        </span>
      </div>

      {/* ── Cell 1: pip install ── */}
      <ColabCell
        cellNumber={1}
        code={CELL1_CODE}
        startFrame={C1_START}
        typingDuration={C1_TYPED}
        executedAt={C1_EXEC}
        output={
          <ProgressBar startFrame={C1_BAR} duration={C1_BAR_DUR} />
        }
      />

      {/* ── Cell 2: list_tools ── */}
      <ColabCell
        cellNumber={2}
        code={CELL2_CODE}
        startFrame={C2_START}
        typingDuration={C2_TYPED - C2_START}
        executedAt={C2_EXEC}
        output={
          <OutputBlock
            startFrame={C2_OUT}
            staggerFrames={10}
            lines={[
              { text: "['create_signup_inbox'," },
              { text: " 'wait_for_verification_email'," },
              { text: " 'get_latest_email'," },
              { text: " 'extract_otp_code'," },
              { text: " 'extract_verification_link'," },
              { text: " 'complete_signup_flow']", color: C.green, bold: true },
            ]}
          />
        }
      />

      {/* ── Cell 3: create_inbox ── */}
      <ColabCell
        cellNumber={3}
        code={CELL3_CODE}
        startFrame={C3_START}
        typingDuration={C3_TYPED - C3_START}
        executedAt={C3_EXEC}
        output={
          <OutputBlock
            startFrame={C3_OUT}
            lines={[
              { text: "Inbox address: ", color: C.subtext },
              { text: "coral-tiger-17@uncorreotemporal.com", color: C.teal, bold: true },
              { text: "Expires at:    2026-03-20T10:45:00Z", color: C.muted },
            ]}
          />
        }
      />

      {/* ── Cell 4: complete_signup_flow ── */}
      <ColabCell
        cellNumber={4}
        code={CELL4_CODE}
        startFrame={C4_START}
        typingDuration={C4_TYPED - C4_START}
        executedAt={C4_EXEC}
        output={
          <OutputBlock
            startFrame={C4_OUT}
            staggerFrames={15}
            lines={[
              { text: "Status: success",                                          color: C.green, bold: true },
              { text: "Email:  coral-tiger-17@uncorreotemporal.com",              color: C.teal },
              { text: "Link:   https://myservice.com/verify?token=eyJh...",       color: C.blue },
            ]}
          />
        }
      />
    </div>
  );
};
