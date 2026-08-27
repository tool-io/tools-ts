import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SwellIndexInput = {
  readonly swelledVolumeInWaterMl: number;
  readonly keroseneVolumeMl: number;
};

export type SwellIndexOutput = {
  readonly freeSwellIndexPercent: number;
};

export const calculateSwellIndex = (
  input: SwellIndexInput,
): SwellIndexOutput => {
  if (!(input.keroseneVolumeMl > 0))
    simpleError(
      "keroseneVolumeMl",
      "Kerosene reference volume must be greater than zero.",
      "invalid_volume",
    );
  if (!(input.swelledVolumeInWaterMl > 0))
    simpleError(
      "swelledVolumeInWaterMl",
      "Free-swelled volume must be greater than zero.",
      "invalid_volume",
    );
  if (!(input.swelledVolumeInWaterMl >= input.keroseneVolumeMl))
    simpleError(
      "swelledVolumeInWaterMl",
      "Distilled-water volume must be at least the kerosene volume.",
      "invalid_volume",
    );
  return {
    freeSwellIndexPercent:
      ((input.swelledVolumeInWaterMl - input.keroseneVolumeMl) /
        input.keroseneVolumeMl) *
      100,
  };
};

export const swellIndexExample = {
  input: { swelledVolumeInWaterMl: 16, keroseneVolumeMl: 10 },
  output: { freeSwellIndexPercent: 60 },
} satisfies ToolExample<SwellIndexInput, SwellIndexOutput>;

export const swellIndexTool = createSimpleTool({
  id: "geology/swell-index",
  title: "Swell Index Calculator",
  description:
    "Free swell index of a clay per IS 2720 Part 40: (V_water - V_kerosene) / V_kerosene * 100, comparing equilibrium volumes of equal dry specimens in distilled water versus kerosene. Volumes in mL.",
  inputs: [
    {
      description: "Equilibrium volume in distilled water in mL.",
      id: "swelledVolumeInWaterMl",
      kind: "number",
      label: "Water volume",
      minimum: 0,
    },
    {
      description: "Equilibrium volume in kerosene in mL.",
      id: "keroseneVolumeMl",
      kind: "number",
      label: "Kerosene volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Free swell index in percent.",
      id: "freeSwellIndexPercent",
      kind: "number",
      label: "Free swell index",
    },
  ],
  calculate: (input) =>
    calculateSwellIndex(input as unknown as SwellIndexInput),
});

export const runSwellIndex = swellIndexTool.execute;
export default swellIndexTool;
