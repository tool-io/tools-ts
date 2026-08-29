import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 82,
      hip: 100,
      garmentLength: 85,
    },
  },
  output: {
    kind: "kilt-reconstruction",
    measurementsCm: {
      waist: 82,
      hip: 100,
      garmentLength: 85,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Waist circumference: 82 cm / 32.3 in",
      "Hip circumference: 100 cm / 39.4 in",
      "Desired garment length: 85 cm / 33.5 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
