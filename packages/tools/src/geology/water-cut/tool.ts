import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaterCutInput = {
  readonly waterFlowRateM3PerS: number;
  readonly oilFlowRateM3PerS: number;
};

export type WaterCutOutput = {
  readonly waterCutFraction: number;
  readonly waterCutPercent: number;
};

export const calculateWaterCut = (input: WaterCutInput): WaterCutOutput => {
  if (!(input.waterFlowRateM3PerS >= 0))
    simpleError(
      "waterFlowRateM3PerS",
      "Water flow rate cannot be negative.",
      "invalid_rate",
    );
  if (!(input.oilFlowRateM3PerS >= 0))
    simpleError(
      "oilFlowRateM3PerS",
      "Oil flow rate cannot be negative.",
      "invalid_rate",
    );
  const total = input.waterFlowRateM3PerS + input.oilFlowRateM3PerS;
  if (!(total > 0))
    simpleError(
      "oilFlowRateM3PerS",
      "Total liquid flow must be greater than zero.",
      "invalid_rate",
    );
  const fraction = input.waterFlowRateM3PerS / total;
  return { waterCutFraction: fraction, waterCutPercent: fraction * 100 };
};

export const waterCutExample = {
  input: { waterFlowRateM3PerS: 0.004, oilFlowRateM3PerS: 0.006 },
  output: { waterCutFraction: 0.4, waterCutPercent: 40 },
} satisfies ToolExample<WaterCutInput, WaterCutOutput>;

export const waterCutTool = createSimpleTool({
  id: "geology/water-cut",
  title: "Water Cut Calculator",
  description:
    "Compute the water cut of a producing well as the water fraction of the total liquid flow.",
  inputs: [
    {
      description: "Water flow rate.",
      id: "waterFlowRateM3PerS",
      kind: "number",
      label: "Water rate",
      minimum: 0,
      unit: "m3/s",
    },
    {
      description: "Oil flow rate.",
      id: "oilFlowRateM3PerS",
      kind: "number",
      label: "Oil rate",
      minimum: 0,
      unit: "m3/s",
    },
  ],
  outputs: [
    {
      description: "Water cut as a fraction of the liquid stream.",
      id: "waterCutFraction",
      kind: "number",
      label: "Water cut",
    },
    {
      description: "Water cut expressed in percent.",
      id: "waterCutPercent",
      kind: "number",
      label: "Water cut %",
    },
  ],
  calculate: (input) => calculateWaterCut(input as unknown as WaterCutInput),
});

export const runWaterCut = waterCutTool.execute;
export default waterCutTool;
