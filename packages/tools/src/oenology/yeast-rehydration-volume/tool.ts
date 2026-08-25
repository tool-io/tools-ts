import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type YeastRehydrationVolumeInput = {
  readonly waterRatioMlPerGram?: number;
  readonly yeastGrams: number;
};

export type YeastRehydrationVolumeOutput = {
  readonly rehydrationWaterMl: number;
};

export const yeastRehydrationVolumeExample = {
  input: {
    waterRatioMlPerGram: 10,
    yeastGrams: 250,
  },
  output: {
    rehydrationWaterMl: 2500,
  },
} satisfies ToolExample<
  YeastRehydrationVolumeInput,
  YeastRehydrationVolumeOutput
>;

export const calculateYeastRehydrationVolume = (
  input: YeastRehydrationVolumeInput,
): YeastRehydrationVolumeOutput => {
  const ratio = input.waterRatioMlPerGram ?? 10;
  if (ratio <= 0)
    simpleError(
      "waterRatioMlPerGram",
      "The water ratio must be positive.",
      "invalid_value",
    );
  return {
    rehydrationWaterMl: roundStatistic(input.yeastGrams * ratio),
  };
};

export const yeastRehydrationVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateYeastRehydrationVolume(
      input as unknown as YeastRehydrationVolumeInput,
    ),
  description:
    "Size the warm water volume for rehydrating active dry yeast at the chosen milliliter-per-gram ratio.",
  id: "oenology/yeast-rehydration-volume",
  inputs: [
    {
      default: 10,
      description:
        "Milliliters of clean warm water per gram of dry yeast; ten is the common cellar ratio.",
      id: "waterRatioMlPerGram",
      kind: "number",
      label: "Water ratio",
      minimum: 1,
      unit: "mL/g",
    },
    {
      description: "Dry yeast to be rehydrated.",
      id: "yeastGrams",
      kind: "number",
      label: "Yeast",
      minimum: 0,
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Water volume for the rehydration slurry.",
      id: "rehydrationWaterMl",
      kind: "number",
      label: "Rehydration water",
      unit: "mL",
    },
  ],
  title: "Yeast Rehydration Water Volume Calculator",
});
export const runYeastRehydrationVolume = yeastRehydrationVolumeTool.execute;
export default yeastRehydrationVolumeTool;
