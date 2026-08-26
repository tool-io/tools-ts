import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SqueezeDistortionCorrectorInput = {
  readonly squeezeWidthCm: number;
  readonly squeezeHeightCm: number;
  readonly distortionPercent?: number;
  readonly mode?: "contraction" | "expansion";
};

export type SqueezeDistortionCorrectorOutput = {
  readonly correctedWidthCm: number;
  readonly correctedHeightCm: number;
};

export const calculateSqueezeDistortionCorrector = (
  input: SqueezeDistortionCorrectorInput,
): SqueezeDistortionCorrectorOutput => {
  for (const key of ["squeezeWidthCm", "squeezeHeightCm"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Squeeze dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const distortion = input.distortionPercent ?? 1.5;
  if (!(distortion >= 0 && distortion < 100))
    return simpleError(
      "distortionPercent",
      "Distortion must be between 0 and 100 percent.",
      "invalid_distortion",
    );
  const factor = distortion / 100;
  const scale =
    (input.mode ?? "contraction") === "contraction" ? 1 - factor : 1 + factor;
  return {
    correctedWidthCm: input.squeezeWidthCm / scale,
    correctedHeightCm: input.squeezeHeightCm / scale,
  };
};

export const squeezeDistortionCorrectorExample = {
  input: {
    squeezeWidthCm: 19.8,
    squeezeHeightCm: 29.7,
    distortionPercent: 1.5,
    mode: "contraction",
  },
  output: {
    correctedWidthCm: 20.101522842639596,
    correctedHeightCm: 30.15228426395939,
  },
} satisfies ToolExample<
  SqueezeDistortionCorrectorInput,
  SqueezeDistortionCorrectorOutput
>;

export const squeezeDistortionCorrectorTool = createSimpleTool({
  id: "epigraphy/squeeze-distortion-corrector",
  title: "Squeeze Paper Squeeze Dimension Distortion Corrector",
  description:
    "Correct squeeze (paper cast) dimensions back to stone-face dimensions by removing an assumed linear shrinkage or expansion of the paper.",
  inputs: [
    {
      description: "Measured squeeze width in centimetres.",
      id: "squeezeWidthCm",
      kind: "number",
      label: "Squeeze width",
      minimum: 0,
    },
    {
      description: "Measured squeeze height in centimetres.",
      id: "squeezeHeightCm",
      kind: "number",
      label: "Squeeze height",
      minimum: 0,
    },
    {
      default: 1.5,
      description: "Assumed linear distortion of the paper, in percent.",
      id: "distortionPercent",
      kind: "number",
      label: "Distortion",
      minimum: 0,
    },
    {
      default: "contraction",
      description:
        "Whether the paper contracted or expanded relative to the stone face.",
      enum: ["contraction", "expansion"],
      id: "mode",
      kind: "string",
      label: "Mode",
    },
  ],
  outputs: [
    {
      description: "Distortion-corrected width in centimetres.",
      id: "correctedWidthCm",
      kind: "number",
      label: "Corrected width",
    },
    {
      description: "Distortion-corrected height in centimetres.",
      id: "correctedHeightCm",
      kind: "number",
      label: "Corrected height",
    },
  ],
  calculate: (input) =>
    calculateSqueezeDistortionCorrector(
      input as unknown as SqueezeDistortionCorrectorInput,
    ),
});

export const runSqueezeDistortionCorrector =
  squeezeDistortionCorrectorTool.execute;
export default squeezeDistortionCorrectorTool;
