import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; shift: number; fill: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "shift", kind: "integer", label: "shift" },
  { id: "fill", kind: "string", label: "fill" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.shift, -128, 128);
  H.check(i.fill === "0" || i.fill === "1");
  return H.finish({
    bits: i.bits
      .split("")
      .map((_, j) => i.bits[j - i.shift] ?? i.fill)
      .join(""),
  });
};
export const example = {
  input: { bits: "1011", shift: 2, fill: "0" },
  output: { result: { bits: "0010" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-shift-with-fill",
  title: "Bit String Shift with Fill",
  description:
    "Shift bit positions with explicit zero/one fill and fixed output width; positive shifts move toward higher string indexes, not numeric bit significance.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
