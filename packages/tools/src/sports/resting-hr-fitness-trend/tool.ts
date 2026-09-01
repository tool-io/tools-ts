import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  mean,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedBaselineRestingBpm: readonly number[];
  readonly observedRecentRestingBpm: readonly number[];
  readonly callerReviewRiseBpm: number;
}>;
export type Output = Readonly<{
  readonly baselineMeanRestingBpm: number;
  readonly recentMeanRestingBpm: number;
  readonly signedRecentMinusBaselineBpm: number;
  readonly callerRiseReviewTriggered: boolean;
}>;
const inputFields = [
  {
    id: "observedBaselineRestingBpm",
    label: "Observed baseline resting bpm",
    kind: "numberList",
  },
  {
    id: "observedRecentRestingBpm",
    label: "Observed recent resting bpm",
    kind: "numberList",
  },
  {
    id: "callerReviewRiseBpm",
    label: "Caller review rise bpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBaselineRestingBpm.forEach((v) =>
    positive(v, "observedBaselineRestingBpm"),
  );
  input.observedRecentRestingBpm.forEach((v) =>
    positive(v, "observedRecentRestingBpm"),
  );
  nonnegative(input.callerReviewRiseBpm, "callerReviewRiseBpm");
  const baseline = mean(input.observedBaselineRestingBpm),
    recent = mean(input.observedRecentRestingBpm);
  return {
    baselineMeanRestingBpm: baseline,
    recentMeanRestingBpm: recent,
    signedRecentMinusBaselineBpm: recent - baseline,
    callerRiseReviewTriggered: recent - baseline > input.callerReviewRiseBpm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBaselineRestingBpm: [60, 62],
  observedRecentRestingBpm: [65, 67],
  callerReviewRiseBpm: 4,
} satisfies Input;
export const exampleOutput = {
  baselineMeanRestingBpm: 61,
  recentMeanRestingBpm: 66,
  signedRecentMinusBaselineBpm: 5,
  callerRiseReviewTriggered: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/resting-hr-fitness-trend",
  title: "Resting HR Fitness Trend Checker",
  description:
    "Compare actual caller baseline/recent resting-HR samples with explicit rise review trigger; not HRV, validated fitness trend, diagnosis or recovery permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "baselineMeanRestingBpm",
      label: "Baseline mean resting bpm",
      kind: "number",
    },
    {
      id: "recentMeanRestingBpm",
      label: "Recent mean resting bpm",
      kind: "number",
    },
    {
      id: "signedRecentMinusBaselineBpm",
      label: "Signed recent minus baseline bpm",
      kind: "number",
    },
    {
      id: "callerRiseReviewTriggered",
      label: "Caller rise review triggered",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBaselineRestingBpm:
        value.observedBaselineRestingBpm as readonly number[],
      observedRecentRestingBpm:
        value.observedRecentRestingBpm as readonly number[],
      callerReviewRiseBpm: value.callerReviewRiseBpm as number,
    }),
});
export const run = tool.execute;
export default tool;
