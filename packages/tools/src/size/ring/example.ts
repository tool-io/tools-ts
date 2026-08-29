import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      circumference: 5.44,
    },
  },
  output: {
    kind: "ring",
    measurementsCm: {
      circumference: 5.44,
    },
    primary: "ISO / EU 54",
    equivalents: ["Inner diameter 17.3 mm", "US 7", "UK G½", "Japan 14"],
    warning:
      "Finger size changes with temperature and time of day. Measure more than once and confirm wide bands with a jeweller.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
