import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", kind: "string", label: "token" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = i.token.split("..");
  H.check(t.length === 2);
  const start = H.numericToken(t[0]),
    end = H.numericToken(t[1]);
  H.check(end >= start);
  return H.finish({ start, end });
};
export const example = {
  input: { token: "-2..3.5" },
  output: { result: { start: -2, end: 3.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/numeric-range-token",
  title: "Numeric Range Token Parser",
  description:
    "Parse one inclusive-shape numeric start..end token under strict decimal grammar; rejects backwards endpoints and does not enumerate the range.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
