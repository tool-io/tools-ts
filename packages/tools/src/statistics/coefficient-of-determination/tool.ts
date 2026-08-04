import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateCoefficientOfDetermination = (
  actual: readonly number[],
  predicted: readonly number[],
): number | null => {
  if (
    actual.length === 0 ||
    actual.length !== predicted.length ||
    !actual.every(Number.isFinite) ||
    !predicted.every(Number.isFinite)
  )
    return null;

  const mean = actual.reduce((sum, value) => sum + value, 0) / actual.length;
  if (!Number.isFinite(mean)) return null;
  const total = actual.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  if (total === 0 || !Number.isFinite(total)) return null;
  const residual = actual.reduce(
    (sum, value, index) => sum + (value - predicted[index]!) ** 2,
    0,
  );
  const coefficient = 1 - residual / total;
  return Number.isFinite(coefficient) ? coefficient : null;
};

export const coefficientOfDeterminationExample = {
  input: {
    actual: [3, -0.5, 2, 7],
    predicted: [2.5, 0, 2, 8],
  },
  output: { coefficientOfDetermination: 0.9486081370449679 },
} satisfies ToolExample<
  {
    readonly actual: readonly number[];
    readonly predicted: readonly number[];
  },
  { readonly coefficientOfDetermination: number }
>;

export const coefficientOfDeterminationTool = createSimpleTool({
  id: "statistics/coefficient-of-determination",
  title: "Coefficient of Determination Calculator",
  description: "Calculate R² from paired observed and predicted values.",
  inputs: [
    { id: "actual", label: "Observed values", kind: "numberList" },
    { id: "predicted", label: "Predicted values", kind: "numberList" },
  ],
  outputs: [
    {
      format: "coefficient-of-determination",
      id: "coefficientOfDetermination",
      kind: "number",
      label: "R²",
    },
  ],
  calculate: (input) => {
    const coefficientOfDetermination = calculateCoefficientOfDetermination(
      input.actual as number[],
      input.predicted as number[],
    );
    if (coefficientOfDetermination === null)
      simpleError(
        "predicted",
        "Enter equal-length finite lists with variation in observed values.",
      );
    return { coefficientOfDetermination };
  },
});

export const runCoefficientOfDetermination =
  coefficientOfDeterminationTool.execute;
export default coefficientOfDeterminationTool;
