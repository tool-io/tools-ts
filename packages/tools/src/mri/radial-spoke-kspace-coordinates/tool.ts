import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly spokeAnglesDegrees: readonly number[];
  readonly radialSamplesCyclesPerMeter: readonly number[];
}>;
export type Output = Readonly<{
  readonly xCoordinates: readonly (readonly number[])[];
  readonly yCoordinates: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "spokeAnglesDegrees",
    label: "Spoke angles degrees",
    kind: "numberList",
    unit: "°",
  },
  {
    id: "radialSamplesCyclesPerMeter",
    label: "Radial samples cycles per meter",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.spokeAnglesDegrees.length ||
    input.spokeAnglesDegrees.length > 128 ||
    input.radialSamplesCyclesPerMeter.length > 128
  )
    simpleError(
      "spokeAnglesDegrees",
      "Between 1 and 128 spokes and at most 128 radial samples required.",
    );
  ordered(input.radialSamplesCyclesPerMeter, "radialSamplesCyclesPerMeter");
  return {
    xCoordinates: input.spokeAnglesDegrees.map((a) =>
      input.radialSamplesCyclesPerMeter.map(
        (r) => r * Math.cos((a * Math.PI) / 180),
      ),
    ),
    yCoordinates: input.spokeAnglesDegrees.map((a) =>
      input.radialSamplesCyclesPerMeter.map(
        (r) => r * Math.sin((a * Math.PI) / 180),
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  spokeAnglesDegrees: [0, 90],
  radialSamplesCyclesPerMeter: [-1, 0, 1],
} satisfies Input;
export const exampleOutput = {
  xCoordinates: [
    [-1, 0, 1],
    [0, 0, 0],
  ],
  yCoordinates: [
    [0, 0, 0],
    [-1, 0, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/radial-spoke-kspace-coordinates",
  title: "Radial K-Space Trajectory",
  description:
    "Generate explicit radial k-space spoke coordinates from supplied angles and signed radial sample locations; no trajectory density compensation is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "xCoordinates", label: "X coordinates", kind: "matrix" },
    { id: "yCoordinates", label: "Y coordinates", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      spokeAnglesDegrees: value.spokeAnglesDegrees as readonly number[],
      radialSamplesCyclesPerMeter:
        value.radialSamplesCyclesPerMeter as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
