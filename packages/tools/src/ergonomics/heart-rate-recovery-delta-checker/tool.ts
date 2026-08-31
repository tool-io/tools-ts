import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly preWorkHeartRateBpm: number;
  readonly endWorkHeartRateBpm: number;
  readonly measuredRecoveryHeartRatesBpm: readonly number[];
  readonly recoveryMinutesAfterEnd: readonly number[];
  readonly callerRequiredWorkPulseRecoveryFraction: number;
}>;
export type Output = Readonly<{
  readonly observedRecoveryFractions: readonly number[];
  readonly earliestObservedCallerRecoveryMinute: number;
  readonly recoveryThresholdObserved: boolean;
}>;
const inputFields = [
  {
    id: "preWorkHeartRateBpm",
    label: "Pre work heart rate bpm",
    kind: "number",
  },
  {
    id: "endWorkHeartRateBpm",
    label: "End work heart rate bpm",
    kind: "number",
  },
  {
    id: "measuredRecoveryHeartRatesBpm",
    label: "Measured recovery heart rates bpm",
    kind: "numberList",
  },
  {
    id: "recoveryMinutesAfterEnd",
    label: "Recovery minutes after end",
    kind: "numberList",
  },
  {
    id: "callerRequiredWorkPulseRecoveryFraction",
    label: "Caller required work pulse recovery fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.preWorkHeartRateBpm, "preWorkHeartRateBpm");
  positive(input.endWorkHeartRateBpm, "endWorkHeartRateBpm");
  input.measuredRecoveryHeartRatesBpm.forEach((v) =>
    positive(v, "measuredRecoveryHeartRatesBpm"),
  );
  input.recoveryMinutesAfterEnd.forEach((v) =>
    nonnegative(v, "recoveryMinutesAfterEnd"),
  );
  fraction(
    input.callerRequiredWorkPulseRecoveryFraction,
    "callerRequiredWorkPulseRecoveryFraction",
  );
  aligned(
    input.measuredRecoveryHeartRatesBpm,
    input.recoveryMinutesAfterEnd,
    "measuredRecoveryHeartRatesBpm",
  );
  ordered(input.recoveryMinutesAfterEnd, "recoveryTimes");
  const pulse = positive(
      input.endWorkHeartRateBpm - input.preWorkHeartRateBpm,
      "positiveWorkPulse",
    ),
    r = input.measuredRecoveryHeartRatesBpm.map(
      (v) => (input.endWorkHeartRateBpm - v) / pulse,
    ),
    i = r.findIndex((v) => v >= input.callerRequiredWorkPulseRecoveryFraction);
  return {
    observedRecoveryFractions: r,
    earliestObservedCallerRecoveryMinute:
      i < 0 ? -1 : input.recoveryMinutesAfterEnd[i],
    recoveryThresholdObserved: i >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preWorkHeartRateBpm: 70,
  endWorkHeartRateBpm: 120,
  measuredRecoveryHeartRatesBpm: [100, 80],
  recoveryMinutesAfterEnd: [1, 3],
  callerRequiredWorkPulseRecoveryFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  observedRecoveryFractions: [0.4, 0.8],
  earliestObservedCallerRecoveryMinute: 3,
  recoveryThresholdObserved: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/heart-rate-recovery-delta-checker",
  title: "Heart Rate Recovery Work Pulse Delta Checker",
  description:
    "Preserve measured work-pulse recovery relative to individual prework baseline and observed earliest caller threshold, including absent/censored threshold; no medical fitness assessment or extrapolated recovery time.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRecoveryFractions",
      label: "Observed recovery fractions",
      kind: "numberList",
    },
    {
      id: "earliestObservedCallerRecoveryMinute",
      label: "Earliest observed caller recovery minute",
      kind: "number",
    },
    {
      id: "recoveryThresholdObserved",
      label: "Recovery threshold observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      preWorkHeartRateBpm: value.preWorkHeartRateBpm as number,
      endWorkHeartRateBpm: value.endWorkHeartRateBpm as number,
      measuredRecoveryHeartRatesBpm:
        value.measuredRecoveryHeartRatesBpm as readonly number[],
      recoveryMinutesAfterEnd:
        value.recoveryMinutesAfterEnd as readonly number[],
      callerRequiredWorkPulseRecoveryFraction:
        value.callerRequiredWorkPulseRecoveryFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
