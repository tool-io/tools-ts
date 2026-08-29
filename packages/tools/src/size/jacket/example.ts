import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 102,
      waist: 88,
      height: 178,
    },
  },
  output: {
    kind: "jacket",
    measurementsCm: {
      chest: 102,
      waist: 88,
      height: 178,
    },
    primary: "L",
    equivalents: [
      "Chest circumference: 102 cm / 40.2 in",
      "Waist circumference: 88 cm / 34.6 in",
      "Body height: 178 cm / 70.1 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
