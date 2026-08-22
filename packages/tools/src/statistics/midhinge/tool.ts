import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateInclusiveQuartiles } from "../inclusive-quartiles/tool.js";

export const calculateMidhinge = (values: readonly number[]): number | null => {
  const quartiles = calculateInclusiveQuartiles(values);
  if (quartiles === null) return null;
  const result = (quartiles[0] + quartiles[2]) / 2;
  return Number.isFinite(result) ? result : null;
};

export type MidhingeInput = {
  readonly values: readonly number[];
};

export type MidhingeOutput = {
  readonly midhinge: number;
};

export const midhingeExample = {
  input: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
  output: { midhinge: 4.5 },
} satisfies ToolExample<MidhingeInput, MidhingeOutput>;

export const midhingeTool = createSimpleTool({
  id: "statistics/midhinge",
  title: "Midhinge Calculator",
  description:
    "Calculate the midpoint of the inclusive first and third quartiles of a dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "midhinge",
      id: "midhinge",
      kind: "number",
      label: "Midhinge",
    },
  ],
  calculate: (input) => {
    const midhinge = calculateMidhinge(input.values as number[]);
    if (midhinge === null)
      simpleError(
        "values",
        "Enter at least one finite number.",
        "empty_values",
      );
    return { midhinge };
  },
});

export const runMidhinge = midhingeTool.execute;
export default midhingeTool;
