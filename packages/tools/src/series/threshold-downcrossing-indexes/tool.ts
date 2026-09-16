import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly number[]; threshold: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
  { id: "threshold", label: "Threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    crossingIndexes: i.values.flatMap((v, j) =>
      j > 0 && i.values[j - 1] > i.threshold && v <= i.threshold ? [j] : [],
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [0, 1, 2, 1, 0], threshold: 1 },
  output: { result: { crossingIndexes: [3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/threshold-downcrossing-indexes",
  title: "Threshold Downcrossing Indexes",
  description:
    "Find down crossings from strictly above to the threshold-or-beyond; equality plateaus do not repeatedly trigger.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
