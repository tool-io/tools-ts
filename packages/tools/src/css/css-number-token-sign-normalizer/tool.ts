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
  H.check(/^[+-]?(?:\d*\.\d+|\d+)(?:[eE][+-]?\d+)?(?![\s\S])/.test(i.token));
  const d = H.decimal(i.token);
  return H.finish({
    normalized: i.token.startsWith("+") ? i.token.slice(1) : i.token,
    negativeZero: d.n === 0n && i.token.startsWith("-"),
  });
};
export const example = {
  input: { token: "+01.20" },
  output: { result: { normalized: "01.20", negativeZero: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/css-number-token-sign-normalizer",
  title: "CSS Number Token Sign Normalizer",
  description:
    "Normalize only an explicit plus sign on a strict CSS numeric spelling while retaining decimal scale and negative-zero evidence; not unit parsing.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
