import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, 1, 1e6);
  return H.finish({ token: "$" + i.index });
};
export const example = {
  input: { index: 3 },
  output: { result: { token: "$3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/numbered-placeholder-formatter",
  title: "SQL Numbered Placeholder Formatter",
  description:
    "Format a positive PostgreSQL-style numbered SQL placeholder token; no binding, query parsing or database access.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
