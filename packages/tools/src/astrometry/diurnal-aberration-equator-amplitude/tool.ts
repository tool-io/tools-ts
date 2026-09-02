import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, deg } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEquatorialRotationSpeedMetersPerSecond: number;
}>;
export type Output = Readonly<{
  readonly firstOrderDiurnalAberrationArcsec: number;
}>;
const inputFields = [
  {
    id: "callerEquatorialRotationSpeedMetersPerSecond",
    label: "Caller equatorial rotation speed meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerEquatorialRotationSpeedMetersPerSecond,
    "callerEquatorialRotationSpeedMetersPerSecond",
  );
  return {
    firstOrderDiurnalAberrationArcsec:
      deg(input.callerEquatorialRotationSpeedMetersPerSecond / 299792458) *
      3600,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEquatorialRotationSpeedMetersPerSecond: 465.1,
} satisfies Input;
export const exampleOutput = {
  firstOrderDiurnalAberrationArcsec: 0.320000583155179,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/diurnal-aberration-equator-amplitude",
  title: "Diurnal Aberration Amplitude at Equator Calculator",
  description:
    "Equatorial first-order diurnal aberration v/c amplitude in arcseconds, no source projection or terrestrial coordinate/geodesy model. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstOrderDiurnalAberrationArcsec",
      label: "First order diurnal aberration arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEquatorialRotationSpeedMetersPerSecond:
        value.callerEquatorialRotationSpeedMetersPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
