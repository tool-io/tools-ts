import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  digits: readonly number[];
  radices: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "digits", kind: "numberList", label: "digits" },
  { id: "radices", kind: "numberList", label: "radices" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ index: String(H.radixEncode(i.digits, i.radices)) });
};
export const example = {
  input: { digits: [1, 2], radices: [2, 3] },
  output: { result: { index: "5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "combinatorics/mixed-radix-digit-encoder",
  title: "Mixed Radix Digit Encoder",
  description:
    "Encode bounded mixed-radix digits most-significant lane first into exact integer text; every radix is positive and every digit must fit.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { index: { type: "string" } },
        required: ["index"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
