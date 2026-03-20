#!/usr/bin/env node
/**
 * generate-narration.mjs
 * Calls the ElevenLabs TTS API to generate narration MP3s for each scene.
 *
 * Usage:
 *   ELEVENLABS_API_KEY=sk_xxx node scripts/generate-narration.mjs
 *
 * Output: public/narration/{scene}.mp3  (6 files)
 */

import { writeFile, mkdir } from "node:fs/promises";
import { join, dirname }    from "node:path";
import { fileURLToPath }    from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR   = join(__dirname, "..", "public", "narration");

const API_KEY  = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Adam — deep, professional male
const MODEL    = "eleven_multilingual_v2";

if (!API_KEY) {
  console.error("❌  Set ELEVENLABS_API_KEY environment variable first.");
  process.exit(1);
}

// ─── Narration script — one segment per scene ─────────────────────────────────
const SEGMENTS = [
  {
    file: "intro.mp3",
    text: "This video was built using three AI tools — Remotion for animation, Suno for music, and ElevenLabs for voice. Each one required an email to sign up. That's where uncorreotemporal comes in.",
  },
  {
    file: "suno-integration.mp3",
    text: "We created a temporary inbox and used it to register on Suno. The signup email arrived in seconds. We extracted the verification link and clicked it automatically. Then we generated the ambient track you're hearing right now — in under a minute, no manual steps.",
  },
  {
    file: "elevenlabs-integration.mp3",
    text: "Same pattern with ElevenLabs. New inbox, new registration, automatic verification. Once the account was active, we hit the API to create an API key. That key is what's generating this narration — synthesized from the script, synchronized frame by frame with Remotion.",
  },
  {
    file: "mcp-tools.mp3",
    text: "Behind all of this are six MCP tools: create a signup inbox, wait for the email, read the message, extract an OTP or a verification link, or run the entire flow in a single call. Any agent can discover them via tools-list and use them without prior knowledge of the API.",
  },
  {
    file: "colab-demo.mp3",
    text: "In Google Colab, the whole thing fits in four cells. Connect to the MCP server, create an inbox, pass the email address to any service, and call complete-signup-flow. The agent gets back the inbox address, the verification link, and any OTP — in one tool call.",
  },
  {
    file: "cta.mp3",
    text: "Whatever you're building — agents, pipelines, automation workflows — if it needs email, uncorreotemporal gives it a real inbox. Free plan at uncorreotemporal dot com.",
  },
];

// ─── ElevenLabs TTS API call ──────────────────────────────────────────────────
async function generateMP3(text, outputPath) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key":   API_KEY,
      "Content-Type": "application/json",
      "Accept":       "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: {
        stability:        0.55,
        similarity_boost: 0.65,
        style:            0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error ${res.status}: ${err}`);
  }

  const buffer = await res.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
await mkdir(OUT_DIR, { recursive: true });

console.log(`\n🎙️  Generating ${SEGMENTS.length} narration segments...\n`);

for (const seg of SEGMENTS) {
  const outputPath = join(OUT_DIR, seg.file);
  process.stdout.write(`  → ${seg.file} ... `);
  try {
    await generateMP3(seg.text, outputPath);
    console.log("✓");
  } catch (err) {
    console.error(`\n  ❌  ${err.message}`);
    process.exit(1);
  }
}

console.log(`\n✅  All narration files saved to public/narration/\n`);
