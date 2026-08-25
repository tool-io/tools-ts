import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MpgLoadedVsEmptyAdjustedInput = {
  readonly emptyMpg: number;
  readonly loadedMpg: number;
};

export type MpgLoadedVsEmptyAdjustedOutput = {
  readonly mpgLossPercent: number;
  readonly mpgPenalty: number;
};

export const calculateMpgLoadedVsEmptyAdjusted = (
  input: MpgLoadedVsEmptyAdjustedInput,
): MpgLoadedVsEmptyAdjustedOutput => {
  if (!Number.isFinite(input.emptyMpg) || input.emptyMpg <= 0)
    return simpleError(
      "emptyMpg",
      "Empty MPG must be greater than zero.",
      "invalid_mpg",
    );
  if (!Number.isFinite(input.loadedMpg) || input.loadedMpg <= 0)
    return simpleError(
      "loadedMpg",
      "Loaded MPG must be finite and greater than zero.",
      "invalid_mpg",
    );
  const mpgPenalty = input.emptyMpg - input.loadedMpg;
  const mpgLossPercent = (mpgPenalty / input.emptyMpg) * 100;
  if (!Number.isFinite(mpgLossPercent))
    return simpleError(
      "loadedMpg",
      "The MPG comparison is outside the representable range.",
      "result_out_of_range",
    );
  return { mpgPenalty, mpgLossPercent };
};

export const mpgLoadedVsEmptyAdjustedExample = {
  input: { emptyMpg: 7.2, loadedMpg: 6.1 },
  output: {
    mpgLossPercent: 15.277777777777784,
    mpgPenalty: 1.1000000000000005,
  },
} satisfies ToolExample<
  MpgLoadedVsEmptyAdjustedInput,
  MpgLoadedVsEmptyAdjustedOutput
>;

export const mpgLoadedVsEmptyAdjustedTool = createSimpleTool({
  id: "logistics/mpg-loaded-vs-empty-adjusted",
  title: "MPG Loaded vs Empty Adjusted Calculator",
  description:
    "Compare loaded and empty fuel economy in MPG and percent. Negative results indicate the measured loaded MPG was higher, not a fuel-economy penalty.",
  inputs: [
    {
      description: "Fuel economy running empty in miles per gallon.",
      id: "emptyMpg",
      kind: "number",
      label: "Empty MPG",
      minimum: Number.MIN_VALUE,
      unit: "mpg",
    },
    {
      description: "Fuel economy running loaded in miles per gallon.",
      id: "loadedMpg",
      kind: "number",
      label: "Loaded MPG",
      minimum: Number.MIN_VALUE,
      unit: "mpg",
    },
  ],
  outputs: [
    {
      description: "MPG given up by loading the truck (empty minus loaded).",
      id: "mpgPenalty",
      kind: "number",
      label: "MPG penalty",
    },
    {
      description: "Penalty as a percent of the empty MPG.",
      id: "mpgLossPercent",
      kind: "number",
      label: "Loss %",
    },
  ],
  calculate: (input) =>
    calculateMpgLoadedVsEmptyAdjusted({
      emptyMpg: input.emptyMpg as number,
      loadedMpg: input.loadedMpg as number,
    }),
});

export const runMpgLoadedVsEmptyAdjusted = mpgLoadedVsEmptyAdjustedTool.execute;
export default mpgLoadedVsEmptyAdjustedTool;
