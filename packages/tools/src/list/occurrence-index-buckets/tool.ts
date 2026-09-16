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
  const m = new Map<string, number[]>();
  i.values.forEach((v, j) => {
    if (!m.has(v)) m.set(v, []);
    m.get(v)!.push(j);
  });
  return { buckets: [...m].map(([value, indexes]) => ({ value, indexes })) };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: ["a", "b", "a"] },
  output: {
    result: {
      buckets: [
        { value: "a", indexes: [0, 2] },
        { value: "b", indexes: [1] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/occurrence-index-buckets",
  title: "Occurrence Index Buckets",
  description:
    "Bucket occurrence indexes by exact string value in first-occurrence order without losing duplicates.",
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
