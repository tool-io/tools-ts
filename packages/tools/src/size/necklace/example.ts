import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    unit: "cm",
    values: {
      neck: 36,
      desiredDrop: 10,
    },
  },
  output: {
    kind: "necklace",
    measurementsCm: {
      neck: 36,
      desiredDrop: 10,
    },
    primary: "56 cm necklace",
    equivalents: ["Neck 36 cm", "Approx. drop 10 cm", "22 in finished length"],
    warning:
      "Pendant dimensions, chain thickness, clasp, and neckline affect the visible drop.",
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
