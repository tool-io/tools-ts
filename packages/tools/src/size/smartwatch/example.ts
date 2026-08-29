import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      wrist: 17,
      ease: 1,
    },
  },
  output: {
    kind: "smartwatch",
    measurementsCm: {
      wrist: 17,
      ease: 1,
    },
    primary: "18 cm finished length",
    equivalents: [
      "Body circumference 17 cm",
      "Preferred ease 1 cm",
      "7.1 in finished length",
    ],
    warning:
      "Clasp overlap, link dimensions, stretch, and manufacturer measuring conventions can change the required finished length.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
