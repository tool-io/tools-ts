import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      head: 57,
    },
  },
  output: {
    kind: "helmet",
    measurementsCm: {
      head: 57,
    },
    primary: "M · 57 cm",
    equivalents: ["Head circumference 57 cm", "US hat size about 7.14"],
    warning:
      "Helmet fit is safety-critical. Use the manufacturer’s current chart and perform its complete fit and retention check.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
