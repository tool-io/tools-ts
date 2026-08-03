import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculatePopulationSummary } from "../population-summary/tool.js";

export const calculatePopulationVariance = (
  values: readonly number[],
): number | null => calculatePopulationSummary(values)?.variance ?? null;

export const varianceExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { variance: 2 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly variance: number }
>;

export const varianceTool = createSimpleTool({
  id: "statistics/variance",
  title: "Population Variance Calculator",
  description: "Calculate the population variance of a finite dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "variance",
      id: "variance",
      kind: "number",
      label: "Population variance",
    },
  ],
  calculate: (input) => {
    const variance = calculatePopulationVariance(input.values as number[]);
    if (variance === null)
      simpleError(
        "values",
        "Enter at least one finite number whose variance stays finite.",
      );
    return { variance };
  },
});

export const runPopulationVariance = varianceTool.execute;
export default varianceTool;
