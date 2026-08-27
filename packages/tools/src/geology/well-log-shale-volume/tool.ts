import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WellLogShaleVolumeInput = {
  readonly gammaRayApi: number;
  readonly cleanSandGammaRayApi: number;
  readonly shaleGammaRayApi: number;
  readonly model?: "linear" | "larionov-tertiary" | "larionov-older";
};

export type WellLogShaleVolumeOutput = {
  readonly gammaRayIndex: number;
  readonly shaleVolume: number;
};

export const calculateWellLogShaleVolume = (
  input: WellLogShaleVolumeInput,
): WellLogShaleVolumeOutput => {
  const model = input.model ?? "larionov-tertiary";
  if (!(input.shaleGammaRayApi > input.cleanSandGammaRayApi))
    simpleError(
      "shaleGammaRayApi",
      "Shale reading must exceed clean-sand reading.",
      "invalid_gamma_ray",
    );
  if (!(
    input.gammaRayApi >= input.cleanSandGammaRayApi &&
    input.gammaRayApi <= input.shaleGammaRayApi
  ))
    simpleError(
      "gammaRayApi",
      "Gamma ray reading must lie between clean-sand and shale end members.",
      "invalid_gamma_ray",
    );
  const index =
    (input.gammaRayApi - input.cleanSandGammaRayApi) /
    (input.shaleGammaRayApi - input.cleanSandGammaRayApi);
  const raw =
    model === "linear"
      ? index
      : model === "larionov-tertiary"
        ? 0.083 * (2 ** (3.7 * index) - 1)
        : 0.33 * (2 ** (2 * index) - 1);
  return { gammaRayIndex: index, shaleVolume: Math.min(1, Math.max(0, raw)) };
};

export const wellLogShaleVolumeExample = {
  input: { gammaRayApi: 75, cleanSandGammaRayApi: 25, shaleGammaRayApi: 125 },
  output: { gammaRayIndex: 0.5, shaleVolume: 0.21621515358679566 },
} satisfies ToolExample<WellLogShaleVolumeInput, WellLogShaleVolumeOutput>;

export const wellLogShaleVolumeTool = createSimpleTool({
  id: "geology/well-log-shale-volume",
  title: "Well Log Shale Volume Calculator",
  description:
    "Convert a gamma ray reading in API units to shale volume using the linear or Larionov transforms.",
  inputs: [
    {
      description: "Gamma ray reading in API units.",
      id: "gammaRayApi",
      kind: "number",
      label: "GR log",
    },
    {
      description: "Clean-sand gamma ray end member in API units.",
      id: "cleanSandGammaRayApi",
      kind: "number",
      label: "GR clean",
    },
    {
      description: "Shale gamma ray end member in API units.",
      id: "shaleGammaRayApi",
      kind: "number",
      label: "GR shale",
    },
    {
      default: "larionov-tertiary",
      description: "Transform model.",
      enum: ["linear", "larionov-tertiary", "larionov-older"],
      id: "model",
      kind: "string",
      label: "Model",
    },
  ],
  outputs: [
    {
      description: "Gamma ray index I_GR between zero and one.",
      id: "gammaRayIndex",
      kind: "number",
      label: "I_GR",
    },
    {
      description: "Shale volume fraction from 0 to 1.",
      id: "shaleVolume",
      kind: "number",
      label: "V shale",
    },
  ],
  calculate: (input) =>
    calculateWellLogShaleVolume(input as unknown as WellLogShaleVolumeInput),
});

export const runWellLogShaleVolume = wellLogShaleVolumeTool.execute;
export default wellLogShaleVolumeTool;
