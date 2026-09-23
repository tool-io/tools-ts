import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ jacobian: readonly (readonly number[])[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "jacobian", label: "Jacobian", kind: "matrix" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.jacobian.length === 2 && i.jacobian.every((r) => r.length === 2));
  const det =
    i.jacobian[0][0] * i.jacobian[1][1] - i.jacobian[0][1] * i.jacobian[1][0];
  return H.finish({
    signedLocalAreaFactor: det,
    absoluteLocalAreaFactor: Math.abs(det),
  });
};
export const example = {
  input: {
    jacobian: [
      [2, 1],
      [0, 3],
    ],
  },
  output: { result: { signedLocalAreaFactor: 6, absoluteLocalAreaFactor: 6 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/differential-area-local-scale",
  title: "Calculus: Differential Area Local Scale Tool",
  description:
    "Return oriented and absolute local area multipliers from a supplied 2x2 differential Jacobian, not a global area transform.",
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
          absoluteLocalAreaFactor: { type: "number" },
          signedLocalAreaFactor: { type: "number" },
        },
        required: ["absoluteLocalAreaFactor", "signedLocalAreaFactor"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
