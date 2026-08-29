import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      circumference: 5.7,
    },
  },
  output: {
    kind: "smart-ring",
    measurementsCm: {
      circumference: 5.7,
    },
    primary: "ISO / EU 57",
    equivalents: ["Inner diameter 18.1 mm", "US 8", "UK H½", "Japan 17"],
    warning:
      "Smart-ring shells and sensor clearances vary. Always confirm with the manufacturer’s physical sizing kit.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
