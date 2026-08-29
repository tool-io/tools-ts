import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      height: 165,
      chest: 92,
      sleeve: 78,
    },
  },
  output: {
    kind: "kimono-reconstruction",
    measurementsCm: {
      height: 165,
      chest: 92,
      sleeve: 78,
    },
    primary: "Made-to-measure reconstruction",
    equivalents: [
      "Body height: 165 cm / 65 in",
      "Chest or bust circumference: 92 cm / 36.2 in",
      "Center-back-to-wrist length: 78 cm / 30.7 in",
    ],
    warning:
      "Historical garments did not use one modern international size system. Treat these measurements as a reconstruction profile and verify period, region, silhouette, underlayers, pattern source, and seam allowance.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
