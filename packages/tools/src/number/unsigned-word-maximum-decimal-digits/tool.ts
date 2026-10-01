import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ bits: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", label: "Bits", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.bits, 1, 128);
  const max = 2n ** BigInt(i.bits) - 1n;
  return H.finish({
    maximumValue: String(max),
    decimalDigits: String(max).length,
  });
};
export const example = {
  input: { bits: 8 },
  output: { result: { maximumValue: "255", decimalDigits: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/unsigned-word-maximum-decimal-digits",
  title: "Number: Unsigned Word Maximum Decimal Digits Tool",
  description:
    "Determine exact maximum unsigned word value and required decimal display digits for a supplied bit width.",
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
          decimalDigits: { type: "number" },
          maximumValue: { type: "string" },
        },
        required: ["decimalDigits", "maximumValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
