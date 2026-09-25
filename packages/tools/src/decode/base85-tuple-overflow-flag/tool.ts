import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ digits: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "digits", label: "Digits", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.digits.length === 5);
  i.digits.forEach((x) => H.int(x, 0, 84));
  const value = i.digits.reduce((s, x) => s * 85n + BigInt(x), 0n);
  return H.finish({
    value: String(value),
    fitsUnsigned32: value <= 0xffffffffn,
  });
};
export const example = {
  input: { digits: [84, 84, 84, 84, 84] },
  output: { result: { value: "4437053124", fitsUnsigned32: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "decode/base85-tuple-overflow-flag",
  title: "Decoding: Base85 Tuple Overflow Flag Tool",
  description:
    "Inspect one five-digit radix85 tuple for the 32-bit decoded-word overflow condition, independently of any alphabet or stream shorthand.",
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
          fitsUnsigned32: { type: "boolean" },
          value: { type: "string" },
        },
        required: ["fitsUnsigned32", "value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
