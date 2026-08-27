import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShelfEdgeTrajectoryAngleInput = {
  readonly riseM: number;
  readonly runM: number;
};

export type ShelfEdgeTrajectoryAngleOutput = {
  readonly trajectoryAngleDeg: number;
};

export const calculateShelfEdgeTrajectoryAngle = (
  input: ShelfEdgeTrajectoryAngleInput,
): ShelfEdgeTrajectoryAngleOutput => {
  const { riseM, runM } = input;
  if (!(runM >= 0))
    simpleError(
      "runM",
      "Horizontal progradation distance must be non-negative.",
      "invalid_run",
    );
  if (riseM === 0 && runM === 0)
    simpleError(
      "riseM",
      "Rise and run cannot both be zero; the shelf edge has not migrated.",
      "invalid_trajectory",
    );
  return {
    trajectoryAngleDeg: (Math.atan2(riseM, runM) * 180) / Math.PI,
  };
};

export const shelfEdgeTrajectoryAngleExample = {
  input: { riseM: 180, runM: 3600 },
  output: { trajectoryAngleDeg: 2.8624052261117474 },
} satisfies ToolExample<
  ShelfEdgeTrajectoryAngleInput,
  ShelfEdgeTrajectoryAngleOutput
>;

export const shelfEdgeTrajectoryAngleTool = createSimpleTool({
  id: "geology/shelf-edge-trajectory-angle",
  title: "Shelf Edge Trajectory Angle Calculator",
  description:
    "Shelf-edge trajectory angle from vertical rise and horizontal run of shelf-edge migration: atan2(rise, run). Positive angles are aggradational, negative retrogradational.",
  inputs: [
    {
      description:
        "Vertical component of shelf-edge migration in metres (positive up, negative down).",
      id: "riseM",
      kind: "number",
      label: "Rise",
      unit: "m",
    },
    {
      description:
        "Horizontal progradation distance of the shelf edge in metres.",
      id: "runM",
      kind: "number",
      label: "Run",
      unit: "m",
    },
  ],
  outputs: [
    {
      description:
        "Shelf-edge trajectory angle in degrees from horizontal (-90 to +90).",
      id: "trajectoryAngleDeg",
      kind: "number",
      label: "Trajectory",
    },
  ],
  calculate: (input) =>
    calculateShelfEdgeTrajectoryAngle(
      input as unknown as ShelfEdgeTrajectoryAngleInput,
    ),
});

export const runShelfEdgeTrajectoryAngle = shelfEdgeTrajectoryAngleTool.execute;
export default shelfEdgeTrajectoryAngleTool;
