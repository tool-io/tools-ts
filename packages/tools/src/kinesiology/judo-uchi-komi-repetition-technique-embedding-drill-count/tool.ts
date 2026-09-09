import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  bounded,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyRecordedCompletedUchiKomiRepetitions: readonly number[];
  readonly callerPlannedRepetitionCounts: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyRecordedCompletedUchiKomiRepetitions",
    label: "Independently recorded completed uchi komi repetitions",
    kind: "numberList",
  },
  {
    id: "callerPlannedRepetitionCounts",
    label: "Caller planned repetition counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyRecordedCompletedUchiKomiRepetitions,
    input.callerPlannedRepetitionCounts,
    "sessions",
  );
  [
    input.independentlyRecordedCompletedUchiKomiRepetitions,
    input.callerPlannedRepetitionCounts,
  ].forEach((v) => v.forEach((x) => bounded(x, "repetitions", 0, 1000000)));
  return {
    observedTotalCompletedRepetitions: sum(
      input.independentlyRecordedCompletedUchiKomiRepetitions,
    ),
    signedCompletedMinusPlannedCounts:
      input.independentlyRecordedCompletedUchiKomiRepetitions.map(
        (v, i) => v - input.callerPlannedRepetitionCounts[i],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyRecordedCompletedUchiKomiRepetitions: [10, 20],
    callerPlannedRepetitionCounts: [15, 15],
  },
  output: {
    result: {
      observedTotalCompletedRepetitions: 30,
      signedCompletedMinusPlannedCounts: [-5, 5],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/judo-uchi-komi-repetition-technique-embedding-drill-count",
  title: "Judo Uchi Komi Repetition Technique Embedding Drill Count",
  description:
    "Actual disjoint uchi-komisession tally versus caller plan. Not technique quality, learning efficacy, optimal repetitions or safe practice prescription.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
