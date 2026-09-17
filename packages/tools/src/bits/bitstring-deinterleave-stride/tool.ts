import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ bits: string; stride: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", kind: "string", label: "bits" },
  { id: "stride", kind: "integer", label: "stride" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bits(i.bits);
  H.int(i.stride, 1, 128);
  return H.finish({
    lanes: Array.from({ length: i.stride }, (_, j) =>
      i.bits
        .split("")
        .filter((_, k) => k % i.stride === j)
        .join(""),
    ),
  });
};
export const example = {
  input: { bits: "10110", stride: 3 },
  output: { result: { lanes: ["11", "00", "1"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bits/bitstring-deinterleave-stride",
  title: "Bit String Stride Deinterleaver",
  description:
    "Deinterleave bit positions into explicitly many modulo-stride lanes, retaining empty lanes and incomplete final groups.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
