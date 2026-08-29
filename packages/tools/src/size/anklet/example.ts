import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      ankle: 22,
      ease: 1.5,
    },
  },
  output: {
    kind: "anklet",
    measurementsCm: {
      ankle: 22,
      ease: 1.5,
    },
    primary: "23.5 cm finished length",
    equivalents: [
      "Body circumference 22 cm",
      "Preferred ease 1.5 cm",
      "9.3 in finished length",
    ],
    warning:
      "Clasp overlap, link dimensions, stretch, and manufacturer measuring conventions can change the required finished length.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
