import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 94,
      waist: 78,
      hip: 100,
    },
  },
  output: {
    kind: "swimwear",
    measurementsCm: {
      chest: 94,
      waist: 78,
      hip: 100,
    },
    primary: "M",
    equivalents: [
      "Chest or bust circumference: 94 cm / 37 in",
      "Waist circumference: 78 cm / 30.7 in",
      "Hip circumference: 100 cm / 39.4 in",
    ],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
