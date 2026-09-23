import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  lowBit: number;
  fieldWidth: number;
  wordWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowBit", label: "Low bit", kind: "integer" },
  { id: "fieldWidth", label: "Field width", kind: "integer" },
  { id: "wordWidth", label: "Word width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.wordWidth, 1, 128);
  H.int(i.lowBit, 0, i.wordWidth);
  H.int(i.fieldWidth, 0, i.wordWidth - i.lowBit);
  return H.finish({
    mask: String((2n ** BigInt(i.fieldWidth) - 1n) << BigInt(i.lowBit)),
  });
};
export const example = {
  input: { lowBit: 2, fieldWidth: 3, wordWidth: 8 },
  output: { result: { mask: "28" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/field-mask-from-low-bit-width",
  title: "Bitwise: Field Mask From Low Bit Width Tool",
  description:
    "Construct one contiguous fixed-width field mask from low bit and width, permitting an empty zero-width field only at valid boundaries.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
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
