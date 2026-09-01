import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedEndExerciseBpm: readonly number[];
  readonly observedExactly60SecondRecoveryBpm: readonly number[];
  readonly callerMinimumDropReviewBpm: number;
}>;
export type Output = Readonly<{
  readonly signedExactly60SecondDropsBpm: readonly number[];
  readonly observationsBelowCallerDropTrigger: readonly number[];
}>;
const inputFields = [
  {
    id: "observedEndExerciseBpm",
    label: "Observed end exercise bpm",
    kind: "numberList",
  },
  {
    id: "observedExactly60SecondRecoveryBpm",
    label: "Observed exactly60 second recovery bpm",
    kind: "numberList",
  },
  {
    id: "callerMinimumDropReviewBpm",
    label: "Caller minimum drop review bpm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedEndExerciseBpm.forEach((v) =>
    positive(v, "observedEndExerciseBpm"),
  );
  input.observedExactly60SecondRecoveryBpm.forEach((v) =>
    positive(v, "observedExactly60SecondRecoveryBpm"),
  );
  nonnegative(input.callerMinimumDropReviewBpm, "callerMinimumDropReviewBpm");
  aligned(
    input.observedEndExerciseBpm,
    input.observedExactly60SecondRecoveryBpm,
    "observedEndExerciseBpm",
  );
  const drops = input.observedEndExerciseBpm.map(
    (v, i) => v - input.observedExactly60SecondRecoveryBpm[i],
  );
  return {
    signedExactly60SecondDropsBpm: drops,
    observationsBelowCallerDropTrigger: drops.flatMap((v, i) =>
      v < input.callerMinimumDropReviewBpm ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEndExerciseBpm: [180, 170],
  observedExactly60SecondRecoveryBpm: [150, 160],
  callerMinimumDropReviewBpm: 20,
} satisfies Input;
export const exampleOutput = {
  signedExactly60SecondDropsBpm: [30, 10],
  observationsBelowCallerDropTrigger: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/hr-recovery-60s-drop-checker",
  title: "60-Second HR Recovery Drop Checker",
  description:
    "Audit actual exactly-60-second HR recovery pairs and caller review criterion, retaining rises; not arbitrary recovery-time interpolation, medical prognosis or safe exertion threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedExactly60SecondDropsBpm",
      label: "Signed exactly60 second drops bpm",
      kind: "numberList",
    },
    {
      id: "observationsBelowCallerDropTrigger",
      label: "Observations below caller drop trigger",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEndExerciseBpm: value.observedEndExerciseBpm as readonly number[],
      observedExactly60SecondRecoveryBpm:
        value.observedExactly60SecondRecoveryBpm as readonly number[],
      callerMinimumDropReviewBpm: value.callerMinimumDropReviewBpm as number,
    }),
});
export const run = tool.execute;
export default tool;
