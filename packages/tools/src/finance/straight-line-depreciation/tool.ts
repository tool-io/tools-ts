import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const straightLineDepreciationTool = createSimpleTool({
  id: "finance/straight-line-depreciation",
  title: "Straight-Line Depreciation Calculator",
  description:
    "Calculate the annual straight-line depreciation expense from cost, salvage value, and useful life.",
  inputs: [
    { id: "cost", label: "Cost", kind: "number", minimum: 0 },
    { id: "salvageValue", label: "Salvage value", kind: "number", minimum: 0 },
    {
      description: "Useful life in years; must be greater than zero.",
      id: "usefulLifeYears",
      label: "Useful life",
      kind: "number",
      minimum: 0,
      unit: "years",
    },
  ],
  outputs: [
    {
      id: "annualDepreciation",
      label: "Annual depreciation",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const life = input.usefulLifeYears as number;
    if (life <= 0)
      simpleError(
        "usefulLifeYears",
        "The useful life must be greater than zero years.",
        "invalid_life",
      );
    return {
      annualDepreciation:
        ((input.cost as number) - (input.salvageValue as number)) / life,
    };
  },
});
export const runStraightLineDepreciation = straightLineDepreciationTool.execute;
export default straightLineDepreciationTool;

export type StraightLineDepreciationInput = {
  readonly cost: number;
  readonly salvageValue: number;
  readonly usefulLifeYears: number;
};

export type StraightLineDepreciationOutput = {
  readonly annualDepreciation: number;
};

export const straightLineDepreciationExample = {
  input: { cost: 25_000, salvageValue: 5_000, usefulLifeYears: 5 },
  output: { annualDepreciation: 4_000 },
} satisfies ToolExample<
  StraightLineDepreciationInput,
  StraightLineDepreciationOutput
>;
