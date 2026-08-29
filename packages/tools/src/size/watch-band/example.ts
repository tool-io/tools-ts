import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      wrist: 17,
    },
  },
  output: {
    kind: "watch-band",
    measurementsCm: {
      wrist: 17,
    },
    primary: "Regular band",
    equivalents: ["Wrist 17 cm / 6.7 in", "Approx. wearable band length 20 cm"],
    warning:
      "Measure where the watch sits. Case length, clasp overlap, adjustment holes, and manufacturer measuring conventions affect fit.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
