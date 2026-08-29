import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 76,
      hip: 100,
      length: 65,
    },
  },
  output: {
    kind: "skirt",
    measurementsCm: {
      waist: 76,
      hip: 100,
      length: 65,
    },
    primary: "XXS",
    equivalents: [
      "Waist circumference: 76 cm / 29.9 in",
      "Hip circumference: 100 cm / 39.4 in",
      "Desired skirt length: 65 cm / 25.6 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
