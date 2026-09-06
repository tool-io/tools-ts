import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, ordered } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly observedMassGrams: number;
  readonly independentlyMeasuredVolumeCubicCentimeters: number;
  readonly callerMatchedDensityLower: number;
  readonly callerMatchedDensityUpper: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedMassGrams", label: "Observed mass grams", kind: "number" },
  {
    id: "independentlyMeasuredVolumeCubicCentimeters",
    label: "Independently measured volume cubic centimeters",
    kind: "number",
  },
  {
    id: "callerMatchedDensityLower",
    label: "Caller matched density lower",
    kind: "number",
  },
  {
    id: "callerMatchedDensityUpper",
    label: "Caller matched density upper",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedMassGrams, "mass");
  positive(input.independentlyMeasuredVolumeCubicCentimeters, "volume");
  positive(input.callerMatchedDensityLower, "lower");
  ordered(input.callerMatchedDensityLower, input.callerMatchedDensityUpper);
  const rho =
    input.observedMassGrams / input.independentlyMeasuredVolumeCubicCentimeters;
  return {
    observedDensityGramsPerCubicCentimeter: rho,
    outsideCallerDensityBand:
      rho < input.callerMatchedDensityLower ||
      rho > input.callerMatchedDensityUpper,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedMassGrams: 10,
    independentlyMeasuredVolumeCubicCentimeters: 1,
    callerMatchedDensityLower: 9,
    callerMatchedDensityUpper: 11,
  },
  output: {
    result: {
      observedDensityGramsPerCubicCentimeter: 10,
      outsideCallerDensityBand: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "numismatics/counterfeit-density-flag-checker",
  title: "Counterfeit Density Flag Checker",
  description:
    "Density outside actual independently verified matched issue/material band is a review flag only, not counterfeit proof, alloy inversion or safe immersion test. Volume/mass uncertainty, plating, geometry and porosity remain.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
