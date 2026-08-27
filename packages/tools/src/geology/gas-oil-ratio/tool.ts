import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GasOilRatioInput = {
  readonly gasVolumeSm3: number;
  readonly oilVolumeSm3: number;
};

export type GasOilRatioOutput = {
  readonly gasOilRatioSm3PerSm3: number;
};

export const calculateGasOilRatio = (
  input: GasOilRatioInput,
): GasOilRatioOutput => {
  if (!(input.gasVolumeSm3 >= 0))
    simpleError(
      "gasVolumeSm3",
      "Gas volume cannot be negative.",
      "invalid_volume",
    );
  if (!(input.oilVolumeSm3 > 0))
    simpleError(
      "oilVolumeSm3",
      "Oil volume must be greater than zero.",
      "invalid_volume",
    );
  return { gasOilRatioSm3PerSm3: input.gasVolumeSm3 / input.oilVolumeSm3 };
};

export const gasOilRatioExample = {
  input: { gasVolumeSm3: 9000, oilVolumeSm3: 60 },
  output: { gasOilRatioSm3PerSm3: 150 },
} satisfies ToolExample<GasOilRatioInput, GasOilRatioOutput>;

export const gasOilRatioTool = createSimpleTool({
  id: "geology/gas-oil-ratio",
  title: "Gas Oil Ratio Calculator",
  description:
    "Compute the producing gas-oil ratio as produced gas volume divided by produced oil volume at standard conditions.",
  inputs: [
    {
      description: "Produced gas volume at standard conditions.",
      id: "gasVolumeSm3",
      kind: "number",
      label: "Gas volume",
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
        "Gas-oil ratio in standard cubic metres per cubic metre of oil.",
      id: "gasOilRatioSm3PerSm3",
      kind: "number",
      label: "GOR",
    },
  ],
  calculate: (input) =>
    calculateGasOilRatio(input as unknown as GasOilRatioInput),
});

export const runGasOilRatio = gasOilRatioTool.execute;
export default gasOilRatioTool;
