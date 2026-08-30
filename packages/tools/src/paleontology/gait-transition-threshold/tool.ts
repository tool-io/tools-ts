import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly hipHeightScenarioBoundsM: readonly number[];
  readonly callerTransitionFroudeBounds: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly observedTrackSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly gaitTransitionSpeedScenarioBoundsMPerSecond: readonly number[];
  readonly trackSpeedPositionCode: number;
}>;
const inputFields = [
  {
    id: "hipHeightScenarioBoundsM",
    label: "Hip height scenario bounds m",
    kind: "numberList",
  },
  {
    id: "callerTransitionFroudeBounds",
    label: "Caller transition froude bounds",
    kind: "numberList",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "observedTrackSpeedMPerSecond",
    label: "Observed track speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.hipHeightScenarioBoundsM.forEach((v) =>
    positive(v, "hipHeightScenarioBoundsM"),
  );
  input.callerTransitionFroudeBounds.forEach((v) =>
    positive(v, "callerTransitionFroudeBounds"),
  );
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  nonnegative(
    input.observedTrackSpeedMPerSecond,
    "observedTrackSpeedMPerSecond",
  );
  if (
    input.hipHeightScenarioBoundsM.length !== 2 ||
    input.callerTransitionFroudeBounds.length !== 2 ||
    input.hipHeightScenarioBoundsM[0] > input.hipHeightScenarioBoundsM[1] ||
    input.callerTransitionFroudeBounds[0] >
      input.callerTransitionFroudeBounds[1]
  )
    simpleError(
      "bounds",
      "Two ordered positive hip and transition-Froude scenario bounds required.",
    );
  const lo = Math.sqrt(
      input.gravityMPerSecondSquared *
        input.hipHeightScenarioBoundsM[0] *
        input.callerTransitionFroudeBounds[0],
    ),
    hi = Math.sqrt(
      input.gravityMPerSecondSquared *
        input.hipHeightScenarioBoundsM[1] *
        input.callerTransitionFroudeBounds[1],
    );
  return {
    gaitTransitionSpeedScenarioBoundsMPerSecond: [lo, hi],
    trackSpeedPositionCode:
      input.observedTrackSpeedMPerSecond < lo
        ? 0
        : input.observedTrackSpeedMPerSecond > hi
          ? 2
          : 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  hipHeightScenarioBoundsM: [1, 4],
  callerTransitionFroudeBounds: [0.25, 1],
  gravityMPerSecondSquared: 1,
  observedTrackSpeedMPerSecond: 0.75,
} satisfies Input;
export const exampleOutput = {
  gaitTransitionSpeedScenarioBoundsMPerSecond: [0.5, 2],
  trackSpeedPositionCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/gait-transition-threshold",
  title: "Trackway Gait Transition Speed Threshold",
  description:
    "Propagate caller hip-height and transition-Froude bounds into threshold-speed scenarios and compare a supplied track speed; not the existing simple Froude calculation or a universal walking/running determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "gaitTransitionSpeedScenarioBoundsMPerSecond",
      label: "Gait transition speed scenario bounds m per second",
      kind: "numberList",
    },
    {
      id: "trackSpeedPositionCode",
      label: "Track speed position code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      hipHeightScenarioBoundsM:
        value.hipHeightScenarioBoundsM as readonly number[],
      callerTransitionFroudeBounds:
        value.callerTransitionFroudeBounds as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      observedTrackSpeedMPerSecond:
        value.observedTrackSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
