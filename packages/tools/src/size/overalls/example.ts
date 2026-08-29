import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 100,
      waist: 88,
      inseam: 81,
    },
  },
  output: {
    kind: "overalls",
    measurementsCm: {
      chest: 100,
      waist: 88,
      inseam: 81,
    },
    primary: "L",
    equivalents: [
      "Chest circumference: 100 cm / 39.4 in",
      "Waist circumference: 88 cm / 34.6 in",
      "Inside leg: 81 cm / 31.9 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
