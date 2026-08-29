import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 102,
      height: 178,
    },
  },
  output: {
    kind: "suit-jacket",
    measurementsCm: {
      chest: 102,
      height: 178,
    },
    primary: "US / UK 40 Regular",
    equivalents: ["EU 52", "Chest 102 cm", "Length Regular"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
