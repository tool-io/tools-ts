import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculatePopulationSummary } from "../population-summary/tool.js";

export const calculateCoefficientOfVariation = (
  values: readonly number[],
): number | null => {
  const summary = calculatePopulationSummary(values);
  if (summary === null || summary.mean === 0) return null;
  const result = (summary.standardDeviation / summary.mean) * 100;
  return Number.isFinite(result) ? result : null;
};

export const coefficientOfVariationExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { coefficientOfVariationPercent: (Math.sqrt(2) / 3) * 100 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly coefficientOfVariationPercent: number }
>;

export const coefficientOfVariationTool = createSimpleTool({
  id: "statistics/coefficient-of-variation",
  title: "Coefficient of Variation Calculator",
  description:
    "Calculate population standard deviation as a percentage of the mean.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "coefficient-of-variation",
      id: "coefficientOfVariationPercent",
      kind: "number",
      label: "Coefficient of variation",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const coefficientOfVariationPercent = calculateCoefficientOfVariation(
      input.values as number[],
    );
    if (coefficientOfVariationPercent === null)
      simpleError(
        "values",
        "Enter finite numbers with a nonzero mean and finite variation.",
      );
    return { coefficientOfVariationPercent };
  },
});

export const runCoefficientOfVariation = coefficientOfVariationTool.execute;
export default coefficientOfVariationTool;
