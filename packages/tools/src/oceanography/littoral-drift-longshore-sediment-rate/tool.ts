import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly breakerWaveHeightM: number;
  readonly breakerGroupSpeedMPerSecond: number;
  readonly incidentAngleDegrees: number;
  readonly waterDensityKgPerM3: number;
  readonly sedimentDensityKgPerM3: number;
  readonly gravityMPerSecondSquared: number;
  readonly sedimentPorosityFraction: number;
  readonly cercTransportCoefficient: number;
}>;
export type Output = Readonly<{
  readonly signedLongshoreTransportM3PerSecond: number;
}>;
const inputFields = [
  { id: "breakerWaveHeightM", label: "Breaker wave height m", kind: "number" },
  {
    id: "breakerGroupSpeedMPerSecond",
    label: "Breaker group speed m per second",
    kind: "number",
  },
  {
    id: "incidentAngleDegrees",
    label: "Incident angle degrees",
    kind: "number",
  },
  {
    id: "waterDensityKgPerM3",
    label: "Water density kg per m3",
    kind: "number",
  },
  {
    id: "sedimentDensityKgPerM3",
    label: "Sediment density kg per m3",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "sedimentPorosityFraction",
    label: "Sediment porosity fraction",
    kind: "number",
  },
  {
    id: "cercTransportCoefficient",
    label: "Cerc transport coefficient",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.breakerGroupSpeedMPerSecond, "breakerGroupSpeedMPerSecond");
  positive(input.waterDensityKgPerM3, "waterDensityKgPerM3");
  positive(input.sedimentDensityKgPerM3, "sedimentDensityKgPerM3");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.breakerWaveHeightM, "breakerWaveHeightM");
  nonnegative(input.cercTransportCoefficient, "cercTransportCoefficient");
  fraction(input.sedimentPorosityFraction, "sedimentPorosityFraction");
  if (
    input.sedimentDensityKgPerM3 <= input.waterDensityKgPerM3 ||
    input.sedimentPorosityFraction === 1 ||
    Math.abs(input.incidentAngleDegrees) >= 90
  )
    simpleError(
      "state",
      "Dense sediment, porosity below one and shoreward incident angle required.",
    );
  const e =
      (input.waterDensityKgPerM3 *
        input.gravityMPerSecondSquared *
        input.breakerWaveHeightM ** 2) /
      8,
    a = (input.incidentAngleDegrees * Math.PI) / 180;
  return {
    signedLongshoreTransportM3PerSecond:
      (input.cercTransportCoefficient *
        e *
        input.breakerGroupSpeedMPerSecond *
        Math.sin(a) *
        Math.cos(a)) /
      ((input.sedimentDensityKgPerM3 - input.waterDensityKgPerM3) *
        input.gravityMPerSecondSquared *
        (1 - input.sedimentPorosityFraction)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  breakerWaveHeightM: 2,
  breakerGroupSpeedMPerSecond: 1,
  incidentAngleDegrees: 30,
  waterDensityKgPerM3: 1000,
  sedimentDensityKgPerM3: 2000,
  gravityMPerSecondSquared: 10,
  sedimentPorosityFraction: 0.5,
  cercTransportCoefficient: 0.4,
} satisfies Input;
export const exampleOutput = {
  signedLongshoreTransportM3PerSecond: 0.17320508075688773,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/littoral-drift-longshore-sediment-rate",
  title: "Littoral Drift Longshore Sediment Rate",
  description:
    "Screen signed CERC-form bulk sediment transport with supplied breaker state/coefficient; no sediment supply, directional convention or validated shoreline evolution is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedLongshoreTransportM3PerSecond",
      label: "Signed longshore transport m3 per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      breakerWaveHeightM: value.breakerWaveHeightM as number,
      breakerGroupSpeedMPerSecond: value.breakerGroupSpeedMPerSecond as number,
      incidentAngleDegrees: value.incidentAngleDegrees as number,
      waterDensityKgPerM3: value.waterDensityKgPerM3 as number,
      sedimentDensityKgPerM3: value.sedimentDensityKgPerM3 as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      sedimentPorosityFraction: value.sedimentPorosityFraction as number,
      cercTransportCoefficient: value.cercTransportCoefficient as number,
    }),
});
export const run = tool.execute;
export default tool;
