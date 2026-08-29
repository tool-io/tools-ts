import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      hand: 21,
    },
  },
  output: {
    kind: "gloves",
    measurementsCm: {
      hand: 21,
    },
    primary: "Glove 8.5",
    equivalents: ["Hand girth 21 cm", "Alpha L"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
