import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PercentYieldInput = {
  readonly actualYieldGrams: number;
  readonly theoreticalYieldGrams: number;
};

export type PercentYieldOutput = {
  readonly percentYield: number;
};

export const percentYieldExample = {
  input: { actualYieldGrams: 4, theoreticalYieldGrams: 5 },
  output: { percentYield: 80 },
} satisfies ToolExample<PercentYieldInput, PercentYieldOutput>;

export const percentYieldTool = createSimpleTool({
  id: "chemistry/percent-yield",
  title: "Percent Yield Calculator",
  description:
    "Compare an actual product mass against the theoretical yield as a percentage.",
  inputs: [
    {
      description: "Mass of product actually obtained.",
      id: "actualYieldGrams",
      kind: "number",
      label: "Actual yield",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Mass of product predicted by stoichiometry.",
      id: "theoreticalYieldGrams",
      kind: "number",
      label: "Theoretical yield",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Yield as a percentage of the theoretical yield.",
      format: "percent",
      id: "percentYield",
      kind: "number",
      label: "Percent yield",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const actualYieldGrams = input.actualYieldGrams as number;
    const theoreticalYieldGrams = input.theoreticalYieldGrams as number;
    if (!(theoreticalYieldGrams > 0))
      simpleError(
        "theoreticalYieldGrams",
        "The theoretical yield must be greater than zero.",
      );
    return { percentYield: (actualYieldGrams / theoreticalYieldGrams) * 100 };
  },
});
export const runPercentYield = percentYieldTool.execute;
export default percentYieldTool;
