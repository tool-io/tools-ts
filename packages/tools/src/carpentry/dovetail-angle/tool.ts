import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DovetailAngleInput = Readonly<{
  readonly depthPerOffset: number;
}>;
export type DovetailAngleOutput = Readonly<{
  readonly angleFromEdgeDegrees: number;
}>;

export const calculateDovetailAngle = (
  x: DovetailAngleInput,
): DovetailAngleOutput => {
  if (!Number.isFinite(x.depthPerOffset) || x.depthPerOffset < 0)
    simpleError("depthPerOffset", "Provide a finite number at least 0.");
  if (!(x.depthPerOffset > 0))
    simpleError("depthPerOffset", "Slope ratio must be positive.");
  const angleFromEdgeDegrees =
    (Math.atan(1 / x.depthPerOffset) * 180) / Math.PI;
  if (!Number.isFinite(angleFromEdgeDegrees))
    simpleError(
      "angleFromEdgeDegrees",
      "The inputs produce an invalid result.",
    );
  return {
    angleFromEdgeDegrees: Object.is(angleFromEdgeDegrees, -0)
      ? 0
      : angleFromEdgeDegrees,
  };
};

export const example = {
  input: { depthPerOffset: 8 },
  output: { angleFromEdgeDegrees: 7.125016348901798 },
} satisfies ToolExample<DovetailAngleInput, DovetailAngleOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dovetail-angle",
  title: "Dovetail Angle",
  description:
    "Convert a traditional dovetail slope of one unit offset per N units depth into an angle measured from the board edge.",
  inputs: [
    {
      id: "depthPerOffset",
      kind: "number",
      label: "Dovetail slope N:1",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "angleFromEdgeDegrees",
      kind: "number",
      label: "Dovetail angle from edge",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateDovetailAngle({
      depthPerOffset: input.depthPerOffset as number,
    }),
});
export const dovetailAngleTool = tool;
export const runDovetailAngle = tool.execute;
export default tool;
