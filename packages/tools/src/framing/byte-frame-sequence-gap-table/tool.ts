import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ sequence: readonly number[]; modulus: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sequence", kind: "numberList", label: "sequence" },
  { id: "modulus", kind: "integer", label: "modulus" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.modulus, 2, 1e9);
  i.sequence.forEach((x) => H.int(x, 0, i.modulus - 1));
  return H.finish({
    transitions: i.sequence.slice(1).map((v, j) => {
      const forward = H.mod(v - i.sequence[j], i.modulus);
      return {
        fromIndex: j,
        toIndex: j + 1,
        forward,
        missing: forward === 0 ? null : forward - 1,
        duplicate: forward === 0,
      };
    }),
  });
};
export const example = {
  input: { sequence: [7, 0, 2, 2], modulus: 8 },
  output: {
    result: {
      transitions: [
        { fromIndex: 0, toIndex: 1, forward: 1, missing: 0, duplicate: false },
        { fromIndex: 1, toIndex: 2, forward: 2, missing: 1, duplicate: false },
        {
          fromIndex: 2,
          toIndex: 3,
          forward: 0,
          missing: null,
          duplicate: true,
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "framing/byte-frame-sequence-gap-table",
  title: "Byte Frame Sequence Gap Table",
  description:
    "Audit modular frame sequence transitions under an explicit forward-order assumption; duplicates retain unknown missing count and reordering cannot be inferred from residues alone.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
