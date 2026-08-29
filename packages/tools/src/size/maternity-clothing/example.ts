import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      bust: 96,
      underbust: 82,
      hip: 104,
    },
  },
  output: {
    kind: "maternity-clothing",
    measurementsCm: {
      bust: 96,
      underbust: 82,
      hip: 104,
    },
    primary: "M",
    equivalents: [
      "Bust circumference: 96 cm / 37.8 in",
      "Underbust circumference: 82 cm / 32.3 in",
      "Hip circumference: 104 cm / 40.9 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
