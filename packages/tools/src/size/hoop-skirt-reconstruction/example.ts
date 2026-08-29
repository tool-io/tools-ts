import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      waist: 76,
      waistToFloor: 105,
    },
  },
  output: {
    kind: "hoop-skirt-reconstruction",
    measurementsCm: {
      waist: 76,
      waistToFloor: 105,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Waist circumference: 76 cm / 29.9 in",
      "Waist-to-floor length: 105 cm / 41.3 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
