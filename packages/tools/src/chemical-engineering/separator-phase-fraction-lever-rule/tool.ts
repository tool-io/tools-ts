import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  overallFraction: number;
  liquidFraction: number;
  vaporFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "overallFraction", label: "Overall fraction", kind: "number" },
  { id: "liquidFraction", label: "Liquid fraction", kind: "number" },
  { id: "vaporFraction", label: "Vapor fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.overallFraction, i.liquidFraction, i.vaporFraction].forEach((x) =>
    H.bounded(x, 0, 1),
  );
  H.check(
    i.liquidFraction !== i.vaporFraction &&
      i.overallFraction >= Math.min(i.liquidFraction, i.vaporFraction) &&
      i.overallFraction <= Math.max(i.liquidFraction, i.vaporFraction),
  );
  return H.finish({
    vaporPhaseFraction:
      (i.overallFraction - i.liquidFraction) /
      (i.vaporFraction - i.liquidFraction),
  });
};
export const example = {
  input: { overallFraction: 0.4, liquidFraction: 0.2, vaporFraction: 0.8 },
  output: { result: { vaporPhaseFraction: 0.3333333333333333 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "chemical-engineering/separator-phase-fraction-lever-rule",
  title: "Chemical Engineering: Separator Phase Fraction Lever Rule Tool",
  description:
    "Apply the binary two-phase lever rule to explicitly established equilibrium endpoint compositions, rejecting coincident endpoints and out-of-bracket totals; not a phase-equilibrium solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { vaporPhaseFraction: { type: "number" } },
        required: ["vaporPhaseFraction"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
