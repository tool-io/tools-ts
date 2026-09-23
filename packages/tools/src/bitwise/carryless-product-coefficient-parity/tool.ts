import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  left: string;
  right: string;
  width: number;
  coefficientIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
  { id: "coefficientIndex", label: "Coefficient index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.word(i.left, i.width),
    b = H.word(i.right, i.width);
  H.int(i.coefficientIndex, 0, 2 * i.width - 2);
  let parity = 0;
  for (let j = 0; j < i.width; j++) {
    const k = i.coefficientIndex - j;
    if (k >= 0 && k < i.width)
      parity ^= Number(((a >> BigInt(j)) & 1n) * ((b >> BigInt(k)) & 1n));
  }
  return H.finish({ coefficient: parity });
};
export const example = {
  input: { left: "3", right: "3", width: 2, coefficientIndex: 1 },
  output: { result: { coefficient: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/carryless-product-coefficient-parity",
  title: "Bitwise: Carryless Product Coefficient Parity Tool",
  description:
    "Compute one GF(2) carryless polynomial product coefficient by bounded XOR convolution of explicit input words; no ordinary integer carry or full multiplication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { coefficient: { type: "number" } },
        required: ["coefficient"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
