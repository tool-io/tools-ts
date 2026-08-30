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
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly trialFeedKgPerDay: readonly number[];
  readonly trialGainKgPerDay: readonly number[];
  readonly feedPricePerKg: number;
  readonly fishValuePerKgGain: number;
}>;
export type Output = Readonly<{
  readonly trialContributionMarginsPerDay: readonly number[];
  readonly bestObservedFeedKgPerDay: number;
  readonly bestObservedMarginPerDay: number;
}>;
const inputFields = [
  {
    id: "trialFeedKgPerDay",
    label: "Trial feed kg per day",
    kind: "numberList",
  },
  {
    id: "trialGainKgPerDay",
    label: "Trial gain kg per day",
    kind: "numberList",
  },
  { id: "feedPricePerKg", label: "Feed price per kg", kind: "number" },
  { id: "fishValuePerKgGain", label: "Fish value per kg gain", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.trialFeedKgPerDay.forEach((v) => nonnegative(v, "trialFeedKgPerDay"));
  input.trialGainKgPerDay.forEach((v) => nonnegative(v, "trialGainKgPerDay"));
  nonnegative(input.feedPricePerKg, "feedPricePerKg");
  nonnegative(input.fishValuePerKgGain, "fishValuePerKgGain");
  aligned(
    input.trialFeedKgPerDay,
    input.trialGainKgPerDay,
    "trialFeedKgPerDay",
  );
  const trialContributionMarginsPerDay = input.trialGainKgPerDay.map(
      (v, i) =>
        v * input.fishValuePerKgGain -
        input.trialFeedKgPerDay[i] * input.feedPricePerKg,
    ),
    bestObservedMarginPerDay = maximum(trialContributionMarginsPerDay);
  if (
    trialContributionMarginsPerDay.filter((v) => v === bestObservedMarginPerDay)
      .length !== 1
  )
    simpleError("trialFeedKgPerDay", "Observed best margin is tied.");
  return {
    trialContributionMarginsPerDay,
    bestObservedFeedKgPerDay:
      input.trialFeedKgPerDay[
        trialContributionMarginsPerDay.indexOf(bestObservedMarginPerDay)
      ],
    bestObservedMarginPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  trialFeedKgPerDay: [1, 2, 3],
  trialGainKgPerDay: [0.5, 0.8, 0.9],
  feedPricePerKg: 2,
  fishValuePerKgGain: 10,
} satisfies Input;
export const exampleOutput = {
  trialContributionMarginsPerDay: [3, 4, 3],
  bestObservedFeedKgPerDay: 2,
  bestObservedMarginPerDay: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/economic-feed-rate",
  title: "Economic Feed Rate",
  description:
    "Select the unique best contribution margin among caller measured feed/gain trials; not feed-cost-per-gain arithmetic, growth-curve extrapolation or feeding advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "trialContributionMarginsPerDay",
      label: "Trial contribution margins per day",
      kind: "numberList",
    },
    {
      id: "bestObservedFeedKgPerDay",
      label: "Best observed feed kg per day",
      kind: "number",
    },
    {
      id: "bestObservedMarginPerDay",
      label: "Best observed margin per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      trialFeedKgPerDay: value.trialFeedKgPerDay as readonly number[],
      trialGainKgPerDay: value.trialGainKgPerDay as readonly number[],
      feedPricePerKg: value.feedPricePerKg as number,
      fishValuePerKgGain: value.fishValuePerKgGain as number,
    }),
});
export const run = tool.execute;
export default tool;
