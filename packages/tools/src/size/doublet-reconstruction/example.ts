import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 94,
      waist: 76,
      backLength: 42,
    },
  },
  output: {
    kind: "doublet-reconstruction",
    measurementsCm: {
      chest: 94,
      waist: 76,
      backLength: 42,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Chest or bust circumference: 94 cm / 37 in",
      "Waist circumference: 76 cm / 29.9 in",
      "Back waist length: 42 cm / 16.5 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
