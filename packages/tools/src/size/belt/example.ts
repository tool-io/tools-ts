import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 86,
    },
  },
  output: {
    equivalents: ["US 36 in", "Suggested center-hole length 85 cm"],
    kind: "belt",
    measurementsCm: {
      waist: 86,
    },
    primary: "EU 85",
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
