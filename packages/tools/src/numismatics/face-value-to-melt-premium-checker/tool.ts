import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FaceValueToMeltPremiumCheckerInput = Readonly<{
  readonly meltValue: number;
  readonly faceValue: number;
}>;
export type FaceValueToMeltPremiumCheckerOutput = Readonly<{
  readonly meltOverFacePercent: number;
}>;

export const calculateFaceValueToMeltPremiumChecker = (
  x: FaceValueToMeltPremiumCheckerInput,
): FaceValueToMeltPremiumCheckerOutput => {
  if (!Number.isFinite(x.meltValue) || x.meltValue < 0)
    simpleError("meltValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.faceValue) || x.faceValue <= 0)
    simpleError("faceValue", "Provide a finite positive number.");
  const meltOverFacePercent = ((x.meltValue - x.faceValue) / x.faceValue) * 100;
  if (!Number.isFinite(meltOverFacePercent))
    simpleError(
      "meltOverFacePercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    meltOverFacePercent: Object.is(meltOverFacePercent, -0)
      ? 0
      : meltOverFacePercent,
  };
};

export const example = {
  input: {
    meltValue: 15,
    faceValue: 10,
  },
  output: { meltOverFacePercent: 50 },
} satisfies ToolExample<
  FaceValueToMeltPremiumCheckerInput,
  FaceValueToMeltPremiumCheckerOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/face-value-to-melt-premium-checker",
  title: "Face Value To Melt Premium Checker",
  description:
    "Measure metal-value premium over legal face value; it does not estimate collectible premium.",
  inputs: [
    { id: "meltValue", kind: "number", label: "Melt Value", unit: "currency" },
    { id: "faceValue", kind: "number", label: "Face Value", unit: "currency" },
  ],
  outputs: [
    {
      id: "meltOverFacePercent",
      kind: "number",
      label: "Melt Over Face Percent",
      unit: "%",
    },
  ],
  calculate: (input) =>
    calculateFaceValueToMeltPremiumChecker({
      meltValue: input.meltValue as number,
      faceValue: input.faceValue as number,
    }),
});
export const runFaceValueToMeltPremiumChecker = tool.execute;
export default tool;
