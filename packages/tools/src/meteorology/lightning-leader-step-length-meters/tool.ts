import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  mean,
  norm,
  shape,
} from "../shared.js";

export type Input = Readonly<{
  readonly observationMicroseconds: readonly number[];
  readonly observedLeaderPositionsM: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly observedStepLengthsM: readonly number[];
  readonly meanObservedLeaderStepLengthM: number;
  readonly observedStepSpeedsMPerSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observationMicroseconds",
    label: "Observation microseconds",
    kind: "numberList",
  },
  {
    id: "observedLeaderPositionsM",
    label: "Observed leader positions m",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.observationMicroseconds, "times");
  if (shape(input.observedLeaderPositionsM, "positions") !== 3)
    simpleError(
      "positions",
      "Three independently measured Cartesian metre components per frame required.",
    );
  aligned(
    input.observationMicroseconds,
    input.observedLeaderPositionsM,
    "frames",
  );
  const observedStepLengthsM = input.observedLeaderPositionsM
    .slice(1)
    .map((r, i) =>
      norm(r.map((v, j) => v - input.observedLeaderPositionsM[i][j])),
    );
  return {
    observedStepLengthsM,
    meanObservedLeaderStepLengthM: mean(observedStepLengthsM),
    observedStepSpeedsMPerSecond: observedStepLengthsM.map(
      (v, i) =>
        (v * 1e6) /
        (input.observationMicroseconds[i + 1] -
          input.observationMicroseconds[i]),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationMicroseconds: [0, 10, 30],
  observedLeaderPositionsM: [
    [0, 0, 0],
    [3, 4, 0],
    [3, 4, 12],
  ],
} satisfies Input;
export const exampleOutput = {
  observedStepLengthsM: [5, 12],
  meanObservedLeaderStepLengthM: 8.5,
  observedStepSpeedsMPerSecond: [500000, 600000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/lightning-leader-step-length-meters",
  title: "Lightning Leader Step Length Meters",
  description:
    "Audit resolved observed lightning-leader steps using high-speed frame times and measured local Cartesian positions; unresolved frames may combine steps, no universal step length, geodesy or lightning-distance safety inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedStepLengthsM",
      label: "Observed step lengths m",
      kind: "numberList",
    },
    {
      id: "meanObservedLeaderStepLengthM",
      label: "Mean observed leader step length m",
      kind: "number",
    },
    {
      id: "observedStepSpeedsMPerSecond",
      label: "Observed step speeds m per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observationMicroseconds:
        value.observationMicroseconds as readonly number[],
      observedLeaderPositionsM:
        value.observedLeaderPositionsM as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
