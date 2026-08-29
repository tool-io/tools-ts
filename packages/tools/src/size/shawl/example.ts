import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      width: 70,
      length: 180,
    },
  },
  output: {
    kind: "shawl",
    measurementsCm: {
      width: 70,
      length: 180,
    },
    primary: "Full shawl",
    equivalents: ["70 × 180 cm", "27.6 × 70.9 in"],
    warning:
      "Shawl names describe use rather than standardized sizes; drape also depends on fabric and shape.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
