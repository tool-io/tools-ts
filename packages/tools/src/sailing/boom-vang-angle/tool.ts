import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoomVangAngleInput = {
  readonly boomAttachmentDistanceMeters: number;
  readonly mastAttachmentHeightMeters: number;
};

export type BoomVangAngleOutput = {
  readonly vangAngleDegrees: number;
};

export const boomVangAngleExample = {
  input: { boomAttachmentDistanceMeters: 1.5, mastAttachmentHeightMeters: 2 },
  output: { vangAngleDegrees: 53.13010235415598 },
} satisfies ToolExample<BoomVangAngleInput, BoomVangAngleOutput>;

export const calculateBoomVangAngle = (
  input: BoomVangAngleInput,
): BoomVangAngleOutput => {
  if (input.mastAttachmentHeightMeters <= 0)
    simpleError(
      "mastAttachmentHeightMeters",
      "The mast attachment height must be positive.",
      "invalid_input",
    );
  if (input.boomAttachmentDistanceMeters <= 0)
    simpleError(
      "boomAttachmentDistanceMeters",
      "The boom attachment distance must be positive.",
      "invalid_input",
    );
  return {
    vangAngleDegrees:
      (Math.atan(
        input.mastAttachmentHeightMeters / input.boomAttachmentDistanceMeters,
      ) *
        180) /
      Math.PI,
  };
};

export const boomVangAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateBoomVangAngle(input as unknown as BoomVangAngleInput),
  description:
    "Compute the vang angle in degrees as atan of the mast attachment height over the boom attachment distance.",
  id: "sailing/boom-vang-angle",
  inputs: [
    {
      description:
        "Distance along the boom from the mast to the vang attachment.",
      format: "length-m",
      id: "boomAttachmentDistanceMeters",
      kind: "number",
      label: "Boom attachment distance",
      unit: "m",
    },
    {
      description: "Height on the mast where the vang attaches above the boom.",
      format: "length-m",
      id: "mastAttachmentHeightMeters",
      kind: "number",
      label: "Mast attachment height",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Angle between the vang and the boom.",
      format: "angle-deg",
      id: "vangAngleDegrees",
      kind: "number",
      label: "Vang angle",
      unit: "deg",
    },
  ],
  title: "Vang Angle Calculator",
});
export const runBoomVangAngle = boomVangAngleTool.execute;
export default boomVangAngleTool;
