import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MiterAngleInput = Readonly<{
  readonly insideCornerDegrees: number;
}>;
export type MiterAngleOutput = Readonly<{
  readonly miterFromSquareDegrees: number;
}>;

export const calculateMiterAngle = (x: MiterAngleInput): MiterAngleOutput => {
  if (!Number.isFinite(x.insideCornerDegrees) || x.insideCornerDegrees < 0)
    simpleError("insideCornerDegrees", "Provide a finite number at least 0.");
  if (!(x.insideCornerDegrees > 0 && x.insideCornerDegrees < 180))
    simpleError(
      "insideCornerDegrees",
      "Corner angle must be between 0 and 180 degrees.",
    );
  const miterFromSquareDegrees = (180 - x.insideCornerDegrees) / 2;
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
  input: { insideCornerDegrees: 90 },
  output: { miterFromSquareDegrees: 45 },
} satisfies ToolExample<MiterAngleInput, MiterAngleOutput>;

export const tool = createSimpleTool({
  id: "carpentry/miter-angle",
  title: "Miter Angle",
  description:
    "Set equal miter angles for two pieces meeting at a measured inside corner; output is saw rotation away from a square cut.",
  inputs: [
    {
      id: "insideCornerDegrees",
      kind: "number",
      label: "Inside corner angle",
      unit: "°",
      minimum: 0,
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
    calculateMiterAngle({
      insideCornerDegrees: input.insideCornerDegrees as number,
    }),
});
export const miterAngleTool = tool;
export const runMiterAngle = tool.execute;
export default tool;
