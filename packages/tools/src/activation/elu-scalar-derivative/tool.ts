import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number; alpha: number; zeroSide: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "alpha", label: "Alpha", kind: "number" },
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
  H.choice(i.zeroSide, ["left", "right"]);
  return H.finish({
    derivative:
      i.x > 0
        ? 1
        : i.x < 0
          ? i.alpha * Math.exp(i.x)
          : i.zeroSide === "left"
            ? i.alpha
            : 1,
  });
};
export const example = {
  input: { x: 0, alpha: 2, zeroSide: "left" },
  output: { result: { derivative: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/elu-scalar-derivative",
  title: "Activation: Elu Scalar Derivative Tool",
  description:
    "Evaluate one ELU derivative with explicit positive alpha and left/right convention at zero; does not assert differentiability when slopes differ.",
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
