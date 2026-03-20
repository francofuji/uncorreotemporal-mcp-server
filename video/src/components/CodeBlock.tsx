import React from "react";
import { C, FONT_MONO } from "../constants";

// ─── Minimal Python tokenizer ─────────────────────────────────────────────────
const KEYWORDS = new Set([
  "import","from","async","await","def","return","if","else","elif",
  "for","while","in","not","and","or","True","False","None","as","with",
]);

type Token = { text: string; color: string };

function tokenizePython(code: string): Token[] {
  const tokens: Token[] = [];
  // Split on word boundaries, keeping delimiters
  const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|#[^\n]*|\b\w+\b|[^\w\s]|\s+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(code)) !== null) {
    const t = match[0];
    let color = C.syn_default;
    if (t.startsWith('"') || t.startsWith("'"))   color = C.syn_string;
    else if (t.startsWith("#"))                    color = C.syn_comment;
    else if (KEYWORDS.has(t))                      color = C.syn_keyword;
    else if (/^\d+$/.test(t))                      color = C.syn_number;
    else if (/^[A-Z_][A-Z0-9_]+$/.test(t))        color = C.syn_number;  // CONSTANTS
    tokens.push({ text: t, color });
  }
  return tokens;
}

interface Props {
  code: string;
  revealedChars: number;  // how many chars to show (typing effect)
  fontSize?: number;
}

export const CodeBlock: React.FC<Props> = ({ code, revealedChars, fontSize = 22 }) => {
  const visible = code.slice(0, Math.round(revealedChars));
  const tokens = tokenizePython(visible);

  return (
    <pre
      style={{
        fontFamily: FONT_MONO,
        fontSize,
        lineHeight: 1.6,
        margin: 0,
        padding: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {tokens.map((tok, i) => (
        <span key={i} style={{ color: tok.color }}>
          {tok.text}
        </span>
      ))}
    </pre>
  );
};
