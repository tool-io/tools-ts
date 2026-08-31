import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  bounded,
  aligned,
  strictlyIncreasing,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedDaysFromSowing: readonly number[];
  readonly observedCumulativeGerminatedCounts: readonly number[];
  readonly observedSownSeedCount: number;
  readonly callerGerminationCompletionFraction: number;
}>;
export type Output = Readonly<{
  readonly callerFractionReachedInObservations: boolean;
  readonly interpolatedDaysToCallerGerminationFraction: number;
  readonly lastObservedGerminationFraction: number;
}>;
const inputFields = [
  {
    id: "observedDaysFromSowing",
    label: "Observed days from sowing",
    kind: "numberList",
  },
  {
    id: "observedCumulativeGerminatedCounts",
    label: "Observed cumulative germinated counts",
    kind: "numberList",
  },
  {
    id: "observedSownSeedCount",
    label: "Observed sown seed count",
    kind: "number",
  },
  {
    id: "callerGerminationCompletionFraction",
    label: "Caller germination completion fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(
    input.callerGerminationCompletionFraction,
    "callerGerminationCompletionFraction",
  );
  bounded(input.observedSownSeedCount, "seeds", 1, 1000000);
  aligned(
    input.observedDaysFromSowing,
    input.observedCumulativeGerminatedCounts,
    "curve",
  );
  strictlyIncreasing(input.observedDaysFromSowing, "days");
  input.observedDaysFromSowing.forEach((v) => nonnegative(v, "days"));
  input.observedCumulativeGerminatedCounts.forEach((v, i) => {
    bounded(v, "germinated", 0, input.observedSownSeedCount);
    if (i && v < input.observedCumulativeGerminatedCounts[i - 1])
      simpleError("curve", "Cumulative germination counts cannot decrease.");
  });
  const target =
      input.callerGerminationCompletionFraction * input.observedSownSeedCount,
    index = input.observedCumulativeGerminatedCounts.findIndex(
      (v) => v >= target,
    );
  if (index === 0 && input.observedDaysFromSowing[0] > 0)
    simpleError(
      "censoring",
      "Target already reached at first late observation; onset is left-censored.",
    );
  let day = -1;
  if (index >= 0) {
    day =
      index === 0
        ? input.observedDaysFromSowing[0]
        : input.observedDaysFromSowing[index - 1] +
          ((target - input.observedCumulativeGerminatedCounts[index - 1]) /
            (input.observedCumulativeGerminatedCounts[index] -
              input.observedCumulativeGerminatedCounts[index - 1])) *
            (input.observedDaysFromSowing[index] -
              input.observedDaysFromSowing[index - 1]);
  }
  return {
    callerFractionReachedInObservations: index >= 0,
    interpolatedDaysToCallerGerminationFraction: day,
    lastObservedGerminationFraction:
      input.observedCumulativeGerminatedCounts.at(-1)! /
      input.observedSownSeedCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDaysFromSowing: [0, 2, 4],
  observedCumulativeGerminatedCounts: [0, 4, 8],
  observedSownSeedCount: 10,
  callerGerminationCompletionFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  callerFractionReachedInObservations: true,
  interpolatedDaysToCallerGerminationFraction: 3,
  lastObservedGerminationFraction: 0.8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/days-to-germination-vegetable-lookup",
  title: "Days To Germination Vegetable Lookup",
  description:
    "Read actual cumulative seed germination curve for caller completion fraction; right-censoring remains unavailable −1, no fixed vegetable germination-day catalog or extrapolation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerFractionReachedInObservations",
      label: "Caller fraction reached in observations",
      kind: "boolean",
    },
    {
      id: "interpolatedDaysToCallerGerminationFraction",
      label: "Interpolated days to caller germination fraction",
      kind: "number",
    },
    {
      id: "lastObservedGerminationFraction",
      label: "Last observed germination fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDaysFromSowing: value.observedDaysFromSowing as readonly number[],
      observedCumulativeGerminatedCounts:
        value.observedCumulativeGerminatedCounts as readonly number[],
      observedSownSeedCount: value.observedSownSeedCount as number,
      callerGerminationCompletionFraction:
        value.callerGerminationCompletionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
