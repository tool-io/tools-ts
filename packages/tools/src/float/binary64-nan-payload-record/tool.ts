import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", label: "pattern", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const f = H.floatFields(i.pattern, 64);
  H.check(f.kind === "nan");
  return H.finish({
    sign: f.sign,
    quiet: (f.fraction & (1n << 51n)) !== 0n,
    payload: String(f.fraction & ((1n << 51n) - 1n)),
  });
};
export const example = {
  input: { pattern: "9221120237041090561" },
  output: { result: { sign: 0, quiet: true, payload: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "float/binary64-nan-payload-record",
  title: "IEEE Binary64 NaN Payload Record",
  description:
    "Extract binary64 NaN sign, high quiet bit and remaining 51-bit payload from exact raw bits; rejects non-NaN patterns and does not assert runtime NaN propagation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
