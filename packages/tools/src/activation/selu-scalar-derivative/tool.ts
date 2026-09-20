import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  x: number;
  alpha: number;
  scale: number;
  zeroSide: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
  { id: "scale", label: "Scale", kind: "number" },
  {
    id: "zeroSide",
    label: "Zero side",
    kind: "string",
    enum: ["left", "right"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.alpha);
  H.positive(i.scale);
  H.choice(i.zeroSide, ["left", "right"]);
  return H.finish({
    derivative:
      i.scale *
      (i.x > 0
        ? 1
        : i.x < 0
          ? i.alpha * Math.exp(i.x)
          : i.zeroSide === "left"
            ? i.alpha
            : 1),
  });
};
export const example = {
  input: { x: 0, alpha: 2, scale: 3, zeroSide: "left" },
  output: { result: { derivative: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/selu-scalar-derivative",
  title: "Activation: Selu Scalar Derivative Tool",
  description:
    "Evaluate one SELU derivative from supplied positive alpha/scale and explicit left/right zero convention; no assumed network normalization.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
