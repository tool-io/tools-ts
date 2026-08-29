import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 40,
      sleeve: 86,
    },
  },
  output: {
    kind: "dress-shirt",
    measurementsCm: {
      neck: 40,
      sleeve: 86,
    },
    primary: "42 cm / 16.55 in collar",
    equivalents: ["Sleeve 86 cm", "Sleeve 33.85 in"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
