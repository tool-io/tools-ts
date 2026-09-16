import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, queryPairs } from "../batch53-shared.js";

export type Input = Readonly<{ query: string; deleteNames: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "query", label: "Query", kind: "string" },
  { id: "deleteNames", label: "Delete names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const a = queryPairs(i.query),
    removed = a.filter((p) => i.deleteNames.includes(p.name));
  return {
    query: a
      .filter((p) => !i.deleteNames.includes(p.name))
      .map((p) => p.raw)
      .join("&"),
    removedIndexes: removed.map((p) => p.index),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { query: "a=1&b=two+words&a=2", deleteNames: ["a"] },
  output: { result: { query: "b=two+words", removedIndexes: [0, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-query-pair-deletion",
  title: "URL Query Pair Deletion Tool",
  description:
    "Delete every query pair whose decoded name is explicitly selected, preserving surviving raw spellings and order; output omits a leading question mark.",
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
