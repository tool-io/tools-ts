import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterOilRatioInput = {
  readonly waterVolumeSm3: number;
  readonly oilVolumeSm3: number;
};

export type WaterOilRatioOutput = {
  readonly waterOilRatio: number;
};

export const calculateWaterOilRatio = (
  input: WaterOilRatioInput,
): WaterOilRatioOutput => {
  if (!(input.waterVolumeSm3 >= 0))
    simpleError(
      "waterVolumeSm3",
      "Water volume cannot be negative.",
      "invalid_volume",
    );
  if (!(input.oilVolumeSm3 > 0))
    simpleError(
      "oilVolumeSm3",
      "Oil volume must be greater than zero.",
      "invalid_volume",
    );
  return { waterOilRatio: input.waterVolumeSm3 / input.oilVolumeSm3 };
};

export const waterOilRatioExample = {
  input: { waterVolumeSm3: 30, oilVolumeSm3: 60 },
  output: { waterOilRatio: 0.5 },
} satisfies ToolExample<WaterOilRatioInput, WaterOilRatioOutput>;

export const waterOilRatioTool = createSimpleTool({
  id: "geology/water-oil-ratio",
  title: "Water Oil Ratio Calculator",
  description:
    "Compute the producing water-oil ratio as produced water volume divided by produced oil volume.",
  inputs: [
    {
      description: "Produced water volume at standard conditions.",
      id: "waterVolumeSm3",
      kind: "number",
      label: "Water volume",
      minimum: 0,
      unit: "m3",
    },
    {
      description: "Produced oil volume at stock-tank conditions.",
      id: "oilVolumeSm3",
      kind: "number",
      label: "Oil volume",
      minimum: 0,
      unit: "m3",
    },
  ],
  outputs: [
    {
      description:
        "Water-oil ratio in cubic metres of water per cubic metre of oil.",
      id: "waterOilRatio",
      kind: "number",
      label: "WOR",
    },
  ],
  calculate: (input) =>
    calculateWaterOilRatio(input as unknown as WaterOilRatioInput),
});

export const runWaterOilRatio = waterOilRatioTool.execute;
export default waterOilRatioTool;
