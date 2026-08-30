import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BevelAngleInput = Readonly<{
  readonly riseMillimeters: number;
  readonly runMillimeters: number;
}>;
export type BevelAngleOutput = Readonly<{
  readonly angleDegrees: number;
}>;

export const calculateBevelAngle = (x: BevelAngleInput): BevelAngleOutput => {
  if (!Number.isFinite(x.riseMillimeters))
    simpleError("riseMillimeters", "Provide a finite number.");
  if (!Number.isFinite(x.runMillimeters) || x.runMillimeters < 0)
    simpleError("runMillimeters", "Provide a finite number at least 0.");
  if (x.riseMillimeters === 0 && x.runMillimeters === 0)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const angleDegrees =
    (Math.atan2(x.riseMillimeters, x.runMillimeters) * 180) / Math.PI;
  if (!Number.isFinite(angleDegrees))
    simpleError(
      "angleDegrees",
      "Inputs produce an undefined or non-finite result.",
    );
  return { angleDegrees: Object.is(angleDegrees, -0) ? 0 : angleDegrees };
};

export const example = {
  input: { riseMillimeters: 50, runMillimeters: 100 },
  output: { angleDegrees: 26.56505117707799 },
} satisfies ToolExample<BevelAngleInput, BevelAngleOutput>;

export const tool = createSimpleTool({
  id: "carpentry/bevel-angle",
  title: "Bevel Angle",
  description:
    "Bevel angle of a sloped cut from vertical rise and horizontal run in the same length unit; measured from the horizontal.",
  inputs: [
    {
      id: "riseMillimeters",
      kind: "number",
      label: "Rise Millimeters",
      unit: "mm",
    },
    {
      id: "runMillimeters",
      kind: "number",
      label: "Run Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "angleDegrees", kind: "number", label: "Angle Degrees", unit: "°" },
  ],
  calculate: (input) =>
    calculateBevelAngle({
      riseMillimeters: input.riseMillimeters as number,
      runMillimeters: input.runMillimeters as number,
    }),
});
export const bevelAngleTool = tool;
export const runBevelAngle = tool.execute;
export default tool;
