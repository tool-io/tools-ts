import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoxJointFingerWidthInput = Readonly<{
  readonly jointEdgeWidthMm: number;
  readonly fingerCount: number;
}>;
export type BoxJointFingerWidthOutput = Readonly<{
  readonly fingerWidthMm: number;
}>;

export const calculateBoxJointFingerWidth = (
  x: BoxJointFingerWidthInput,
): BoxJointFingerWidthOutput => {
  if (!Number.isFinite(x.jointEdgeWidthMm) || x.jointEdgeWidthMm < 0)
    simpleError("jointEdgeWidthMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.fingerCount) || x.fingerCount < 1)
    simpleError("fingerCount", "Provide a safe integer at least 1.");
  if (!(x.fingerCount > 0))
    simpleError("fingerCount", "Finger count must be positive.");
  const fingerWidthMm = x.jointEdgeWidthMm / x.fingerCount;
  if (!Number.isFinite(fingerWidthMm))
    simpleError("fingerWidthMm", "The inputs produce an invalid result.");
  return { fingerWidthMm: Object.is(fingerWidthMm, -0) ? 0 : fingerWidthMm };
};

export const example = {
  input: { jointEdgeWidthMm: 100, fingerCount: 10 },
  output: { fingerWidthMm: 10 },
} satisfies ToolExample<BoxJointFingerWidthInput, BoxJointFingerWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/box-joint-finger-width",
  title: "Box Joint Finger Width",
  description:
    "Divide board edge width into a specified number of equal-width box-joint fingers.",
  inputs: [
    {
      id: "jointEdgeWidthMm",
      kind: "number",
      label: "Board edge width",
      unit: "mm",
      minimum: 0,
    },
    { id: "fingerCount", kind: "integer", label: "Equal fingers", minimum: 1 },
  ],
  outputs: [
    { id: "fingerWidthMm", kind: "number", label: "Finger width", unit: "mm" },
  ],
  calculate: (input) =>
    calculateBoxJointFingerWidth({
      jointEdgeWidthMm: input.jointEdgeWidthMm as number,
      fingerCount: input.fingerCount as number,
    }),
});
export const boxJointFingerWidthTool = tool;
export const runBoxJointFingerWidth = tool.execute;
export default tool;
