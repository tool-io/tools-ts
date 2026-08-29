import type { ToolExample } from "../../core/example.js";

export const example = {
  input: {
    fixedCosts: 1000,
    pricePerUnit: 25,
    variableCostPerUnit: 10,
  },
  output: {
    breakEvenUnits: 66.66666666666667,
    contributionPerUnit: 15,
  },
} as const satisfies ToolExample<
  Readonly<Record<string, unknown>>,
  Readonly<Record<string, unknown>>
>;
