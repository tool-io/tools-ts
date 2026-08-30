import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, count, mean } from "../shared.js";

export type Input = Readonly<{
  readonly resistantCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly meanResistantCount: number;
  readonly sampleVariance: number;
  readonly varianceMeanRatio: number;
  readonly zeroCultureFraction: number;
  readonly zeroClassMutationEvents: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.resistantCounts.length < 2)
    simpleError(
      "resistantCounts",
      "At least two independent cultures required.",
    );
  input.resistantCounts.forEach((v) => count(v, "resistantCounts"));
  const meanResistantCount = mean(input.resistantCounts),
    sampleVariance =
      input.resistantCounts.reduce(
        (sum, v) => sum + (v - meanResistantCount) ** 2,
        0,
      ) /
      (input.resistantCounts.length - 1),
    zeroCultureFraction =
      input.resistantCounts.filter((v) => v === 0).length /
      input.resistantCounts.length;
  positive(meanResistantCount, "resistantCounts");
  if (zeroCultureFraction === 0 || zeroCultureFraction === 1)
    simpleError(
      "resistantCounts",
      "Both zero and nonzero cultures required for a finite zero-class estimate.",
    );
  return {
    meanResistantCount,
    sampleVariance,
    varianceMeanRatio: sampleVariance / meanResistantCount,
    zeroCultureFraction,
    zeroClassMutationEvents: -Math.log(zeroCultureFraction),
  };
};
export const exampleInput = { resistantCounts: [0, 0, 2, 6] } satisfies Input;
export const exampleOutput = {
  meanResistantCount: 2,
  sampleVariance: 8,
  varianceMeanRatio: 4,
  zeroCultureFraction: 0.5,
  zeroClassMutationEvents: 0.6931471805599453,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/fluctuation-culture-zero-class",
  title: "Fluctuation Culture Zero Class",
  description:
    "Summarize fluctuation-test culture dispersion and the p0 mutation-event estimate from independent culture counts; not mutation frequency per cell.",
  inputs: [
    { id: "resistantCounts", label: "Resistant counts", kind: "numberList" },
  ],
  outputs: [
    { id: "meanResistantCount", label: "Mean resistant count", kind: "number" },
    { id: "sampleVariance", label: "Sample variance", kind: "number" },
    { id: "varianceMeanRatio", label: "Variance mean ratio", kind: "number" },
    {
      id: "zeroCultureFraction",
      label: "Zero culture fraction",
      kind: "number",
    },
    {
      id: "zeroClassMutationEvents",
      label: "Zero class mutation events",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      resistantCounts: value.resistantCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
