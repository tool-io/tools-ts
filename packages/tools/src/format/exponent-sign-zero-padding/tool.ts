import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  exponent: number;
  minimumDigits: number;
  positiveSign: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "exponent", label: "Exponent", kind: "integer" },
  { id: "minimumDigits", label: "Minimum digits", kind: "integer" },
  { id: "positiveSign", label: "Positive sign", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.exponent, -1000000, 1000000);
  H.int(i.minimumDigits, 1, 16);
  return H.finish({
    formatted:
      (i.exponent < 0 ? "-" : i.positiveSign ? "+" : "") +
      String(Math.abs(i.exponent)).padStart(i.minimumDigits, "0"),
  });
};
export const example = {
  input: { exponent: 3, minimumDigits: 3, positiveSign: true },
  output: { result: { formatted: "+003" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/exponent-sign-zero-padding",
  title: "Formatting: Exponent Sign Zero Padding Tool",
  description:
    "Format a resolved signed integer exponent with explicit minimum magnitude digits and positive-sign policy, without floating-point parsing.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { formatted: { type: "string" } },
        required: ["formatted"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
