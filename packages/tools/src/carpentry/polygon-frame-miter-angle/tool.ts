import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PolygonFrameMiterAngleInput = Readonly<{
  readonly sideCount: number;
}>;
export type PolygonFrameMiterAngleOutput = Readonly<{
  readonly miterFromSquareDegrees: number;
}>;

export const calculatePolygonFrameMiterAngle = (
  x: PolygonFrameMiterAngleInput,
): PolygonFrameMiterAngleOutput => {
  if (!Number.isSafeInteger(x.sideCount) || x.sideCount < 3)
    simpleError("sideCount", "Provide a safe integer at least 3.");
  if (!(x.sideCount >= 3))
    simpleError("sideCount", "A polygon needs at least three sides.");
  const miterFromSquareDegrees = 180 / x.sideCount;
  if (!Number.isFinite(miterFromSquareDegrees))
    simpleError(
      "miterFromSquareDegrees",
      "The inputs produce an invalid result.",
    );
  return {
    miterFromSquareDegrees: Object.is(miterFromSquareDegrees, -0)
      ? 0
      : miterFromSquareDegrees,
  };
};

export const example = {
  input: { sideCount: 6 },
  output: { miterFromSquareDegrees: 30 },
} satisfies ToolExample<
  PolygonFrameMiterAngleInput,
  PolygonFrameMiterAngleOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/polygon-frame-miter-angle",
  title: "Polygon Frame Miter Angle",
  description:
    "Find each saw miter angle from a square cut for a regular polygon frame with equal sides and interior angles.",
  inputs: [
    {
      id: "sideCount",
      kind: "integer",
      label: "Regular polygon sides",
      minimum: 3,
    },
  ],
  outputs: [
    {
      id: "miterFromSquareDegrees",
      kind: "number",
      label: "Each miter from square",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculatePolygonFrameMiterAngle({
      sideCount: input.sideCount as number,
    }),
});
export const polygonFrameMiterAngleTool = tool;
export const runPolygonFrameMiterAngle = tool.execute;
export default tool;
