import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedIntersectionApproachSpeedsMSecond: readonly number[];
  readonly callerVerifiedGapAcceptanceSeconds: readonly number[];
  readonly observedAvailableSightDistancesM: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerGapSightDemandsM: readonly number[];
  readonly signedObservedSightMarginsM: readonly number[];
}>;
const inputFields = [
  {
    id: "observedIntersectionApproachSpeedsMSecond",
    label: "Observed intersection approach speeds m second",
    kind: "numberList",
  },
  {
    id: "callerVerifiedGapAcceptanceSeconds",
    label: "Caller verified gap acceptance seconds",
    kind: "numberList",
  },
  {
    id: "observedAvailableSightDistancesM",
    label: "Observed available sight distances m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerVerifiedGapAcceptanceSeconds.forEach((v) =>
    positive(v, "callerVerifiedGapAcceptanceSeconds"),
  );
  input.observedIntersectionApproachSpeedsMSecond.forEach((v) =>
    nonnegative(v, "observedIntersectionApproachSpeedsMSecond"),
  );
  input.observedAvailableSightDistancesM.forEach((v) =>
    nonnegative(v, "observedAvailableSightDistancesM"),
  );
  aligned(
    input.observedIntersectionApproachSpeedsMSecond,
    input.callerVerifiedGapAcceptanceSeconds,
    "observedIntersectionApproachSpeedsMSecond",
  );
  aligned(
    input.observedIntersectionApproachSpeedsMSecond,
    input.observedAvailableSightDistancesM,
    "observedIntersectionApproachSpeedsMSecond",
  );
  const demand = input.observedIntersectionApproachSpeedsMSecond.map(
    (v, i) => v * input.callerVerifiedGapAcceptanceSeconds[i],
  );
  return {
    callerGapSightDemandsM: demand,
    signedObservedSightMarginsM: demand.map(
      (v, i) => input.observedAvailableSightDistancesM[i] - v,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntersectionApproachSpeedsMSecond: [10, 20],
  callerVerifiedGapAcceptanceSeconds: [5, 6],
  observedAvailableSightDistancesM: [60, 100],
} satisfies Input;
export const exampleOutput = {
  callerGapSightDemandsM: [50, 120],
  signedObservedSightMarginsM: [10, -20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/intersection-sight-distance",
  title: "Intersection Sight Distance Calculator",
  description:
    "Actual approach-speed exposure against independent maneuver gap criteria and surveyed available sight, not passing maneuver model or sight clearance. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerGapSightDemandsM",
      label: "Caller gap sight demands m",
      kind: "numberList",
    },
    {
      id: "signedObservedSightMarginsM",
      label: "Signed observed sight margins m",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntersectionApproachSpeedsMSecond:
        value.observedIntersectionApproachSpeedsMSecond as readonly number[],
      callerVerifiedGapAcceptanceSeconds:
        value.callerVerifiedGapAcceptanceSeconds as readonly number[],
      observedAvailableSightDistancesM:
        value.observedAvailableSightDistancesM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
