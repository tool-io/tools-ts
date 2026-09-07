import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedCspTestCycles: readonly number[];
  readonly failureObservedFlags: readonly number[];
  readonly callerMissionCycles: number;
}>;
export type Output = Readonly<{
  readonly observedFailuresAtOrBeforeMission: number;
  readonly knownSurvivedThroughMission: number;
  readonly rightCensoredBeforeMission: number;
}>;
const inputFields = [
  {
    id: "observedCspTestCycles",
    label: "Observed csp test cycles",
    kind: "numberList",
  },
  {
    id: "failureObservedFlags",
    label: "Failure observed flags",
    kind: "numberList",
  },
  { id: "callerMissionCycles", label: "Caller mission cycles", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCspTestCycles.forEach((v) =>
    nonnegative(v, "observedCspTestCycles"),
  );
  nonnegative(input.callerMissionCycles, "callerMissionCycles");
  binary(input.failureObservedFlags, "failureObservedFlags");
  aligned(
    input.observedCspTestCycles,
    input.failureObservedFlags,
    "observedCspTestCycles",
  );
  return {
    observedFailuresAtOrBeforeMission: input.observedCspTestCycles.filter(
      (v, i) => input.failureObservedFlags[i] && v <= input.callerMissionCycles,
    ).length,
    knownSurvivedThroughMission: input.observedCspTestCycles.filter(
      (v) => v > input.callerMissionCycles,
    ).length,
    rightCensoredBeforeMission: input.observedCspTestCycles.filter(
      (v, i) =>
        !input.failureObservedFlags[i] && v <= input.callerMissionCycles,
    ).length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCspTestCycles: [10, 20, 30],
  failureObservedFlags: [1, 0, 1],
  callerMissionCycles: 25,
} satisfies Input;
export const exampleOutput = {
  observedFailuresAtOrBeforeMission: 1,
  knownSurvivedThroughMission: 1,
  rightCensoredBeforeMission: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/csp-board-level-reliability",
  title: "Semiconductor Csp Board Level Reliability Calculator",
  description:
    "Audit actual CSP board-test observed failures and right-censoring against caller mission horizon, do not count early-censored devices as successes or estimate reliability confidence.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFailuresAtOrBeforeMission",
      label: "Observed failures at or before mission",
      kind: "number",
    },
    {
      id: "knownSurvivedThroughMission",
      label: "Known survived through mission",
      kind: "number",
    },
    {
      id: "rightCensoredBeforeMission",
      label: "Right censored before mission",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCspTestCycles: value.observedCspTestCycles as readonly number[],
      failureObservedFlags: value.failureObservedFlags as readonly number[],
      callerMissionCycles: value.callerMissionCycles as number,
    }),
});
export const run = tool.execute;
export default tool;
