import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedMirrorBallRpm: number;
  readonly measuredReflectedSweepDiameterM: number;
  readonly callerObservationSeconds: number;
}>;
export type Output = Readonly<{
  readonly modeledBallRotationsInObservation: number;
  readonly modeledPerimeterSweepM: number;
  readonly modeledTangentialSweepSpeedMSecond: number;
}>;
const inputFields = [
  {
    id: "observedMirrorBallRpm",
    label: "Observed mirror ball rpm",
    kind: "number",
  },
  {
    id: "measuredReflectedSweepDiameterM",
    label: "Measured reflected sweep diameter m",
    kind: "number",
  },
  {
    id: "callerObservationSeconds",
    label: "Caller observation seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.measuredReflectedSweepDiameterM,
    "measuredReflectedSweepDiameterM",
  );
  nonnegative(input.observedMirrorBallRpm, "observedMirrorBallRpm");
  nonnegative(input.callerObservationSeconds, "callerObservationSeconds");
  const rotations =
      (input.observedMirrorBallRpm * input.callerObservationSeconds) / 60,
    speed =
      (Math.PI *
        input.measuredReflectedSweepDiameterM *
        input.observedMirrorBallRpm) /
      60;
  return {
    modeledBallRotationsInObservation: rotations,
    modeledPerimeterSweepM:
      Math.PI * input.measuredReflectedSweepDiameterM * rotations,
    modeledTangentialSweepSpeedMSecond: speed,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMirrorBallRpm: 2,
  measuredReflectedSweepDiameterM: 4,
  callerObservationSeconds: 30,
} satisfies Input;
export const exampleOutput = {
  modeledBallRotationsInObservation: 1,
  modeledPerimeterSweepM: 12.566370614359172,
  modeledTangentialSweepSpeedMSecond: 0.41887902047863906,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/mirror-ball-motor-rpm-spread-diameter-lookup",
  title: "Mirror Ball Motor RPM Spread Diameter Lookup",
  description:
    "Describe measured ideal one-to-one reflected sweep and ball rotation; actual reflection geometry/facet doubling/beam paths are caller model, not motor rating, rigging or strobe exposure assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledBallRotationsInObservation",
      label: "Modeled ball rotations in observation",
      kind: "number",
    },
    {
      id: "modeledPerimeterSweepM",
      label: "Modeled perimeter sweep m",
      kind: "number",
    },
    {
      id: "modeledTangentialSweepSpeedMSecond",
      label: "Modeled tangential sweep speed m second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMirrorBallRpm: value.observedMirrorBallRpm as number,
      measuredReflectedSweepDiameterM:
        value.measuredReflectedSweepDiameterM as number,
      callerObservationSeconds: value.callerObservationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
