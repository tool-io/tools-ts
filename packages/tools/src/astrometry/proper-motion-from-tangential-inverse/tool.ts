import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly tangentialVelocityKmPerSecond: number;
  readonly distanceParsecs: number;
}>;
export type Output = Readonly<{
  readonly properMotionMasPerJulianYear: number;
}>;
const inputFields = [
  {
    id: "tangentialVelocityKmPerSecond",
    label: "Tangential velocity km per second",
    kind: "number",
  },
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distanceParsecs, "distanceParsecs");
  nonnegative(
    input.tangentialVelocityKmPerSecond,
    "tangentialVelocityKmPerSecond",
  );
  return {
    properMotionMasPerJulianYear:
      (1000 * input.tangentialVelocityKmPerSecond) /
      (4.740470463533486 * input.distanceParsecs),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  tangentialVelocityKmPerSecond: 47.40470463533486,
  distanceParsecs: 10,
} satisfies Input;
export const exampleOutput = {
  properMotionMasPerJulianYear: 1000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/proper-motion-from-tangential-inverse",
  title: "Proper Motion from Tangential Velocity Inverse Converter",
  description:
    "Inverse transverse velocity/distance to total angular motion inmas/Julian year; no radial motion. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "properMotionMasPerJulianYear",
      label: "Proper motion mas per julian year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      tangentialVelocityKmPerSecond:
        value.tangentialVelocityKmPerSecond as number,
      distanceParsecs: value.distanceParsecs as number,
    }),
});
export const run = tool.execute;
export default tool;
