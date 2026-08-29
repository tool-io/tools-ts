import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      head: 57,
    },
  },
  output: {
    kind: "hat",
    measurementsCm: {
      head: 57,
    },
    primary: "M · 57 cm",
    equivalents: ["Head circumference 57 cm", "US hat size about 7.14"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
