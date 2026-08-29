import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      bust: 92,
      underbust: 78,
    },
  },
  output: {
    kind: "bra",
    measurementsCm: {
      bust: 92,
      underbust: 78,
    },
    primary: "EU 80B",
    equivalents: [
      "Underbust 78 cm",
      "Bust 92 cm",
      "Sizing systems and cup progression differ by country",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
