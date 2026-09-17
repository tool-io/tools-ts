import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ index: string; radices: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", kind: "string", label: "index" },
  { id: "radices", kind: "numberList", label: "radices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ digits: H.radixDecode(H.bigint(i.index), i.radices) });
};
export const example = {
  input: { index: "5", radices: [2, 3] },
  output: { result: { digits: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/mixed-radix-digit-decoder",
  title: "Mixed Radix Digit Decoder",
  description:
    "Decode a zero-based exact integer index into mixed-radix digits most-significant lane first; out-of-range indexes do not wrap.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
