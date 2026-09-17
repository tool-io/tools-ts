import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ declaration: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "declaration", label: "declaration", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.declarations(i.declaration);
  H.check(r.length === 1);
  return H.finish({
    name: r[0].name,
    value: r[0].value,
    important: r[0].important,
  });
};
export const example = {
  input: { declaration: "Color:rgb(1,2,3) !important" },
  output: { result: { name: "color", value: "rgb(1,2,3)", important: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/declaration-name-value-split",
  title: "CSS Declaration Name Value Splitter",
  description:
    "Parse one restricted CSS declaration, respecting quoted/parenthesized colons and terminal important; comments and escaped property names are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
