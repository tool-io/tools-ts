import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 102,
    },
  },
  output: {
    kind: "t-shirt",
    measurementsCm: {
      chest: 102,
    },
    primary: "L",
    equivalents: ["Chest 102 cm", "Chest 40.2 in", "EU body-size indicator 52"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
