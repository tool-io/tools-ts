import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 39,
    },
  },
  output: {
    kind: "collar",
    measurementsCm: {
      neck: 39,
    },
    primary: "41 cm collar",
    equivalents: ["15.95 in collar", "Measured neck 39 cm"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
