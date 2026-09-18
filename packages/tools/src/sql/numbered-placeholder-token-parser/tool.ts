import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^\$([1-9][0-9]*)(?![\s\S])/.exec(i.token);
  H.check(m);
  return H.finish({ index: H.int(Number(m![1]), 1, 1e6) });
};
export const example = {
  input: { token: "$3" },
  output: { result: { index: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/numbered-placeholder-token-parser",
  title: "SQL Numbered Placeholder Token Parser",
  description:
    "Parse exactly one canonical positive $N numbered SQL placeholder token; does not discover placeholders inside SQL source.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
