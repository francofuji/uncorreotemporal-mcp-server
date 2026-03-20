// ─── Video dimensions ────────────────────────────────────────────────────────
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

// ─── Colors (Catppuccin Mocha palette) ───────────────────────────────────────
export const C = {
  bg:        "#1e1e2e",  // base
  surface:   "#181825",  // mantle
  overlay:   "#313244",  // surface0
  muted:     "#585b70",  // surface2
  text:      "#cdd6f4",  // text
  subtext:   "#bac2de",  // subtext1
  accent:    "#cba6f7",  // mauve (primary brand)
  blue:      "#89b4fa",  // blue
  green:     "#a6e3a1",  // green
  yellow:    "#f9e2af",  // yellow
  red:       "#f38ba8",  // red
  teal:      "#94e2d5",  // teal
  sapphire:  "#74c7ec",  // sapphire
  // syntax colors
  syn_keyword:  "#cba6f7",  // mauve
  syn_string:   "#a6e3a1",  // green
  syn_comment:  "#585b70",  // muted
  syn_func:     "#89b4fa",  // blue
  syn_number:   "#fab387",  // peach
  syn_param:    "#f38ba8",  // red
  syn_default:  "#cdd6f4",  // text
};

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONT_MONO   = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";
export const FONT_SANS   = "'Inter', 'Segoe UI', Arial, sans-serif";

// ─── Scene frame boundaries ──────────────────────────────────────────────────
export const SCENES = {
  intro:         { start: 0,    end: 450  },   // 0:00 – 0:15
  problem:       { start: 450,  end: 1050 },   // 0:15 – 0:35
  solutionTools: { start: 1050, end: 1500 },   // 0:35 – 0:50
  colabDemo:     { start: 1500, end: 3300 },   // 0:50 – 1:50
  architecture:  { start: 3300, end: 4050 },   // 1:50 – 2:15
  cta:           { start: 4050, end: 4500 },   // 2:15 – 2:30
};

export const TOTAL_FRAMES = 4500;
