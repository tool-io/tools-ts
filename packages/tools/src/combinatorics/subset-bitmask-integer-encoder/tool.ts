import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ indexes: readonly number[]; size: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "indexes", kind: "numberList", label: "indexes" },
  { id: "size", kind: "integer", label: "size" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.combo(
    [...i.indexes].sort((a, b) => a - b),
    i.size,
  );
  return H.finish({
    mask: String(i.indexes.reduce((s, x) => s | (1n << BigInt(x)), 0n)),
  });
};
export const example = {
  input: { indexes: [0, 3], size: 4 },
  output: { result: { mask: "9" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/subset-bitmask-integer-encoder",
  title: "Subset Bitmask Integer Encoder",
  description:
    "Encode a bounded unique index subset into an exact nonnegative integer bitmask, with index zero as the least significant bit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { mask: { type: "string" } },
        required: ["mask"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
