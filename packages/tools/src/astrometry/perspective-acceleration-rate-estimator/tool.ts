import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly properMotionMasPerYear: number;
  readonly radialVelocityKmPerSecond: number;
  readonly distanceParsecs: number;
}>;
export type Output = Readonly<{
  readonly signedPerspectiveAccelerationMasPerYearSquared: number;
}>;
const inputFields = [
  {
    id: "properMotionMasPerYear",
    label: "Proper motion mas per year",
    kind: "number",
  },
  {
    id: "radialVelocityKmPerSecond",
    label: "Radial velocity km per second",
    kind: "number",
  },
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distanceParsecs, "distanceParsecs");
  nonnegative(input.properMotionMasPerYear, "properMotionMasPerYear");
  return {
    signedPerspectiveAccelerationMasPerYearSquared:
      (-2 *
        input.properMotionMasPerYear *
        input.radialVelocityKmPerSecond *
        (365.25 * 86400)) /
      (input.distanceParsecs * 3.0856775814913673e13),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  properMotionMasPerYear: 1000,
  radialVelocityKmPerSecond: 10,
  distanceParsecs: 1,
} satisfies Input;
export const exampleOutput = {
  signedPerspectiveAccelerationMasPerYearSquared: -0.0204542433009139,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/perspective-acceleration-rate-estimator",
  title: "Perspective Acceleration Effect Radial Rate Estimator",
  description:
    "Instantaneous rectilinear perspective μdot=−2μvr/d, positive radial receding; gravity/actual orbital acceleration excluded. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedPerspectiveAccelerationMasPerYearSquared",
      label: "Signed perspective acceleration mas per year squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      properMotionMasPerYear: value.properMotionMasPerYear as number,
      radialVelocityKmPerSecond: value.radialVelocityKmPerSecond as number,
      distanceParsecs: value.distanceParsecs as number,
    }),
});
export const run = tool.execute;
export default tool;
