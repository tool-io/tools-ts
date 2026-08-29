import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      bust: 92,
      waist: 74,
      hip: 100,
    },
  },
  output: {
    kind: "dress",
    measurementsCm: {
      bust: 92,
      waist: 74,
      hip: 100,
    },
    primary: "M",
    equivalents: ["US 6", "UK 10", "EU 36"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
