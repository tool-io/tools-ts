import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VoidRatioInput = {
  readonly solidsVolumeM3: number;
  readonly voidVolumeM3: number;
};

export type VoidRatioOutput = {
  readonly voidRatio: number;
};

export const calculateVoidRatio = (input: VoidRatioInput): VoidRatioOutput => {
  if (!(input.solidsVolumeM3 > 0))
    simpleError(
      "solidsVolumeM3",
      "Solids volume must be greater than zero.",
      "invalid_volume",
    );
  if (!(input.voidVolumeM3 >= 0))
    simpleError(
      "voidVolumeM3",
      "Void volume cannot be negative.",
      "invalid_volume",
    );
  return { voidRatio: input.voidVolumeM3 / input.solidsVolumeM3 };
};

export const voidRatioExample = {
  input: { solidsVolumeM3: 1, voidVolumeM3: 0.5 },
  output: { voidRatio: 0.5 },
} satisfies ToolExample<VoidRatioInput, VoidRatioOutput>;

export const voidRatioTool = createSimpleTool({
  id: "geology/void-ratio",
  title: "Void Ratio Calculator",
  description:
    "Compute the soil or rock void ratio e = Vv / Vs from the volumes of voids and solid particles.",
  inputs: [
    {
      description: "Volume of solid particles in cubic meters.",
      id: "solidsVolumeM3",
      kind: "number",
      label: "Solids volume",
      minimum: 0,
    },
    {
      description: "Volume of void space in cubic meters.",
      id: "voidVolumeM3",
      kind: "number",
      label: "Void volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Void ratio (dimensionless).",
      id: "voidRatio",
      kind: "number",
      label: "Void ratio",
    },
  ],
  calculate: (input) => calculateVoidRatio(input as unknown as VoidRatioInput),
});

export const runVoidRatio = voidRatioTool.execute;
export default voidRatioTool;
