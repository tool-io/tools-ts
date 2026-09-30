import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  x: number;
  lowerX: number;
  upperX: number;
  lowerValue: number;
  upperValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "lowerX", label: "Lower x", kind: "number" },
  { id: "upperX", label: "Upper x", kind: "number" },
  { id: "lowerValue", label: "Lower value", kind: "number" },
  { id: "upperValue", label: "Upper value", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lowerX < i.upperX);
  return H.finish({
    outsideOrEndpoint: i.x <= i.lowerX || i.x >= i.upperX,
    endpointValue:
      i.x <= i.lowerX ? i.lowerValue : i.x >= i.upperX ? i.upperValue : 0,
    interiorNeedsInterpolation: i.x > i.lowerX && i.x < i.upperX,
  });
};
export const example = {
  input: { x: -1, lowerX: 0, upperX: 2, lowerValue: 3, upperValue: 4 },
  output: {
    result: {
      outsideOrEndpoint: true,
      endpointValue: 3,
      interiorNeedsInterpolation: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interpolation/clamped-interpolant-endpoint-value",
  title: "Interpolation: Clamped Interpolant Endpoint Value Tool",
  description:
    "Resolve endpoint clamping only, retaining an explicit interior-needs-interpolation flag and unused zero value rather than inventing an interior interpolant.",
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
          endpointValue: { type: "number" },
          interiorNeedsInterpolation: { type: "boolean" },
          outsideOrEndpoint: { type: "boolean" },
        },
        required: [
          "endpointValue",
          "interiorNeedsInterpolation",
          "outsideOrEndpoint",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
