import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  sequence,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedSwimExitSeconds: number;
  readonly observedBikeStartSeconds: number;
  readonly observedBikeFinishSeconds: number;
  readonly observedRunStartSeconds: number;
  readonly callerCombinedTransitionTargetSeconds: number;
}>;
export type Output = Readonly<{
  readonly observedT1Seconds: number;
  readonly observedT2Seconds: number;
  readonly combinedObservedTransitionSeconds: number;
  readonly signedTransitionTimeAboveCallerTargetSeconds: number;
}>;
const inputFields = [
  {
    id: "observedSwimExitSeconds",
    label: "Observed swim exit seconds",
    kind: "number",
  },
  {
    id: "observedBikeStartSeconds",
    label: "Observed bike start seconds",
    kind: "number",
  },
  {
    id: "observedBikeFinishSeconds",
    label: "Observed bike finish seconds",
    kind: "number",
  },
  {
    id: "observedRunStartSeconds",
    label: "Observed run start seconds",
    kind: "number",
  },
  {
    id: "callerCombinedTransitionTargetSeconds",
    label: "Caller combined transition target seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const times = [
    input.observedSwimExitSeconds,
    input.observedBikeStartSeconds,
    input.observedBikeFinishSeconds,
    input.observedRunStartSeconds,
  ];
  sequence(times, "raceChronology");
  nonnegative(input.callerCombinedTransitionTargetSeconds, "target");
  const t1 = times[1] - times[0],
    t2 = times[3] - times[2];
  return {
    observedT1Seconds: t1,
    observedT2Seconds: t2,
    combinedObservedTransitionSeconds: t1 + t2,
    signedTransitionTimeAboveCallerTargetSeconds:
      t1 + t2 - input.callerCombinedTransitionTargetSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSwimExitSeconds: 100,
  observedBikeStartSeconds: 160,
  observedBikeFinishSeconds: 500,
  observedRunStartSeconds: 550,
  callerCombinedTransitionTargetSeconds: 100,
} satisfies Input;
export const exampleOutput = {
  observedT1Seconds: 60,
  observedT2Seconds: 50,
  combinedObservedTransitionSeconds: 110,
  signedTransitionTimeAboveCallerTargetSeconds: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/triathlon-transition-t1t2-time-tracker",
  title: "Triathlon T1/T2 Transition Tracker",
  description:
    "Audit actual monotone triathlon swim-exit/bike-start/bike-finish/run-start timestamps and signed caller transition budget; no timing-chip offsets or assumed simultaneous-leg starts.",
  inputs: inputFields,
  outputs: [
    { id: "observedT1Seconds", label: "Observed t1 seconds", kind: "number" },
    { id: "observedT2Seconds", label: "Observed t2 seconds", kind: "number" },
    {
      id: "combinedObservedTransitionSeconds",
      label: "Combined observed transition seconds",
      kind: "number",
    },
    {
      id: "signedTransitionTimeAboveCallerTargetSeconds",
      label: "Signed transition time above caller target seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSwimExitSeconds: value.observedSwimExitSeconds as number,
      observedBikeStartSeconds: value.observedBikeStartSeconds as number,
      observedBikeFinishSeconds: value.observedBikeFinishSeconds as number,
      observedRunStartSeconds: value.observedRunStartSeconds as number,
      callerCombinedTransitionTargetSeconds:
        value.callerCombinedTransitionTargetSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
