import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  real: number;
  imaginary: number;
  imaginaryUnit: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "real", label: "Real", kind: "number" },
  { id: "imaginary", label: "Imaginary", kind: "number" },
  {
    id: "imaginaryUnit",
    label: "Imaginary unit",
    kind: "string",
    enum: ["i", "j"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.choice(i.imaginaryUnit, ["i", "j"]);
  return H.finish({
    label:
      String(i.real) +
      (i.imaginary < 0 ? " - " : " + ") +
      Math.abs(i.imaginary) +
      i.imaginaryUnit,
  });
};
export const example = {
  input: { real: 2, imaginary: -3, imaginaryUnit: "i" },
  output: { result: { label: "2 - 3i" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/complex-pair-sign-joining",
  title: "Formatting: Complex Pair Sign Joining Tool",
  description:
    "Join a supplied complex component pair with a sign-aware plus/minus separator and explicit i/j unit, without complex arithmetic or locale formatting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" } },
        required: ["label"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
