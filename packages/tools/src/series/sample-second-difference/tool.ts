import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    secondDifferences: i.values
      .slice(2)
      .map((v, j) => v - i.values[j + 1] - (i.values[j + 1] - i.values[j])),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [1, 2, 4, 7] },
  output: { result: { secondDifferences: [1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/sample-second-difference",
  title: "Sample Second Difference Tool",
  description:
    "Compute discrete second differences by sample index; not a time-normalized acceleration for irregular timestamps.",
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
