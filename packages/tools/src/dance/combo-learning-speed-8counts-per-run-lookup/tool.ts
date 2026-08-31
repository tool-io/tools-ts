import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedRunNumbers: readonly number[];
  readonly cumulativeEightCountPhrasesLearned: readonly number[];
  readonly callerTotalEightCountPhrases: number;
}>;
export type Output = Readonly<{
  readonly newEightCountPhrasesPerObservedRunInterval: readonly number[];
  readonly observedPhrasesPerRunInterval: number;
  readonly estimatedAdditionalWholeRunIntervals: number;
  readonly learningComplete: boolean;
}>;
const inputFields = [
  {
    id: "observedRunNumbers",
    label: "Observed run numbers",
    kind: "numberList",
  },
  {
    id: "cumulativeEightCountPhrasesLearned",
    label: "Cumulative eight count phrases learned",
    kind: "numberList",
  },
  {
    id: "callerTotalEightCountPhrases",
    label: "Caller total eight count phrases",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedRunNumbers,
    input.cumulativeEightCountPhrasesLearned,
    "runs",
  );
  strictlyIncreasing(input.observedRunNumbers, "runs");
  input.observedRunNumbers.forEach((v) => bounded(v, "run", 0, 10000));
  bounded(input.callerTotalEightCountPhrases, "target", 1, 10000);
  input.cumulativeEightCountPhrasesLearned.forEach((v, i) => {
    bounded(v, "learned", 0, input.callerTotalEightCountPhrases);
    if (i && v < input.cumulativeEightCountPhrasesLearned[i - 1])
      simpleError(
        "learning",
        "Cumulative mastered phrase evidence cannot decrease; use separate retention tool.",
      );
  });
  const learned = input.cumulativeEightCountPhrasesLearned,
    deltas = learned.slice(1).map((v, i) => v - learned[i]),
    rate =
      (learned[learned.length - 1] - learned[0]) /
      (input.observedRunNumbers.at(-1)! - input.observedRunNumbers[0]),
    remaining =
      input.callerTotalEightCountPhrases - learned[learned.length - 1];
  return {
    newEightCountPhrasesPerObservedRunInterval: deltas,
    observedPhrasesPerRunInterval: rate,
    estimatedAdditionalWholeRunIntervals:
      remaining === 0 ? 0 : rate === 0 ? -1 : Math.ceil(remaining / rate),
    learningComplete: remaining === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRunNumbers: [1, 2, 3],
  cumulativeEightCountPhrasesLearned: [1, 3, 4],
  callerTotalEightCountPhrases: 8,
} satisfies Input;
export const exampleOutput = {
  newEightCountPhrasesPerObservedRunInterval: [2, 1],
  observedPhrasesPerRunInterval: 1.5,
  estimatedAdditionalWholeRunIntervals: 3,
  learningComplete: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/combo-learning-speed-8counts-per-run-lookup",
  title: "Combo Learning Speed 8counts Per Run Lookup",
  description:
    "Estimate actual combination-learning rate from cumulative mastered eight-count phrases across observed runs; zero progress yields unavailable −1 horizon, not universal learning ability or guaranteed linear acquisition.",
  inputs: inputFields,
  outputs: [
    {
      id: "newEightCountPhrasesPerObservedRunInterval",
      label: "New eight count phrases per observed run interval",
      kind: "numberList",
    },
    {
      id: "observedPhrasesPerRunInterval",
      label: "Observed phrases per run interval",
      kind: "number",
    },
    {
      id: "estimatedAdditionalWholeRunIntervals",
      label: "Estimated additional whole run intervals",
      kind: "number",
    },
    { id: "learningComplete", label: "Learning complete", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observedRunNumbers: value.observedRunNumbers as readonly number[],
      cumulativeEightCountPhrasesLearned:
        value.cumulativeEightCountPhrasesLearned as readonly number[],
      callerTotalEightCountPhrases:
        value.callerTotalEightCountPhrases as number,
    }),
});
export const run = tool.execute;
export default tool;
