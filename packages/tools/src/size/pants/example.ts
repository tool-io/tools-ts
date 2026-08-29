import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 86,
      hip: 102,
      inseam: 81,
    },
  },
  output: {
    kind: "pants",
    measurementsCm: {
      waist: 86,
      hip: 102,
      inseam: 81,
    },
    primary: "W34 / L32",
    equivalents: ["Alpha S", "Waist 86 cm", "Hip 102 cm"],
    warning:
      "This is a measurement-based starting point. Brand ease, cut, materials, and regional labeling vary; check the maker’s chart before buying.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
