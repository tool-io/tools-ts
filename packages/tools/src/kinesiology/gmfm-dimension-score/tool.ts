import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly dimensionAchievedPoints: readonly number[];
  readonly dimensionPossiblePoints: readonly number[];
}>;
export type Output = Readonly<{
  readonly dimensionPercentages: readonly number[];
  readonly overallPercent: number;
}>;
export const calculate = (input: Input): Output => {
  const n = input.dimensionAchievedPoints.length;
  if (
    n !== 5 ||
    n !== input.dimensionPossiblePoints.length ||
    input.dimensionPossiblePoints.some(
      (v, i) =>
        v <= 0 ||
        input.dimensionAchievedPoints[i] < 0 ||
        input.dimensionAchievedPoints[i] > v,
    )
  )
    simpleError(
      "dimensionAchievedPoints",
      "Aligned earned points within positive dimension maxima required.",
    );
  const dimensionPercentages = input.dimensionAchievedPoints.map(
    (v, i) => (100 * v) / input.dimensionPossiblePoints[i],
  );
  return {
    dimensionPercentages,
    overallPercent: dimensionPercentages.reduce((a, b) => a + b, 0) / n,
  };
};
export const exampleInput = {
  dimensionAchievedPoints: [10, 20, 20, 20, 20],
  dimensionPossiblePoints: [20, 20, 20, 20, 20],
} satisfies Input;
export const exampleOutput = {
  dimensionPercentages: [50, 100, 100, 100, 100],
  overallPercent: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/gmfm-dimension-score",
  title: "GMFM Dimension Score",
  description:
    "Average dimension percentages for an explicitly supplied GMFM score sheet.",
  inputs: [
    {
      id: "dimensionAchievedPoints",
      label: "Dimension achieved points",
      kind: "numberList",
    },
    {
      id: "dimensionPossiblePoints",
      label: "Dimension possible points",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "dimensionPercentages",
      label: "Dimension percentages",
      kind: "numberList",
    },
    { id: "overallPercent", label: "Overall percent", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dimensionAchievedPoints:
        value.dimensionAchievedPoints as readonly number[],
      dimensionPossiblePoints:
        value.dimensionPossiblePoints as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
