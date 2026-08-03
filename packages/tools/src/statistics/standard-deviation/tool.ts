import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculatePopulationSummary } from "../population-summary/tool.js";

export const calculateStandardDeviation = (
  values: readonly number[],
): number | null =>
  calculatePopulationSummary(values)?.standardDeviation ?? null;

export const standardDeviationExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { standardDeviation: Math.sqrt(2) },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly standardDeviation: number }
>;

export const standardDeviationTool = createSimpleTool({
  id: "statistics/standard-deviation",
  title: "Standard Deviation Calculator",
  description:
    "Calculate the population standard deviation of a finite dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "standard-deviation",
      id: "standardDeviation",
      kind: "number",
      label: "Population standard deviation",
    },
  ],
  calculate: (input) => {
    const standardDeviation = calculateStandardDeviation(
      input.values as number[],
    );
    if (standardDeviation === null)
      simpleError(
        "values",
        "Enter at least one finite number whose standard deviation stays finite.",
      );
    return { standardDeviation };
  },
});

export const runStandardDeviation = standardDeviationTool.execute;
export default standardDeviationTool;
