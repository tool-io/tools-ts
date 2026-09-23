import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ left: string; right: string; width: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "string" },
  { id: "right", label: "Right", kind: "string" },
  { id: "width", label: "Width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.word(i.left, i.width),
    b = H.word(i.right, i.width),
    modulus = 2n ** BigInt(i.width),
    sign = modulus / 2n,
    sum = a + b,
    wrapped = sum % modulus,
    sa = a >= sign,
    sb = b >= sign,
    sr = wrapped >= sign;
  return H.finish({
    wrapped: String(wrapped),
    unsignedCarry: sum >= modulus,
    signedOverflow: sa === sb && sr !== sa,
  });
};
export const example = {
  input: { left: "127", right: "1", width: 8 },
  output: {
    result: { wrapped: "128", unsignedCarry: false, signedOverflow: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bitwise/fixed-width-add-overflow-flags",
  title: "Bitwise: Fixed Width Add Overflow Flags Tool",
  description:
    "Add two fixed-width bit patterns and expose wrapped result, unsigned carry and signed-overflow flags separately; unlike the existing unwrapped fixed-point overflow checker.",
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
          signedOverflow: { type: "boolean" },
          unsignedCarry: { type: "boolean" },
          wrapped: { type: "string" },
        },
        required: ["signedOverflow", "unsignedCarry", "wrapped"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
