import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
  finite,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedRollTimesSeconds: readonly number[];
  readonly callerMatchedGroundAccelerationMSecond2: readonly number[];
  readonly initialGroundSpeedMSecond: number;
  readonly callerIndependentTransitionDistanceM: number;
}>;
export type Output = Readonly<{
  readonly piecewiseAccelerationRollM: number;
  readonly totalTakeoffDistanceScenarioM: number;
}>;
const inputFields = [
  {
    id: "observedRollTimesSeconds",
    label: "Observed roll times seconds",
    kind: "numberList",
  },
  {
    id: "callerMatchedGroundAccelerationMSecond2",
    label: "Caller matched ground acceleration m second2",
    kind: "numberList",
  },
  {
    id: "initialGroundSpeedMSecond",
    label: "Initial ground speed m second",
    kind: "number",
  },
  {
    id: "callerIndependentTransitionDistanceM",
    label: "Caller independent transition distance m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRollTimesSeconds.forEach((v) =>
    nonnegative(v, "observedRollTimesSeconds"),
  );
  nonnegative(
    input.callerIndependentTransitionDistanceM,
    "callerIndependentTransitionDistanceM",
  );
  aligned(
    input.observedRollTimesSeconds,
    input.callerMatchedGroundAccelerationMSecond2,
    "roll",
  );
  strictlyIncreasing(input.observedRollTimesSeconds, "time");
  let speed = input.initialGroundSpeedMSecond,
    distance = 0;
  nonnegative(speed, "initial speed");
  for (let i = 1; i < input.observedRollTimesSeconds.length; i++) {
    const dt =
        input.observedRollTimesSeconds[i] -
        input.observedRollTimesSeconds[i - 1],
      a = input.callerMatchedGroundAccelerationMSecond2[i - 1],
      b = input.callerMatchedGroundAccelerationMSecond2[i];
    if (a < 0 && b > 0) {
      const tau = (dt * -a) / (b - a);
      nonnegative(
        finite(speed + a * tau + ((b - a) * tau * tau) / (2 * dt)),
        "interior minimum ground speed",
      );
    }
    distance = finite(distance + speed * dt + dt * dt * (a / 3 + b / 6));
    speed = finite(speed + dt * (a / 2 + b / 2));
    nonnegative(speed, "speed branch");
  }
  return {
    piecewiseAccelerationRollM: distance,
    totalTakeoffDistanceScenarioM:
      distance + input.callerIndependentTransitionDistanceM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRollTimesSeconds: [0, 1, 3],
  callerMatchedGroundAccelerationMSecond2: [2, 2, 2],
  initialGroundSpeedMSecond: 0,
  callerIndependentTransitionDistanceM: 5,
} satisfies Input;
export const exampleOutput = {
  piecewiseAccelerationRollM: 9,
  totalTakeoffDistanceScenarioM: 14,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/aircraft-takeoff-distance",
  title: "Aircraft Takeoff Distance Calculator",
  description:
    "Integrate independently supplied piecewise-linear actual takeoff ground acceleration plus transition distance, not generic v²/2a or certified runway requirement. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "piecewiseAccelerationRollM",
      label: "Piecewise acceleration roll m",
      kind: "number",
    },
    {
      id: "totalTakeoffDistanceScenarioM",
      label: "Total takeoff distance scenario m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRollTimesSeconds:
        value.observedRollTimesSeconds as readonly number[],
      callerMatchedGroundAccelerationMSecond2:
        value.callerMatchedGroundAccelerationMSecond2 as readonly number[],
      initialGroundSpeedMSecond: value.initialGroundSpeedMSecond as number,
      callerIndependentTransitionDistanceM:
        value.callerIndependentTransitionDistanceM as number,
    }),
});
export const run = tool.execute;
export default tool;
