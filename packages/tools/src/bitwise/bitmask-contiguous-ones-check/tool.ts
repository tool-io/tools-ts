import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ mask: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mask", label: "Mask", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.mask, i.width);
  let y = x;
  while (y !== 0n && (y & 1n) === 0n) y >>= 1n;
  return H.finish({
    contiguousNonemptyOnes: x !== 0n && (y & (y + 1n)) === 0n,
  });
};
export const example = {
  input: { mask: "28", width: 8 },
  output: { result: { contiguousNonemptyOnes: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/bitmask-contiguous-ones-check",
  title: "Bitwise: Bitmask Contiguous Ones Check Tool",
  description:
    "Check whether an explicit fixed-width mask has exactly one nonempty contiguous run of ones; zero is false.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { contiguousNonemptyOnes: { type: "boolean" } },
        required: ["contiguousNonemptyOnes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
