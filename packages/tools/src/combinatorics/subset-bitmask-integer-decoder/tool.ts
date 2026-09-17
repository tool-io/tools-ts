import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ mask: string; size: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", kind: "string", label: "mask" },
  { id: "size", kind: "integer", label: "size" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.size, 0, 128);
  const mask = H.bigint(i.mask);
  H.check(mask >= 0n && mask < 1n << BigInt(i.size));
  return H.finish({
    indexes: Array.from({ length: i.size }, (_, j) => j).filter(
      (j) => (mask & (1n << BigInt(j))) !== 0n,
    ),
  });
};
export const example = {
  input: { mask: "9", size: 4 },
  output: { result: { indexes: [0, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/subset-bitmask-integer-decoder",
  title: "Subset Bitmask Integer Decoder",
  description:
    "Decode an exact bounded subset mask into ascending least-significant-bit indexes; masks with bits outside the explicit universe are rejected.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
