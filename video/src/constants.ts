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
  intro:              { start: 0,    end: 450  },   // 0:00 – 0:15
  sunoIntegration:    { start: 450,  end: 1350 },   // 0:15 – 0:45
  elevenLabsInteg:    { start: 1350, end: 2250 },   // 0:45 – 1:15
  mcpTools:           { start: 2250, end: 2850 },   // 1:15 – 1:35
  colabDemo:          { start: 2850, end: 4200 },   // 1:35 – 2:20
  cta:                { start: 4200, end: 4650 },   // 2:20 – 2:35
};

export const TOTAL_FRAMES = 4650;
