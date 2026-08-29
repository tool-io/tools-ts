import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 178,
      chest: 100,
      waist: 86,
      hip: 100,
    },
  },
  output: {
    kind: "wetsuit",
    measurementsCm: {
      height: 178,
      chest: 100,
      waist: 86,
      hip: 100,
    },
    primary: "3XL",
    equivalents: [
      "Body height: 178 cm / 70.1 in",
      "Chest circumference: 100 cm / 39.4 in",
      "Waist circumference: 86 cm / 33.9 in",
      "Hip circumference: 100 cm / 39.4 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
