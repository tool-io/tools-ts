import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const breakEvenPriceTool = createSimpleTool({
  id: "finance/break-even-price",
  title: "Break-Even Price Calculator",
  description:
    "Calculate the per-unit price at which total revenue covers fixed and variable costs.",
  inputs: [
    { id: "fixedCosts", label: "Fixed costs", kind: "number", minimum: 0 },
    {
      id: "variableCostPerUnit",
      label: "Variable cost per unit",
      kind: "number",
      minimum: 0,
    },
    {
      id: "units",
      label: "Expected units sold",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "breakEvenPrice", label: "Break-even price", kind: "number" },
  ],
  calculate: (input) => {
    const units = input.units as number;
    if (units <= 0)
      simpleError(
        "units",
        "The expected unit count must be greater than zero.",
        "invalid_units",
      );
    return {
      breakEvenPrice:
        (input.fixedCosts as number) / units +
        (input.variableCostPerUnit as number),
    };
  },
});
export const runBreakEvenPrice = breakEvenPriceTool.execute;
export default breakEvenPriceTool;

export type BreakEvenPriceInput = {
  readonly fixedCosts: number;
  readonly variableCostPerUnit: number;
  readonly units: number;
};

export type BreakEvenPriceOutput = {
  readonly breakEvenPrice: number;
};

export const breakEvenPriceExample = {
  input: { fixedCosts: 12_000, variableCostPerUnit: 8, units: 3_000 },
  output: { breakEvenPrice: 12 },
} satisfies ToolExample<BreakEvenPriceInput, BreakEvenPriceOutput>;
