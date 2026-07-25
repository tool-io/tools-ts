import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GeometricMeanInput = { readonly values: readonly number[] };
export type GeometricMeanOutput = { readonly geometricMean: number };

export const geometricMeanExample = {
  input: { values: [1, 4, 16] },
  output: { geometricMean: 4 },
} satisfies ToolExample<GeometricMeanInput, GeometricMeanOutput>;

export const geometricMeanTool = createSimpleTool({
  id: "statistics/geometric-mean",
  title: "Geometric Mean Calculator",
  description:
    "Calculate the geometric mean of a nonempty list of nonnegative numbers.",
  inputs: [
    {
      description: "Nonnegative finite values.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      format: "geometric-mean",
      id: "geometricMean",
      kind: "number",
      label: "Geometric mean",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    if (values.some((value) => value < 0))
      simpleError("values", "Geometric mean requires nonnegative values.");
    if (values.some((value) => value === 0)) return { geometricMean: 0 };
    return {
      geometricMean: Math.exp(
        values.reduce((sum, value) => sum + Math.log(value), 0) / values.length,
      ),
    };
  },
});

export const runGeometricMean = geometricMeanTool.execute;
export default geometricMeanTool;
