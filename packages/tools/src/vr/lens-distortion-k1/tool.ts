import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateLensDistortionK1 = (
  input: LensDistortionK1Input,
): LensDistortionK1Output => {
  if (input.idealRadius <= 0 || input.idealRadius > 1)
    simpleError(
      "idealRadius",
      "The ideal radius must be greater than zero and at most one.",
      "invalid_ideal_radius",
    );
  if (input.measuredRadius < 0)
    simpleError(
      "measuredRadius",
      "The measured radius cannot be negative.",
      "invalid_measured_radius",
    );
  return {
    k1: (input.measuredRadius / input.idealRadius - 1) / input.idealRadius ** 2,
  };
};

export const lensDistortionK1Tool = createSimpleTool({
  id: "vr/lens-distortion-k1",
  title: "Lens Distortion K1 Calculator",
  description:
    "Solve the first radial distortion coefficient of r_d = r_u·(1 + k1·r_u²) from a measured sample.",
  inputs: [
    {
      description: "Ideal undistorted radius fraction; must be nonzero.",
      id: "idealRadius",
      label: "Ideal radius",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Measured distorted radius fraction for the same point.",
      id: "measuredRadius",
      label: "Measured radius",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "First radial distortion coefficient.",
      id: "k1",
      label: "K1 coefficient",
      kind: "number",
    },
  ],
  calculate: (input) =>
    calculateLensDistortionK1(input as LensDistortionK1Input),
});
export const runLensDistortionK1 = lensDistortionK1Tool.execute;
export default lensDistortionK1Tool;

export type LensDistortionK1Input = {
  readonly idealRadius: number;
  readonly measuredRadius: number;
};

export type LensDistortionK1Output = {
  readonly k1: number;
};

export const lensDistortionK1Example = {
  input: { idealRadius: 0.8, measuredRadius: 0.76 },
  output: { k1: -0.07812500000000006 },
} satisfies ToolExample<LensDistortionK1Input, LensDistortionK1Output>;
