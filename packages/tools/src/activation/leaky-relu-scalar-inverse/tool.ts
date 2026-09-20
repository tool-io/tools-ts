import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ y: number; negativeSlope: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "y", label: "Y", kind: "number" },
  { id: "negativeSlope", label: "Negative slope", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.negativeSlope !== 0);
  return H.finish({
    preimages:
      i.negativeSlope > 0
        ? [i.y >= 0 ? i.y : i.y / i.negativeSlope]
        : i.y < 0
          ? []
          : i.y === 0
            ? [0]
            : [i.y / i.negativeSlope, i.y],
    unique: i.negativeSlope > 0 || i.y === 0,
  });
};
export const example = {
  input: { y: 2, negativeSlope: -0.5 },
  output: { result: { preimages: [-4, 2], unique: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/leaky-relu-scalar-inverse",
  title: "Activation: Leaky ReLU Scalar Inverse Tool",
  description:
    "Invert a scalar leaky ReLU with explicitly nonzero negative-branch slope, retaining the two/no-preimage cases for a negative slope rather than claiming a global inverse.",
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
          preimages: { type: "array", items: { type: "number" } },
          unique: { type: "boolean" },
        },
        required: ["preimages", "unique"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
