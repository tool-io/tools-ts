import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FingerJointCountInput = Readonly<{
  readonly jointEdgeWidthMm: number;
  readonly targetFingerWidthMm: number;
}>;
export type FingerJointCountOutput = Readonly<{
  readonly fingerCount: number;
  readonly actualFingerWidthMm: number;
}>;

export const calculateFingerJointCount = (
  x: FingerJointCountInput,
): FingerJointCountOutput => {
  if (!Number.isFinite(x.jointEdgeWidthMm) || x.jointEdgeWidthMm < 0)
    simpleError("jointEdgeWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.targetFingerWidthMm) || x.targetFingerWidthMm < 0)
    simpleError("targetFingerWidthMm", "Provide a finite number at least 0.");
  if (!(x.jointEdgeWidthMm > 0 && x.targetFingerWidthMm > 0))
    simpleError(
      "input",
      "Board width and target finger width must be positive.",
    );
  const fingerCount = Math.max(
    1,
    Math.round(x.jointEdgeWidthMm / x.targetFingerWidthMm),
  );
  if (!Number.isFinite(fingerCount) || !Number.isSafeInteger(fingerCount))
    simpleError("fingerCount", "The inputs produce an invalid result.");
  const actualFingerWidthMm =
    x.jointEdgeWidthMm /
    Math.max(1, Math.round(x.jointEdgeWidthMm / x.targetFingerWidthMm));
  if (!Number.isFinite(actualFingerWidthMm))
    simpleError("actualFingerWidthMm", "The inputs produce an invalid result.");
  return {
    fingerCount: Object.is(fingerCount, -0) ? 0 : fingerCount,
    actualFingerWidthMm: Object.is(actualFingerWidthMm, -0)
      ? 0
      : actualFingerWidthMm,
  };
};

export const example = {
  input: { jointEdgeWidthMm: 100, targetFingerWidthMm: 10 },
  output: { fingerCount: 10, actualFingerWidthMm: 10 },
} satisfies ToolExample<FingerJointCountInput, FingerJointCountOutput>;

export const tool = createSimpleTool({
  id: "carpentry/finger-joint-count",
  title: "Finger Joint Count",
  description:
    "Choose the nearest positive integer finger count to a target finger width over a measured joint edge.",
  inputs: [
    {
      id: "jointEdgeWidthMm",
      kind: "number",
      label: "Board edge width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "targetFingerWidthMm",
      kind: "number",
      label: "Target finger width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "fingerCount", kind: "integer", label: "Nearest finger count" },
    {
      id: "actualFingerWidthMm",
      kind: "number",
      label: "Actual equal finger width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateFingerJointCount({
      jointEdgeWidthMm: input.jointEdgeWidthMm as number,
      targetFingerWidthMm: input.targetFingerWidthMm as number,
    }),
});
export const fingerJointCountTool = tool;
export const runFingerJointCount = tool.execute;
export default tool;
