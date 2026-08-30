import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly coldLayerTemperatureK: number;
  readonly ambientReferenceTemperatureK: number;
  readonly downslopeTravelDistanceM: number;
  readonly slopeAngleDegrees: number;
  readonly gravityMPerSecondSquared: number;
  readonly initialDownslopeSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly idealKatabaticAccelerationMPerSecond2: number;
  readonly idealKatabaticEndpointSpeedMPerSecond: number;
}>;
const inputFields = [
  {
    id: "coldLayerTemperatureK",
    label: "Cold layer temperature k",
    kind: "number",
  },
  {
    id: "ambientReferenceTemperatureK",
    label: "Ambient reference temperature k",
    kind: "number",
  },
  {
    id: "downslopeTravelDistanceM",
    label: "Downslope travel distance m",
    kind: "number",
  },
  { id: "slopeAngleDegrees", label: "Slope angle degrees", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "initialDownslopeSpeedMPerSecond",
    label: "Initial downslope speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coldLayerTemperatureK, "coldLayerTemperatureK");
  positive(input.ambientReferenceTemperatureK, "ambientReferenceTemperatureK");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(input.downslopeTravelDistanceM, "downslopeTravelDistanceM");
  nonnegative(
    input.initialDownslopeSpeedMPerSecond,
    "initialDownslopeSpeedMPerSecond",
  );
  nonnegative(input.slopeAngleDegrees, "slopeAngleDegrees");
  if (
    input.coldLayerTemperatureK > input.ambientReferenceTemperatureK ||
    input.slopeAngleDegrees > 90
  )
    simpleError(
      "layer",
      "Colder/equal layer and physical downslope angle required.",
    );
  const idealKatabaticAccelerationMPerSecond2 =
    ((input.gravityMPerSecondSquared *
      (input.ambientReferenceTemperatureK - input.coldLayerTemperatureK)) /
      input.ambientReferenceTemperatureK) *
    Math.sin((input.slopeAngleDegrees * Math.PI) / 180);
  return {
    idealKatabaticAccelerationMPerSecond2,
    idealKatabaticEndpointSpeedMPerSecond: Math.sqrt(
      input.initialDownslopeSpeedMPerSecond ** 2 +
        2 *
          idealKatabaticAccelerationMPerSecond2 *
          input.downslopeTravelDistanceM,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coldLayerTemperatureK: 280,
  ambientReferenceTemperatureK: 300,
  downslopeTravelDistanceM: 1000,
  slopeAngleDegrees: 30,
  gravityMPerSecondSquared: 10,
  initialDownslopeSpeedMPerSecond: 0,
} satisfies Input;
export const exampleOutput = {
  idealKatabaticAccelerationMPerSecond2: 0.3333333333333333,
  idealKatabaticEndpointSpeedMPerSecond: 25.81988897471611,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/bora-katabatic-drainage-speed",
  title: "Bora Katabatic Drainage Speed",
  description:
    "Evaluate inviscid uniform katabatic parcel acceleration over supplied slope distance/density proxy; no friction, entrainment, sustained Bora wind prediction or safety assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "idealKatabaticAccelerationMPerSecond2",
      label: "Ideal katabatic acceleration m per second2",
      kind: "number",
    },
    {
      id: "idealKatabaticEndpointSpeedMPerSecond",
      label: "Ideal katabatic endpoint speed m per second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coldLayerTemperatureK: value.coldLayerTemperatureK as number,
      ambientReferenceTemperatureK:
        value.ambientReferenceTemperatureK as number,
      downslopeTravelDistanceM: value.downslopeTravelDistanceM as number,
      slopeAngleDegrees: value.slopeAngleDegrees as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      initialDownslopeSpeedMPerSecond:
        value.initialDownslopeSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
