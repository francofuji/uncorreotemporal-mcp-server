import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FONT_MONO, FONT_SANS, WIDTH, HEIGHT } from "../constants";
import { ColabCell } from "../components/ColabCell";
import { OutputBlock } from "../components/OutputBlock";

// ─── Abridged demo: cells 3 + 4 only ─────────────────────────────────────────
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
print(f"Inbox: {inbox['email']}")`;

const CELL4_CODE = `# One call — creates inbox, waits, extracts link + OTP
flow = asyncio.run(session.call_tool(
    "complete_signup_flow",
    {"service_name": "MyService",
     "timeout_seconds": 90,
     "ttl_minutes": 15}
))
result = json.loads(flow.content[0].text)
print(f"Status: {result['status']}")
print(f"Email:  {result['email']}")
print(f"Link:   {result['verification_link']}")
print(f"OTP:    {result['otp_code']}")`;

const C3_START   = 30;
const C3_TYPED   = 100;
const C3_EXEC    = 110;
const C3_OUT     = 115;

const C4_START   = 230;
const C4_TYPED   = 320;
const C4_EXEC    = 332;
const C4_OUT     = 338;

export const ColabDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 15], [0, 1], {
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
        padding: "48px 120px",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Colab-style header */}
      <div
        style={{
          opacity: headerOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.yellow}, ${C.red})`,
          }}
        />
        <span style={{ fontFamily: FONT_SANS, fontSize: 20, color: C.subtext, fontWeight: 500 }}>
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

      {/* Subheading */}
      <div
        style={{
          opacity: headerOpacity,
          fontFamily: FONT_SANS,
          fontSize: 22,
          color: C.subtext,
          marginBottom: 24,
        }}
      >
        Full end-to-end flow — fits in{" "}
        <span style={{ color: C.accent, fontWeight: 600 }}>4 cells</span>
        {" "}in Google Colab
      </div>

      {/* Cell 3: create_inbox */}
      <ColabCell
        cellNumber={1}
        code={CELL3_CODE}
        startFrame={C3_START}
        typingDuration={C3_TYPED - C3_START}
        executedAt={C3_EXEC}
        output={
          <OutputBlock
            startFrame={C3_OUT}
            lines={[
              { text: "Inbox: coral-tiger-17@uncorreotemporal.com", color: C.teal, bold: true },
            ]}
          />
        }
      />

      {/* Cell 4: complete_signup_flow */}
      <ColabCell
        cellNumber={2}
        code={CELL4_CODE}
        startFrame={C4_START}
        typingDuration={C4_TYPED - C4_START}
        executedAt={C4_EXEC}
        output={
          <OutputBlock
            startFrame={C4_OUT}
            staggerFrames={18}
            lines={[
              { text: "Status: success",                                     color: C.green, bold: true },
              { text: "Email:  coral-tiger-17@uncorreotemporal.com",         color: C.teal },
              { text: "Link:   https://myservice.com/verify?token=eyJh...",  color: C.blue },
              { text: "OTP:    None  (this service uses links, not OTPs)",   color: C.muted },
            ]}
          />
        }
      />

      {/* Open in Colab badge */}
      <div
        style={{
          opacity: interpolate(frame, [600, 630], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          marginTop: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontFamily: FONT_SANS, fontSize: 18, color: C.muted }}>
          Try it yourself →
        </span>
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.sapphire}`,
            borderRadius: 8,
            padding: "8px 20px",
            fontFamily: FONT_MONO,
            fontSize: 17,
            color: C.sapphire,
          }}
        >
          Open in Colab ↗
        </div>
      </div>
    </div>
  );
};
