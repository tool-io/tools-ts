import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FieldOfViewAngleInput = Readonly<{
  readonly sceneWidthMeters: number;
  readonly distanceMeters: number;
}>;
export type FieldOfViewAngleOutput = Readonly<{
  readonly viewAngleDegrees: number;
}>;

export const calculateFieldOfViewAngle = (
  x: FieldOfViewAngleInput,
): FieldOfViewAngleOutput => {
  if (!Number.isFinite(x.sceneWidthMeters) || x.sceneWidthMeters < 0)
    simpleError("sceneWidthMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.distanceMeters) || x.distanceMeters < 0)
    simpleError("distanceMeters", "Provide a finite number at least 0.");
  const viewAngleDegrees =
    (2 * Math.atan(x.sceneWidthMeters / (2 * x.distanceMeters)) * 180) /
    Math.PI;
  if (!Number.isFinite(viewAngleDegrees))
    simpleError(
      "viewAngleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    viewAngleDegrees: Object.is(viewAngleDegrees, -0) ? 0 : viewAngleDegrees,
  };
};

export const example = {
  input: { sceneWidthMeters: 2, distanceMeters: 2 },
  output: { viewAngleDegrees: 53.13010235415598 },
} satisfies ToolExample<FieldOfViewAngleInput, FieldOfViewAngleOutput>;

export const tool = createSimpleTool({
  id: "film/field-of-view-angle",
  title: "Field Of View Angle",
  description:
    "Angle subtended by a scene width at a given camera-to-scene distance: 2atan(width/(2distance)).",
  inputs: [
    {
      id: "sceneWidthMeters",
      kind: "number",
      label: "Scene Width Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "distanceMeters",
      kind: "number",
      label: "Distance Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "viewAngleDegrees",
      kind: "number",
      label: "View Angle Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateFieldOfViewAngle({
      sceneWidthMeters: input.sceneWidthMeters as number,
      distanceMeters: input.distanceMeters as number,
    }),
});
export const fieldOfViewAngleTool = tool;
export const runFieldOfViewAngle = tool.execute;
export default tool;
