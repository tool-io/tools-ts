import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateLensDistortionK2 = (
  input: LensDistortionK2Input,
): LensDistortionK2Output => {
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
  const squared = input.idealRadius ** 2;
  const ratio = input.measuredRadius / input.idealRadius - 1;
  return { k2: (ratio - input.k1 * squared) / squared ** 2 };
};

export const lensDistortionK2Tool = createSimpleTool({
  id: "vr/lens-distortion-k2",
  title: "Lens Distortion K2 Calculator",
  description:
    "Solve the second radial distortion coefficient of r_d = r_u·(1 + k1·r_u² + k2·r_u⁴) from a measured sample.",
  inputs: [
    {
      description: "Ideal undistorted radius fraction between zero and one.",
      id: "idealRadius",
      label: "Ideal radius",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "First radial distortion coefficient already known.",
      id: "k1",
      label: "K1 coefficient",
      kind: "number",
      minimum: 0,
    },
    {
      description: "Measured distorted radius fraction for the same point.",
      id: "measuredRadius",
      label: "Measured radius",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Second radial distortion coefficient.",
      id: "k2",
      label: "K2 coefficient",
      kind: "number",
    },
  ],
  calculate: (input) =>
    calculateLensDistortionK2(input as LensDistortionK2Input),
});
export const runLensDistortionK2 = lensDistortionK2Tool.execute;
export default lensDistortionK2Tool;

export type LensDistortionK2Input = {
  readonly idealRadius: number;
  readonly k1: number;
  readonly measuredRadius: number;
};

export type LensDistortionK2Output = {
  readonly k2: number;
};

export const lensDistortionK2Example = {
  input: { idealRadius: 0.8, k1: -0.1, measuredRadius: 0.75 },
  output: { k2: 0.0036621093750000364 },
} satisfies ToolExample<LensDistortionK2Input, LensDistortionK2Output>;
