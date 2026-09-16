import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ maskA: string; maskB: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "maskA", kind: "string", label: "maskA" },
  { id: "maskB", kind: "string", label: "maskB" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.bigint(i.maskA),
    b = H.bigint(i.maskB);
  H.check(a >= 0n && b >= 0n);
  const overlap = a & b;
  return H.finish({ overlapMask: String(overlap), overlaps: overlap !== 0n });
};
export const example = {
  input: { maskA: "12", maskB: "10" },
  output: { result: { overlapMask: "8", overlaps: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "binary/bitfield-overlap-mask",
  title: "Bitfield Overlap Mask",
  description:
    "Intersect exact nonnegative integer bit masks and retain the overlapping mask as decimal text.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
