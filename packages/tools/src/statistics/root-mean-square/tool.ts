import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RootMeanSquareInput = { readonly values: readonly number[] };
export type RootMeanSquareOutput = { readonly rootMeanSquare: number };

export const rootMeanSquareExample = {
  input: { values: [1, 2, 3] },
  output: { rootMeanSquare: 2.1602468994692865 },
} satisfies ToolExample<RootMeanSquareInput, RootMeanSquareOutput>;

export const rootMeanSquareTool = createSimpleTool({
  id: "statistics/root-mean-square",
  title: "Root Mean Square Calculator",
  description:
    "Calculate the quadratic mean, or root mean square, of a nonempty numeric list.",
  inputs: [
    {
      description: "Finite values whose squared magnitudes will be averaged.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      format: "root-mean-square",
      id: "rootMeanSquare",
      kind: "number",
      label: "Root mean square",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    return {
      rootMeanSquare: Math.hypot(...values) / Math.sqrt(values.length),
    };
  },
});

export const runRootMeanSquare = rootMeanSquareTool.execute;
export default rootMeanSquareTool;
