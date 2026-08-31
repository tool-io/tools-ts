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
  aligned,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly publishedPollPercentages: readonly number[];
  readonly roundingHalfWidthsPercentagePoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly publishedPercentageSum: number;
  readonly possibleUnroundedTotalIntervalPercent: readonly number[];
  readonly totalHundredFeasibleUnderCallerRounding: boolean;
}>;
const inputFields = [
  {
    id: "publishedPollPercentages",
    label: "Published poll percentages",
    kind: "numberList",
  },
  {
    id: "roundingHalfWidthsPercentagePoints",
    label: "Rounding half widths percentage points",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.publishedPollPercentages.forEach((v) =>
    nonnegative(v, "publishedPollPercentages"),
  );
  input.roundingHalfWidthsPercentagePoints.forEach((v) =>
    nonnegative(v, "roundingHalfWidthsPercentagePoints"),
  );
  aligned(
    input.publishedPollPercentages,
    input.roundingHalfWidthsPercentagePoints,
    "publishedPollPercentages",
  );
  if (
    !input.publishedPollPercentages.length ||
    input.publishedPollPercentages.some((v) => v > 100) ||
    input.roundingHalfWidthsPercentagePoints.some((v) => v > 50)
  )
    simpleError(
      "percentages",
      "Bounded actual category percentages and caller per-cell rounding uncertainty required.",
    );
  const total = sum(input.publishedPollPercentages),
    lo = sum(
      input.publishedPollPercentages.map((v, i) =>
        Math.max(0, v - input.roundingHalfWidthsPercentagePoints[i]),
      ),
    ),
    hi = sum(
      input.publishedPollPercentages.map((v, i) =>
        Math.min(100, v + input.roundingHalfWidthsPercentagePoints[i]),
      ),
    );
  return {
    publishedPercentageSum: total,
    possibleUnroundedTotalIntervalPercent: [lo, hi],
    totalHundredFeasibleUnderCallerRounding: lo <= 100 && hi >= 100,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  publishedPollPercentages: [33, 33, 33],
  roundingHalfWidthsPercentagePoints: [0.5, 0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  publishedPercentageSum: 99,
  possibleUnroundedTotalIntervalPercent: [97.5, 100.5],
  totalHundredFeasibleUnderCallerRounding: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/poll-horse-race-rounding-sum-100-checker",
  title: "Poll Horse Race Rounding Sum 100 Checker",
  description:
    "Audit observed poll category total under explicit per-cell closed rounding intervals, not merely a table sum; feasibility assumes exhaustive disjoint categories and is conservative at half-open real rounding ties, not statistical validity or a corrected poll result.",
  inputs: inputFields,
  outputs: [
    {
      id: "publishedPercentageSum",
      label: "Published percentage sum",
      kind: "number",
    },
    {
      id: "possibleUnroundedTotalIntervalPercent",
      label: "Possible unrounded total interval percent",
      kind: "numberList",
    },
    {
      id: "totalHundredFeasibleUnderCallerRounding",
      label: "Total hundred feasible under caller rounding",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      publishedPollPercentages:
        value.publishedPollPercentages as readonly number[],
      roundingHalfWidthsPercentagePoints:
        value.roundingHalfWidthsPercentagePoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
