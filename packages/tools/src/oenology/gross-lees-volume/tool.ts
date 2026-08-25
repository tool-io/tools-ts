import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type GrossLeesVolumeInput = {
  readonly leesDepthCm: number;
  readonly vesselDiameterCm: number;
};

export type GrossLeesVolumeOutput = {
  readonly leesLiters: number;
};

export const grossLeesVolumeExample = {
  input: {
    leesDepthCm: 2,
    vesselDiameterCm: 60,
  },
  output: {
    leesLiters: 5.65486677646,
  },
} satisfies ToolExample<GrossLeesVolumeInput, GrossLeesVolumeOutput>;

export const calculateGrossLeesVolume = (
  input: GrossLeesVolumeInput,
): GrossLeesVolumeOutput => {
  if (input.leesDepthCm < 0 || input.vesselDiameterCm <= 0)
    simpleError(
      "leesDepthCm",
      "Lees depth cannot be negative and vessel diameter must be positive.",
      "invalid_value",
    );
  const radius = input.vesselDiameterCm / 2;
  return {
    leesLiters: roundStatistic(
      (Math.PI * radius ** 2 * input.leesDepthCm) / 1000,
    ),
  };
};

export const grossLeesVolumeTool = createSimpleTool({
  calculate: (input) =>
    calculateGrossLeesVolume(input as unknown as GrossLeesVolumeInput),
  description:
    "Estimate gross-lees volume as a uniform cylindrical layer across a flat circular vessel floor; sloped, conical, dished, or irregular bottoms require their own geometry.",
  id: "oenology/gross-lees-volume",
  inputs: [
    {
      description: "Sediment depth on the vessel floor.",
      id: "leesDepthCm",
      kind: "number",
      label: "Lees depth",
      minimum: 0,
      unit: "cm",
    },
    {
      description: "Inside diameter of the cylindrical vessel.",
      id: "vesselDiameterCm",
      kind: "number",
      label: "Vessel diameter",
      minimum: 0.000001,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description: "Estimated volume occupied by the gross-lees layer.",
      id: "leesLiters",
      kind: "number",
      label: "Gross lees",
      unit: "L",
    },
  ],
  title: "Gross Lees Volume Estimate Calculator",
});
export const runGrossLeesVolume = grossLeesVolumeTool.execute;
export default grossLeesVolumeTool;
