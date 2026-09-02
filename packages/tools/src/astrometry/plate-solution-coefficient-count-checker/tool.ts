import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMatchedReferenceStarCount: number;
  readonly observedAffineCoefficientCount: number;
}>;
export type Output = Readonly<{
  readonly affineCoefficientCountMatches: boolean;
  readonly nominalScalarFitDegreesOfFreedom: number;
}>;
const inputFields = [
  {
    id: "observedMatchedReferenceStarCount",
    label: "Observed matched reference star count",
    kind: "number",
  },
  {
    id: "observedAffineCoefficientCount",
    label: "Observed affine coefficient count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedMatchedReferenceStarCount, "stars", 0, 10000);
  bounded(input.observedAffineCoefficientCount, "coefficients", 0, 10000);
  return {
    affineCoefficientCountMatches: input.observedAffineCoefficientCount === 6,
    nominalScalarFitDegreesOfFreedom:
      2 * input.observedMatchedReferenceStarCount - 6,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatchedReferenceStarCount: 3,
  observedAffineCoefficientCount: 6,
} satisfies Input;
export const exampleOutput = {
  affineCoefficientCountMatches: true,
  nominalScalarFitDegreesOfFreedom: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/plate-solution-coefficient-count-checker",
  title:
    "Systematic Pattern Residual First-Order Plate Solution Coefficient Count Checker",
  description:
    "First-order affine 2 coordinate plate solution has 6 coefficients and 2 N−6 nominal scalar DOF; sufficient count does not establish design rank or conditioning. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "affineCoefficientCountMatches",
      label: "Affine coefficient count matches",
      kind: "boolean",
    },
    {
      id: "nominalScalarFitDegreesOfFreedom",
      label: "Nominal scalar fit degrees of freedom",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatchedReferenceStarCount:
        value.observedMatchedReferenceStarCount as number,
      observedAffineCoefficientCount:
        value.observedAffineCoefficientCount as number,
    }),
});
export const run = tool.execute;
export default tool;
