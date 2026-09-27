import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ original: number; rounded: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "original", label: "Original", kind: "number" },
  { id: "rounded", label: "Rounded", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    direction:
      i.rounded === i.original
        ? "unchanged"
        : i.rounded > i.original
          ? "up"
          : "down",
    towardZero: Math.abs(i.rounded) < Math.abs(i.original),
  });
};
export const example = {
  input: { original: -1.2, rounded: -1 },
  output: { result: { direction: "up", towardZero: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "format/scalar-rounding-direction-label",
  title: "Formatting: Scalar Rounding Direction Label Tool",
  description:
    "Label the observed numerical direction of one already rounded scalar, distinguishing increasing value from moving toward zero; does not perform rounding.",
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
          direction: { type: "string" },
          towardZero: { type: "boolean" },
        },
        required: ["direction", "towardZero"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
