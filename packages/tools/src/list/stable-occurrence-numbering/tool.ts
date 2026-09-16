import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const counts = new Map<string, number>();
  return {
    occurrenceNumbers: i.values.map((v) => {
      const k = (counts.get(v) ?? 0) + 1;
      counts.set(v, k);
      return k;
    }),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: ["a", "b", "a"] },
  output: { result: { occurrenceNumbers: [1, 1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/stable-occurrence-numbering",
  title: "Stable Occurrence Numbering",
  description:
    "Assign stable one-based occurrence numbers independently for each exact supplied string.",
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
