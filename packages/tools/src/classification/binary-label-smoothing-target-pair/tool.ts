import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ label: number; smoothing: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "label", label: "Label", kind: "integer" },
  { id: "smoothing", label: "Smoothing", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.label, 0, 1);
  H.bounded(i.smoothing, 0, 1);
  return H.finish({
    negativeTarget: (1 - i.label) * (1 - i.smoothing) + i.smoothing / 2,
    positiveTarget: i.label * (1 - i.smoothing) + i.smoothing / 2,
  });
};
export const example = {
  input: { label: 1, smoothing: 0.2 },
  output: { result: { negativeTarget: 0.1, positiveTarget: 0.9 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classification/binary-label-smoothing-target-pair",
  title: "Classification: Binary Label Smoothing Target Pair Tool",
  description:
    "Apply uniform-two-class label smoothing with explicit epsilon in [0,1], returning both target components rather than a predicted class.",
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
          negativeTarget: { type: "number" },
          positiveTarget: { type: "number" },
        },
        required: ["negativeTarget", "positiveTarget"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
