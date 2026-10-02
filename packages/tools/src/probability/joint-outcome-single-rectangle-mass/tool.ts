import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  cdfUpperUpper: number;
  cdfLowerUpper: number;
  cdfUpperLower: number;
  cdfLowerLower: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cdfUpperUpper", label: "Cdf upper upper", kind: "number" },
  { id: "cdfLowerUpper", label: "Cdf lower upper", kind: "number" },
  { id: "cdfUpperLower", label: "Cdf upper lower", kind: "number" },
  { id: "cdfLowerLower", label: "Cdf lower lower", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.cdfUpperUpper, i.cdfLowerUpper, i.cdfUpperLower, i.cdfLowerLower].forEach(
    (x) => H.bounded(x, 0, 1),
  );
  H.check(
    i.cdfLowerLower <= Math.min(i.cdfLowerUpper, i.cdfUpperLower) &&
      Math.max(i.cdfLowerUpper, i.cdfUpperLower) <= i.cdfUpperUpper,
  );
  const mass =
    i.cdfUpperUpper - i.cdfLowerUpper - i.cdfUpperLower + i.cdfLowerLower;
  H.check(mass >= -1e-12 && mass <= 1 + 1e-12);
  return H.finish({ rectangleMass: mass });
};
export const example = {
  input: {
    cdfUpperUpper: 0.9,
    cdfLowerUpper: 0.3,
    cdfUpperLower: 0.4,
    cdfLowerLower: 0.1,
  },
  output: { result: { rectangleMass: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/joint-outcome-single-rectangle-mass",
  title: "Probability: Joint Outcome Single Rectangle Mass Tool",
  description:
    "Recover P(xLower<X<=xUpper,yLower<Y<=yUpper) from four explicitly established joint CDF corner values using rectangle inclusion-exclusion; no distribution fitting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { rectangleMass: { type: "number" } },
        required: ["rectangleMass"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
