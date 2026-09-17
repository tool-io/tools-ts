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
  H.check(i.token.length <= 256);
  const t = i.token.split(",");
  H.check(t.length === 2);
  return H.finish({ values: t.map(H.numericToken) });
};
export const example = {
  input: { token: "1,-2" },
  output: { result: { values: [1, -2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/numeric-pair-token",
  title: "Numeric Pair Token Parser",
  description:
    "Parse an exact 2-component comma-separated finite numeric token with strict decimal/exponent grammar; no missing components or whitespace.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
