import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, queryPairs } from "../batch53-shared.js";

export type Input = Readonly<{ query: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "query", label: "Query", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = queryPairs(i.query),
    names = [...new Set(a.map((p) => p.name))];
  return {
    keys: names.map((name) => ({
      name,
      count: a.filter((p) => p.name === name).length,
      values: a.filter((p) => p.name === name).map((p) => p.value),
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { query: "a=1&a=2&b=" },
  output: {
    result: {
      keys: [
        { name: "a", count: 2, values: ["1", "2"] },
        { name: "b", count: 1, values: [""] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-query-key-repetition-summary",
  title: "URL Query Key Repetition Summary",
  description:
    "Summarize query-name repetition in first-seen order and retain all decoded values, including empty values.",
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
