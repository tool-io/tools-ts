import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const calculateDistortionCorrectionFactor = (
  input: DistortionCorrectionFactorInput,
): DistortionCorrectionFactorOutput => {
  const squared = input.radius * input.radius;
  return {
    correctionFactor: 1 + input.k1 * squared + input.k2 * squared * squared,
  };
};

export const distortionCorrectionFactorTool = createSimpleTool({
  id: "vr/distortion-correction-factor",
  title: "Distortion Correction Factor Calculator",
  description:
    "Compute the per-pixel radial correction factor 1 + k1·r² + k2·r⁴ used to undistort headset lens output.",
  inputs: [
    {
      description: "Normalized radius fraction between zero and one.",
      id: "radius",
      label: "Radius fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "First radial distortion coefficient.",
      id: "k1",
      label: "K1 coefficient",
      kind: "number",
    },
    {
      description: "Second radial distortion coefficient.",
      id: "k2",
      label: "K2 coefficient",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Multiplier applied to the undistorted radius.",
      id: "correctionFactor",
      label: "Correction factor",
      kind: "number",
    },
  ],
  calculate: (input) =>
    calculateDistortionCorrectionFactor(
      input as DistortionCorrectionFactorInput,
    ),
});
export const runDistortionCorrectionFactor =
  distortionCorrectionFactorTool.execute;
export default distortionCorrectionFactorTool;

export type DistortionCorrectionFactorInput = {
  readonly radius: number;
  readonly k1: number;
  readonly k2: number;
};

export type DistortionCorrectionFactorOutput = {
  readonly correctionFactor: number;
};

export const distortionCorrectionFactorExample = {
  input: { radius: 0.8, k1: -0.2, k2: 0.03 },
  output: { correctionFactor: 0.884288 },
} satisfies ToolExample<
  DistortionCorrectionFactorInput,
  DistortionCorrectionFactorOutput
>;
