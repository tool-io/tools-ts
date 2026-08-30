import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RelativeSpacingIndexInput = Readonly<{
  readonly treesPerHectare: number;
  readonly dominantHeightMeters: number;
}>;
export type RelativeSpacingIndexOutput = Readonly<{
  readonly relativeSpacingPercent: number;
}>;

export const calculateRelativeSpacingIndex = (
  x: RelativeSpacingIndexInput,
): RelativeSpacingIndexOutput => {
  if (!Number.isFinite(x.treesPerHectare) || x.treesPerHectare <= 0)
    simpleError("treesPerHectare", "Provide a finite positive number.");
  if (!Number.isFinite(x.dominantHeightMeters) || x.dominantHeightMeters <= 0)
    simpleError("dominantHeightMeters", "Provide a finite positive number.");
  const relativeSpacingPercent =
    (100 * Math.sqrt(10000 / x.treesPerHectare)) / x.dominantHeightMeters;
  if (!Number.isFinite(relativeSpacingPercent))
    simpleError(
      "relativeSpacingPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    relativeSpacingPercent: Object.is(relativeSpacingPercent, -0)
      ? 0
      : relativeSpacingPercent,
  };
};

export const example = {
  input: {
    treesPerHectare: 400,
    dominantHeightMeters: 20,
  },
  output: { relativeSpacingPercent: 25 },
} satisfies ToolExample<RelativeSpacingIndexInput, RelativeSpacingIndexOutput>;

export const tool = createSimpleTool({
  id: "forestry/relative-spacing-index",
  title: "Relative Spacing Index",
  description:
    "Mean tree spacing as a percentage of dominant height, using sqrt(10000/N) for N stems per hectare.",
  inputs: [
    {
      id: "treesPerHectare",
      kind: "number",
      label: "Trees Per Hectare",
      unit: "1/ha",
      minimum: 0,
    },
    {
      id: "dominantHeightMeters",
      kind: "number",
      label: "Dominant Height Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "relativeSpacingPercent",
      kind: "number",
      label: "Relative Spacing Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateRelativeSpacingIndex({
      treesPerHectare: input.treesPerHectare as number,
      dominantHeightMeters: input.dominantHeightMeters as number,
    }),
});
export const relativeSpacingIndexTool = tool;
export const runRelativeSpacingIndex = tool.execute;
export default tool;
