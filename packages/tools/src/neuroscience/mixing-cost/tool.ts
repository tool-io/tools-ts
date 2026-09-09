import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  binary,
  aligned,
  positive,
  mean,
} from "../batch47-shared.js";
export type Input = Readonly<{
  actualMixedBlockRepeatTrialTimesMs: readonly number[];
  mixedRepeatValidCorrectFlags: readonly number[];
  actualPureBlockMatchedTrialTimesMs: readonly number[];
  pureTrialValidCorrectFlags: readonly number[];
}>;
export type Output = Readonly<{ result: Readonly<Record<string, unknown>> }>;
const fields = [
  {
    id: "actualMixedBlockRepeatTrialTimesMs",
    label: "Actual mixed-block repeat-trial latencies ms",
    kind: "numberList",
  },
  {
    id: "mixedRepeatValidCorrectFlags",
    label: "Independently qualified valid correct mixed-repeat trials",
    kind: "numberList",
  },
  {
    id: "actualPureBlockMatchedTrialTimesMs",
    label: "Actual matched-task pure-block latencies ms",
    kind: "numberList",
  },
  {
    id: "pureTrialValidCorrectFlags",
    label: "Independently qualified valid correct pure trials",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  aligned(
    input.actualMixedBlockRepeatTrialTimesMs,
    input.mixedRepeatValidCorrectFlags,
    "mixed-repeat",
  );
  aligned(
    input.actualPureBlockMatchedTrialTimesMs,
    input.pureTrialValidCorrectFlags,
    "pure",
  );
  binary(input.mixedRepeatValidCorrectFlags, "mixed-valid");
  binary(input.pureTrialValidCorrectFlags, "pure-valid");
  input.actualMixedBlockRepeatTrialTimesMs.forEach((v) =>
    positive(v, "actual-latency"),
  );
  input.actualPureBlockMatchedTrialTimesMs.forEach((v) =>
    positive(v, "actual-latency"),
  );
  const mixed = input.actualMixedBlockRepeatTrialTimesMs.filter(
      (_, i) => input.mixedRepeatValidCorrectFlags[i],
    ),
    pure = input.actualPureBlockMatchedTrialTimesMs.filter(
      (_, i) => input.pureTrialValidCorrectFlags[i],
    ),
    a = mean(mixed),
    b = mean(pure);
  return finish({
    result: {
      observedMixedRepeatMeanMs: a,
      observedPureTaskMeanMs: b,
      signedObservedMixingCostMs: a - b,
      includedMixedRepeatTrialCount: mixed.length,
      includedPureTrialCount: pure.length,
      excludedMixedRepeatTrialIndices:
        input.mixedRepeatValidCorrectFlags.flatMap((v, i) => (v ? [] : [i])),
      excludedPureTrialIndices: input.pureTrialValidCorrectFlags.flatMap(
        (v, i) => (v ? [] : [i]),
      ),
    },
  });
};
export const example = {
  input: {
    actualMixedBlockRepeatTrialTimesMs: [500, 700, 2000],
    mixedRepeatValidCorrectFlags: [1, 1, 0],
    actualPureBlockMatchedTrialTimesMs: [400, 600],
    pureTrialValidCorrectFlags: [1, 1],
  },
  output: {
    result: {
      observedMixedRepeatMeanMs: 600,
      observedPureTaskMeanMs: 500,
      signedObservedMixingCostMs: 100,
      includedMixedRepeatTrialCount: 2,
      includedPureTrialCount: 2,
      excludedMixedRepeatTrialIndices: [2],
      excludedPureTrialIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/mixing-cost",
  title: "Mixing Cost Calculator",
  description:
    "Actual task-matched mixed-block REPEAT versus pure-block valid-correct reaction-time mean discrepancy, with exclusions retained and negative costs allowed. Independently identified task/trial conditions and predeclared validity/exclusion protocol required. Not switch-minus-repeat switch cost, paired subject inference, causal executive-function measure, clinical diagnosis or evidence of impairment from one difference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual qualified signed latency discrepancy",
      kind: "object",
    },
  ],
  calculate: (input) => calculate(input as unknown as Input),
});
export const run = tool.execute;
export default tool;
