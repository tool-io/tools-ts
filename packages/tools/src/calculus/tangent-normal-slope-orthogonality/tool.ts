import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  tangentSlope: number;
  normalSlope: number;
  tolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tangentSlope", label: "Tangent slope", kind: "number" },
  { id: "normalSlope", label: "Normal slope", kind: "number" },
  { id: "tolerance", label: "Tolerance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.tolerance >= 0);
  const r = i.tangentSlope * i.normalSlope + 1;
  return H.finish({
    orthogonalityResidual: r,
    consistent: Math.abs(r) <= i.tolerance,
  });
};
export const example = {
  input: { tangentSlope: 2, normalSlope: -0.5, tolerance: 1e-9 },
  output: { result: { orthogonalityResidual: 0, consistent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/tangent-normal-slope-orthogonality",
  title: "Calculus: Tangent Normal Slope Orthogonality Tool",
  description:
    "Check the finite-slope tangent/normal orthogonality relation m*n=-1 with explicit absolute residual tolerance; vertical/horizontal cases require vector representation.",
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
          consistent: { type: "boolean" },
          orthogonalityResidual: { type: "number" },
        },
        required: ["consistent", "orthogonalityResidual"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
