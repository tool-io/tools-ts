import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      chest: 96,
      height: 175,
      waist: 82,
    },
  },
  output: {
    kind: "cloak-reconstruction",
    measurementsCm: {
      chest: 96,
      height: 175,
      waist: 82,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Chest or bust circumference: 96 cm / 37.8 in",
      "Body height: 175 cm / 68.9 in",
      "Waist circumference: 82 cm / 32.3 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
