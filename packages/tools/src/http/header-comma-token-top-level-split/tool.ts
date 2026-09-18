import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ tokens: H.httpSplit(i.value, ",") });
};
export const example = {
  input: { value: 'a, "b,c", d' },
  output: { result: { tokens: ["a", '"b,c"', "d"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-comma-token-top-level-split",
  title: "HTTP Header Top-Level Comma Token Splitter",
  description:
    "Split HTTP comma lists with the existing quote/escape-aware scanner, not generic parentheses or CSS syntax; trims outer whitespace and preserves quoted text.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
