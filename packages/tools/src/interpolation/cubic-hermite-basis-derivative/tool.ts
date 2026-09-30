import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ t: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "t", label: "T", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.t, 0, 1);
  return H.finish({
    h00Derivative: 6 * i.t * i.t - 6 * i.t,
    h10Derivative: 3 * i.t * i.t - 4 * i.t + 1,
    h01Derivative: -6 * i.t * i.t + 6 * i.t,
    h11Derivative: 3 * i.t * i.t - 2 * i.t,
  });
};
export const example = {
  input: { t: 0.5 },
  output: {
    result: {
      h00Derivative: -1.5,
      h10Derivative: -0.25,
      h01Derivative: 1.5,
      h11Derivative: -0.25,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/cubic-hermite-basis-derivative",
  title: "Interpolation: Cubic Hermite Basis Derivative Tool",
  description:
    "Return analytic derivatives of the four normalized cubic Hermite basis polynomials with respect to local t; physical x derivatives require caller-supplied interval scaling.",
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
          h00Derivative: { type: "number" },
          h01Derivative: { type: "number" },
          h10Derivative: { type: "number" },
          h11Derivative: { type: "number" },
        },
        required: [
          "h00Derivative",
          "h01Derivative",
          "h10Derivative",
          "h11Derivative",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
