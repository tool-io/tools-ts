import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RoofPitchAngleInput = Readonly<{
  readonly riseM: number;
  readonly runM: number;
}>;
export type RoofPitchAngleOutput = Readonly<{
  readonly angleDegrees: number;
}>;

export const calculateRoofPitchAngle = (
  x: RoofPitchAngleInput,
): RoofPitchAngleOutput => {
  if (!Number.isFinite(x.riseM) || x.riseM < 0)
    simpleError("riseM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.runM) || x.runM < 0)
    simpleError("runM", "Provide a finite number at least 0.");
  if (!(x.runM > 0)) simpleError("runM", "Run must be positive.");
  const angleDegrees = (Math.atan2(x.riseM, x.runM) * 180) / Math.PI;
  if (!Number.isFinite(angleDegrees))
    simpleError("angleDegrees", "The inputs produce an invalid result.");
  return { angleDegrees: Object.is(angleDegrees, -0) ? 0 : angleDegrees };
};

export const example = {
  input: { riseM: 1, runM: 2 },
  output: { angleDegrees: 26.56505117707799 },
} satisfies ToolExample<RoofPitchAngleInput, RoofPitchAngleOutput>;

export const tool = createSimpleTool({
  id: "construction/roof-pitch-angle",
  title: "Roof Pitch Angle",
  description:
    "Calculate a roof slope angle from vertical rise and horizontal run, not the rafter length.",
  inputs: [
    {
      id: "riseM",
      kind: "number",
      label: "Vertical rise",
      unit: "m",
      minimum: 0,
    },
    {
      id: "runM",
      kind: "number",
      label: "Horizontal run",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "angleDegrees",
      kind: "number",
      label: "Roof pitch angle",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateRoofPitchAngle({
      riseM: input.riseM as number,
      runM: input.runM as number,
    }),
});
export const roofPitchAngleTool = tool;
export const runRoofPitchAngle = tool.execute;
export default tool;
