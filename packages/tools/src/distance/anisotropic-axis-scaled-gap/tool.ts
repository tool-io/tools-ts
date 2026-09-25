import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  left: number;
  right: number;
  axisScale: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "left", label: "Left", kind: "number" },
  { id: "right", label: "Right", kind: "number" },
  { id: "axisScale", label: "Axis scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.axisScale);
  return H.finish({
    normalizedGap: (i.right - i.left) / i.axisScale,
    squaredContribution: ((i.right - i.left) / i.axisScale) ** 2,
  });
};
export const example = {
  input: { left: 1, right: 5, axisScale: 2 },
  output: { result: { normalizedGap: 2, squaredContribution: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "distance/anisotropic-axis-scaled-gap",
  title: "Distance: Anisotropic Axis Scaled Gap Tool",
  description:
    "Return one signed anisotropically scaled coordinate gap and its squared distance contribution under an explicit positive axis scale.",
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
          normalizedGap: { type: "number" },
          squaredContribution: { type: "number" },
        },
        required: ["normalizedGap", "squaredContribution"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
