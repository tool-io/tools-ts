import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ value: number; referenceScale: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "number" },
  { id: "referenceScale", label: "Reference scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.referenceScale);
  return H.finish({
    normalized:
      Math.sign(i.value) * Math.log1p(Math.abs(i.value) / i.referenceScale),
  });
};
export const example = {
  input: { value: 3, referenceScale: 1 },
  output: { result: { normalized: 1.3862943611198906 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "normalize/signed-log1p-reference-scale",
  title: "Normalization: Signed Log1p Reference Scale Tool",
  description:
    "Apply an odd signed-log1p transform with an explicitly supplied positive reference scale, preserving zero without imposing an undefined logarithm on negatives.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { normalized: { type: "number" } },
        required: ["normalized"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
