import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ word: string; width: number; bitIndex: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "word", label: "Word", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
  { id: "bitIndex", label: "Bit index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const x = H.word(i.word, i.width);
  H.int(i.bitIndex, 0, i.width - 1);
  let j = i.bitIndex,
    mask = 0n;
  while (j < i.width) {
    mask |= 2n ** BigInt(j);
    if (((x >> BigInt(j)) & 1n) === 0n) break;
    j++;
  }
  return H.finish({
    propagationMask: String(mask),
    carryOut: j === i.width,
    result: String((x + 2n ** BigInt(i.bitIndex)) % 2n ** BigInt(i.width)),
  });
};
export const example = {
  input: { word: "7", width: 4, bitIndex: 0 },
  output: { result: { propagationMask: "15", carryOut: false, result: "8" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/single-bit-carry-propagation-mask",
  title: "Bitwise: Single Bit Carry Propagation Mask Tool",
  description:
    "Trace bits toggled by adding a single one at an explicit position, including the first zero stop bit and retaining final carry-out.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          carryOut: { type: "boolean" },
          propagationMask: { type: "string" },
          result: { type: "string" },
        },
        required: ["carryOut", "propagationMask", "result"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
