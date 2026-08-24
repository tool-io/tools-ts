import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeadheadEmptyMilesRatioInput = {
  readonly emptyMiles: number;
  readonly totalMiles: number;
};

export type DeadheadEmptyMilesRatioOutput = {
  readonly deadheadPercent: number;
};

export const calculateDeadheadEmptyMilesRatio = (
  input: DeadheadEmptyMilesRatioInput,
): DeadheadEmptyMilesRatioOutput => {
  if (!Number.isFinite(input.totalMiles) || input.totalMiles <= 0)
    return simpleError(
      "totalMiles",
      "Total miles must be finite and greater than zero.",
      "invalid_miles",
    );
  if (
    !Number.isFinite(input.emptyMiles) ||
    input.emptyMiles < 0 ||
    input.emptyMiles > input.totalMiles
  )
    return simpleError(
      "emptyMiles",
      "Empty miles must be finite, non-negative, and no greater than total miles.",
      "invalid_empty_miles",
    );
  return { deadheadPercent: (input.emptyMiles / input.totalMiles) * 100 };
};

export const deadheadEmptyMilesRatioExample = {
  input: { emptyMiles: 220, totalMiles: 2200 },
  output: { deadheadPercent: 10 },
} satisfies ToolExample<
  DeadheadEmptyMilesRatioInput,
  DeadheadEmptyMilesRatioOutput
>;

export const deadheadEmptyMilesRatioTool = createSimpleTool({
  id: "logistics/deadhead-empty-miles-ratio",
  title: "Deadhead Empty Miles Ratio Calculator",
  description:
    "Compute the deadhead ratio as empty miles divided by total fleet or trip miles.",
  inputs: [
    {
      description: "Miles driven without freight (empty).",
      id: "emptyMiles",
      kind: "number",
      label: "Empty miles",
      minimum: 0,
      unit: "mi",
    },
    {
      description: "Total miles driven including loaded and empty.",
      id: "totalMiles",
      kind: "number",
      label: "Total miles",
      minimum: Number.MIN_VALUE,
      unit: "mi",
    },
  ],
  outputs: [
    {
      description: "Empty miles as a percent of total miles.",
      id: "deadheadPercent",
      kind: "number",
      label: "Deadhead",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateDeadheadEmptyMilesRatio({
      emptyMiles: input.emptyMiles as number,
      totalMiles: input.totalMiles as number,
    }),
});

export const runDeadheadEmptyMilesRatio = deadheadEmptyMilesRatioTool.execute;
export default deadheadEmptyMilesRatioTool;
