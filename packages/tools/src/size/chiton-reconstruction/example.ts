import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 170,
      shoulder: 42,
      garmentLength: 140,
    },
  },
  output: {
    kind: "chiton-reconstruction",
    measurementsCm: {
      height: 170,
      shoulder: 42,
      garmentLength: 140,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Body height: 170 cm / 66.9 in",
      "Shoulder width: 42 cm / 16.5 in",
      "Desired garment length: 140 cm / 55.1 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
