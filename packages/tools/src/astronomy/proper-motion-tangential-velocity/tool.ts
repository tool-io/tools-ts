import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly properMotionArcsecPerJulianYear: number;
  readonly distanceParsecs: number;
}>;
export type Output = Readonly<{
  readonly tangentialVelocityKmPerSecond: number;
}>;
const inputFields = [
  {
    id: "properMotionArcsecPerJulianYear",
    label: "Proper motion arcsec per julian year",
    kind: "number",
  },
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.distanceParsecs, "distanceParsecs");
  nonnegative(
    input.properMotionArcsecPerJulianYear,
    "properMotionArcsecPerJulianYear",
  );
  return {
    tangentialVelocityKmPerSecond:
      4.740470463533486 *
      input.properMotionArcsecPerJulianYear *
      input.distanceParsecs,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  properMotionArcsecPerJulianYear: 1,
  distanceParsecs: 10,
} satisfies Input;
export const exampleOutput = {
  tangentialVelocityKmPerSecond: 47.40470463533486,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/proper-motion-tangential-velocity",
  title: "Proper Motion Tangential Velocity Calculator",
  description:
    "Total tangent-plane proper-motion speed with AU/Julian-year coefficient; no radial component. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "tangentialVelocityKmPerSecond",
      label: "Tangential velocity km per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      properMotionArcsecPerJulianYear:
        value.properMotionArcsecPerJulianYear as number,
      distanceParsecs: value.distanceParsecs as number,
    }),
});
export const run = tool.execute;
export default tool;
