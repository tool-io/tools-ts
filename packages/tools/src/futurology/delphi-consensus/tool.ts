import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly expertRatings: readonly number[];
  readonly consensusRangeThreshold: number;
  readonly consensusStdDevThreshold: number;
}>;
export type Output = Readonly<{
  readonly meanRating: number;
  readonly ratingRange: number;
  readonly populationStdDev: number;
  readonly consensusReached: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.expertRatings.length < 2)
    simpleError(
      "expertRatings",
      "At least two ratings are required.",
      "insufficient_ratings",
    );
  const meanRating =
      input.expertRatings.reduce((a, b) => a + b, 0) /
      input.expertRatings.length,
    ratingRange =
      Math.max(...input.expertRatings) - Math.min(...input.expertRatings),
    populationStdDev = Math.sqrt(
      input.expertRatings.reduce(
        (sum, value) => sum + (value - meanRating) ** 2,
        0,
      ) / input.expertRatings.length,
    );
  return {
    meanRating,
    ratingRange,
    populationStdDev,
    consensusReached:
      ratingRange <= input.consensusRangeThreshold &&
      populationStdDev <= input.consensusStdDevThreshold,
  };
};

export const exampleInput = {
  expertRatings: [4, 4, 5, 5],
  consensusRangeThreshold: 1,
  consensusStdDevThreshold: 0.5,
} satisfies Input;
export const exampleOutput = {
  meanRating: 4.5,
  ratingRange: 1,
  populationStdDev: 0.5,
  consensusReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      expertRatings: input.expertRatings as readonly number[],
      consensusRangeThreshold: input.consensusRangeThreshold as number,
      consensusStdDevThreshold: input.consensusStdDevThreshold as number,
    }),
  description: "Measure real-time Delphi consensus from expert ratings.",
  id: "futurology/delphi-consensus",
  inputs: [
    { id: "expertRatings", label: "Expert ratings", kind: "numberList" },
    {
      id: "consensusRangeThreshold",
      label: "Maximum rating range",
      kind: "number",
      minimum: 0,
    },
    {
      id: "consensusStdDevThreshold",
      label: "Maximum standard deviation",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "meanRating", label: "Mean rating", kind: "number" },
    { id: "ratingRange", label: "Rating range", kind: "number", minimum: 0 },
    {
      id: "populationStdDev",
      label: "Population standard deviation",
      kind: "number",
      minimum: 0,
    },
    {
      id: "consensusReached",
      label: "Consensus meets supplied thresholds",
      kind: "boolean",
    },
  ],
  title: "Delphi Consensus",
});

export const run = tool.execute;
export default tool;
