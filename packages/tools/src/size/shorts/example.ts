import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 76,
      hip: 98,
      inseam: 72,
    },
  },
  output: {
    kind: "shorts",
    measurementsCm: {
      waist: 76,
      hip: 98,
      inseam: 72,
    },
    primary: "XXS",
    equivalents: [
      "Waist circumference: 76 cm / 29.9 in",
      "Hip circumference: 98 cm / 38.6 in",
      "Inside leg or garment inseam: 72 cm / 28.3 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
