import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  interpolate,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observationTimesUs: readonly number[];
  readonly anodeCurrentsA: readonly number[];
  readonly gatePulseEndUs: number;
  readonly callerLatchingCurrentA: number;
  readonly callerGatePulseRatingSatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly observedAnodeCurrentAtGateRemovalA: number;
  readonly signedLatchingCurrentMarginA: number;
  readonly idealLatchingCurrentConditionSatisfied: boolean;
}>;
const inputFields = [
  {
    id: "observationTimesUs",
    label: "Observation times us",
    kind: "numberList",
  },
  { id: "anodeCurrentsA", label: "Anode currents a", kind: "numberList" },
  { id: "gatePulseEndUs", label: "Gate pulse end us", kind: "number" },
  {
    id: "callerLatchingCurrentA",
    label: "Caller latching current a",
    kind: "number",
  },
  {
    id: "callerGatePulseRatingSatisfied",
    label: "Caller gate pulse rating satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerLatchingCurrentA, "callerLatchingCurrentA");
  input.observationTimesUs.forEach((v) => nonnegative(v, "observationTimesUs"));
  input.anodeCurrentsA.forEach((v) => nonnegative(v, "anodeCurrentsA"));
  nonnegative(input.gatePulseEndUs, "gatePulseEndUs");
  aligned(input.observationTimesUs, input.anodeCurrentsA, "observationTimesUs");
  const current = interpolate(
    input.observationTimesUs,
    input.anodeCurrentsA,
    input.gatePulseEndUs,
  );
  return {
    observedAnodeCurrentAtGateRemovalA: current,
    signedLatchingCurrentMarginA: current - input.callerLatchingCurrentA,
    idealLatchingCurrentConditionSatisfied:
      input.callerGatePulseRatingSatisfied &&
      current >= input.callerLatchingCurrentA,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationTimesUs: [0, 10, 20],
  anodeCurrentsA: [0, 0.2, 0.3],
  gatePulseEndUs: 10,
  callerLatchingCurrentA: 0.15,
  callerGatePulseRatingSatisfied: true,
} satisfies Input;
export const exampleOutput = {
  observedAnodeCurrentAtGateRemovalA: 0.2,
  signedLatchingCurrentMarginA: 0.05,
  idealLatchingCurrentConditionSatisfied: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/thyristor-latching-current",
  title: "Thyristor Latching Current Calculator",
  description:
    "Audit actual anode current at gate-pulse end against supplied latching current and independent gate-rating evidence; differs from post-trigger holding waveform and does not verify reliable device latching or safe drive.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAnodeCurrentAtGateRemovalA",
      label: "Observed anode current at gate removal a",
      kind: "number",
    },
    {
      id: "signedLatchingCurrentMarginA",
      label: "Signed latching current margin a",
      kind: "number",
    },
    {
      id: "idealLatchingCurrentConditionSatisfied",
      label: "Ideal latching current condition satisfied",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observationTimesUs: value.observationTimesUs as readonly number[],
      anodeCurrentsA: value.anodeCurrentsA as readonly number[],
      gatePulseEndUs: value.gatePulseEndUs as number,
      callerLatchingCurrentA: value.callerLatchingCurrentA as number,
      callerGatePulseRatingSatisfied:
        value.callerGatePulseRatingSatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;
