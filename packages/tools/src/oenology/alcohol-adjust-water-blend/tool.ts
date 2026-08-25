import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type AlcoholAdjustWaterBlendInput = {
  readonly currentAbvPercent: number;
  readonly currentVolumeLiters: number;
  readonly targetAbvPercent: number;
};

export type AlcoholAdjustWaterBlendOutput = {
  readonly waterLiters: number;
};

export const alcoholAdjustWaterBlendExample = {
  input: {
    currentAbvPercent: 14,
    currentVolumeLiters: 1000,
    targetAbvPercent: 13,
  },
  output: {
    waterLiters: 76.9230769231,
  },
} satisfies ToolExample<
  AlcoholAdjustWaterBlendInput,
  AlcoholAdjustWaterBlendOutput
>;

export const calculateAlcoholAdjustWaterBlend = (
  input: AlcoholAdjustWaterBlendInput,
): AlcoholAdjustWaterBlendOutput => {
  if (input.currentAbvPercent > 100)
    simpleError(
      "currentAbvPercent",
      "Alcohol by volume cannot exceed one hundred percent.",
      "invalid_value",
    );
  if (input.targetAbvPercent <= 0)
    simpleError(
      "targetAbvPercent",
      "The target alcohol must be positive.",
      "invalid_value",
    );
  if (input.targetAbvPercent > 100)
    simpleError(
      "targetAbvPercent",
      "Alcohol by volume cannot exceed one hundred percent.",
      "invalid_value",
    );
  if (input.targetAbvPercent >= input.currentAbvPercent)
    simpleError(
      "targetAbvPercent",
      "Watering back only lowers alcohol; the target must sit below the current value.",
      "invalid_target",
    );
  return {
    waterLiters: roundStatistic(
      (input.currentVolumeLiters *
        (input.currentAbvPercent - input.targetAbvPercent)) /
        input.targetAbvPercent,
    ),
  };
};

export const alcoholAdjustWaterBlendTool = createSimpleTool({
  calculate: (input) =>
    calculateAlcoholAdjustWaterBlend(
      input as unknown as AlcoholAdjustWaterBlendInput,
    ),
  description:
    "Size the watering-back addition that lowers a lot from its current alcohol to the target while conserving total ethanol.",
  id: "oenology/alcohol-adjust-water-blend",
  inputs: [
    {
      description: "Alcohol by volume before adjustment.",
      id: "currentAbvPercent",
      kind: "number",
      label: "Current ABV",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Wine volume before the addition.",
      id: "currentVolumeLiters",
      kind: "number",
      label: "Current volume",
      minimum: 0,
      unit: "L",
    },
    {
      description: "Alcohol wanted after watering back.",
      id: "targetAbvPercent",
      kind: "number",
      label: "Target ABV",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Water to blend into the lot.",
      id: "waterLiters",
      kind: "number",
      label: "Water",
      unit: "L",
    },
  ],
  title: "Alcohol Adjustment Water Blend Volume Calculator",
});
export const runAlcoholAdjustWaterBlend = alcoholAdjustWaterBlendTool.execute;
export default alcoholAdjustWaterBlendTool;
