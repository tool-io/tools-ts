import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const compoundGrowthFactorTool = createSimpleTool({
  id: "finance/compound-growth-factor",
  title: "Compound Growth Factor Calculator",
  description:
    "Calculate the compounding growth factor (1 + rate) raised to a number of periods.",
  inputs: [
    {
      description: "Growth rate per period; may be negative for decay.",
      id: "ratePercent",
      label: "Rate per period",
      kind: "number",
      minimum: -100,
      unit: "%",
    },
    { id: "periods", label: "Periods", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "factor", label: "Growth factor", kind: "number" }],
  calculate: (input) => {
    return {
      factor:
        (1 + (input.ratePercent as number) / 100) ** (input.periods as number),
    };
  },
});
export const runCompoundGrowthFactor = compoundGrowthFactorTool.execute;
export default compoundGrowthFactorTool;

export type CompoundGrowthFactorInput = {
  readonly ratePercent: number;
  readonly periods: number;
};

export type CompoundGrowthFactorOutput = {
  readonly factor: number;
};

export const compoundGrowthFactorExample = {
  input: { ratePercent: 5, periods: 10 },
  output: { factor: 1.628894626777442 },
} satisfies ToolExample<CompoundGrowthFactorInput, CompoundGrowthFactorOutput>;
