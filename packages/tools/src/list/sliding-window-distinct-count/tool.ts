import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ values: readonly string[]; window: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "values", label: "Values", kind: "stringList" },
  { id: "window", label: "Window", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  bounded(i.window, "window", 1, 128);
  return {
    counts: Array.from(
      { length: Math.max(0, i.values.length - i.window + 1) },
      (_, j) => {
        const a = i.values.slice(j, j + i.window);
        return new Set(a).size;
      },
    ),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: ["a", "a", "b", "a"], window: 3 },
  output: { result: { counts: [2, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "list/sliding-window-distinct-count",
  title: "Sliding Window Distinct Count",
  description:
    "Count distinct exact-string values in each complete stride-one window, preserving window order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { counts: { type: "array", items: { type: "number" } } },
        required: ["counts"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
