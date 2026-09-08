import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly callerBrineDensityKgPerCubicMeter: number;
  readonly callerLocalGravityMetersPerSecondSquared: number;
  readonly observedSlopeDegrees: number;
  readonly callerFilmThicknessMeters: number;
  readonly callerBrineDynamicViscosityPascalSeconds: number;
  readonly independentlyInferredFrontSpeedMetersPerSecond: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerBrineDensityKgPerCubicMeter",
    label: "Caller brine density kg per cubic meter",
    kind: "number",
  },
  {
    id: "callerLocalGravityMetersPerSecondSquared",
    label: "Caller local gravity meters per second squared",
    kind: "number",
  },
  {
    id: "observedSlopeDegrees",
    label: "Observed slope degrees",
    kind: "number",
  },
  {
    id: "callerFilmThicknessMeters",
    label: "Caller film thickness meters",
    kind: "number",
  },
  {
    id: "callerBrineDynamicViscosityPascalSeconds",
    label: "Caller brine dynamic viscosity pascal seconds",
    kind: "number",
  },
  {
    id: "independentlyInferredFrontSpeedMetersPerSecond",
    label: "Independently inferred front speed meters per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  [
    input.callerBrineDensityKgPerCubicMeter,
    input.callerLocalGravityMetersPerSecondSquared,
    input.callerFilmThicknessMeters,
    input.callerBrineDynamicViscosityPascalSeconds,
  ].forEach((v) => positive(v, "model"));
  if (input.observedSlopeDegrees < 0 || input.observedSlopeDegrees > 90)
    simpleError("slope", "0–90 degree ideal slope.");
  nonnegative(input.independentlyInferredFrontSpeedMetersPerSecond, "speed");
  const v =
    (input.callerBrineDensityKgPerCubicMeter *
      input.callerLocalGravityMetersPerSecondSquared *
      Math.sin((input.observedSlopeDegrees * Math.PI) / 180) *
      input.callerFilmThicknessMeters ** 2) /
    (3 * input.callerBrineDynamicViscosityPascalSeconds);
  return {
    conditionalLaminarMeanSpeedMetersPerSecond: v,
    signedInferredMinusModelSpeedMetersPerSecond:
      input.independentlyInferredFrontSpeedMetersPerSecond - v,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerBrineDensityKgPerCubicMeter: 1000,
    callerLocalGravityMetersPerSecondSquared: 3.7,
    observedSlopeDegrees: 30,
    callerFilmThicknessMeters: 0.001,
    callerBrineDynamicViscosityPascalSeconds: 0.001,
    independentlyInferredFrontSpeedMetersPerSecond: 0.5,
  },
  output: {
    result: {
      conditionalLaminarMeanSpeedMetersPerSecond: 0.6166666666666666,
      signedInferredMinusModelSpeedMetersPerSecond: -0.11666666666666659,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/rsl-brine-viscosity-consistency-check",
  title: "Recurring Slope Lineae Brine Flow Viscosity Consistency Check",
  description:
    "Ideal steady Newtonian laminar film mean v=\u03c1gsin\u03b8h\u00b2/(3\u03bc), compared with independent inferred RSLfront speed. No proof RSLis brine, actual flow validity, porous/granular effects or life inference.",
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
