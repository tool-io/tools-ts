import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 84,
      hip: 100,
      inseam: 81,
    },
  },
  output: {
    kind: "jeans",
    measurementsCm: {
      waist: 84,
      hip: 100,
      inseam: 81,
    },
    primary: "W33",
    equivalents: ["Waist 84 cm", "Waist 33.1 in", "Alpha M"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
