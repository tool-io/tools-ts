import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FoldInterlimbAngleInput = {
  readonly leftLimbDipDegrees: number;
  readonly rightLimbDipDegrees: number;
};

export type FoldInterlimbAngleOutput = {
  readonly interlimbAngleDegrees: number;
  readonly tightness: "gentle" | "open" | "close" | "tight" | "isoclinal";
};

export const calculateFoldInterlimbAngle = (
  input: FoldInterlimbAngleInput,
): FoldInterlimbAngleOutput => {
  for (const key of ["leftLimbDipDegrees", "rightLimbDipDegrees"] as const) {
    if (!(input[key] >= 0 && input[key] <= 90))
      simpleError(
        key,
        "Limb dips must lie between 0 and 90 degrees.",
        "invalid_dip",
      );
  }
  const interlimbAngleDegrees =
    180 - (input.leftLimbDipDegrees + input.rightLimbDipDegrees);
  if (interlimbAngleDegrees < 0)
    simpleError(
      "leftLimbDipDegrees",
      "Limb dips toward each other cannot sum beyond 180 degrees.",
      "invalid_dip",
    );
  return {
    interlimbAngleDegrees,
    tightness:
      interlimbAngleDegrees === 0
        ? "isoclinal"
        : interlimbAngleDegrees < 30
          ? "tight"
          : interlimbAngleDegrees < 70
            ? "close"
            : interlimbAngleDegrees < 120
              ? "open"
              : "gentle",
  };
};

export const foldInterlimbAngleExample = {
  input: { leftLimbDipDegrees: 30, rightLimbDipDegrees: 50 },
  output: { interlimbAngleDegrees: 100, tightness: "open" },
} satisfies ToolExample<FoldInterlimbAngleInput, FoldInterlimbAngleOutput>;

export const foldInterlimbAngleTool = createSimpleTool({
  id: "geology/fold-interlimb-angle",
  title: "Fold Interlimb Angle Calculator",
  description:
    "Interlimb angle in a profile-plane cross section with opposing limb dips measured from horizontal; classified after Fleuty as gentle, open, close, tight or isoclinal.",
  inputs: [
    {
      description: "Dip of one limb from horizontal, in degrees.",
      id: "leftLimbDipDegrees",
      kind: "number",
      label: "Left dip",
      maximum: 90,
      minimum: 0,
    },
    {
      description: "Dip of the opposing limb from horizontal, in degrees.",
      id: "rightLimbDipDegrees",
      kind: "number",
      label: "Right dip",
      maximum: 90,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Angle between the two limbs in degrees: 180 minus the sum of dips.",
      id: "interlimbAngleDegrees",
      kind: "number",
      label: "Interlimb angle",
    },
    {
      description: "Fleuty tightness class from the interlimb angle.",
      enum: ["gentle", "open", "close", "tight", "isoclinal"],
      id: "tightness",
      kind: "string",
      label: "Tightness",
    },
  ],
  calculate: (input) =>
    calculateFoldInterlimbAngle(input as unknown as FoldInterlimbAngleInput),
});

export const runFoldInterlimbAngle = foldInterlimbAngleTool.execute;
export default foldInterlimbAngleTool;
