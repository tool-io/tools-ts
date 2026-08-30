import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BevelGearPitchAngleInput = Readonly<{
  readonly firstTeeth: number;
  readonly secondTeeth: number;
}>;
export type BevelGearPitchAngleOutput = Readonly<{
  readonly firstPitchDegrees: number;
}>;

export const calculateBevelGearPitchAngle = (
  x: BevelGearPitchAngleInput,
): BevelGearPitchAngleOutput => {
  if (!Number.isFinite(x.firstTeeth) || x.firstTeeth < 1)
    simpleError("firstTeeth", "Provide a positive integer.");
  if (!Number.isFinite(x.secondTeeth) || x.secondTeeth < 1)
    simpleError("secondTeeth", "Provide a positive integer.");
  if (!Number.isInteger(x.firstTeeth) || !Number.isInteger(x.secondTeeth))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const firstPitchDegrees =
    (Math.atan(x.firstTeeth / x.secondTeeth) * 180) / Math.PI;
  if (!Number.isFinite(firstPitchDegrees))
    simpleError(
      "firstPitchDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    firstPitchDegrees: Object.is(firstPitchDegrees, -0) ? 0 : firstPitchDegrees,
  };
};

export const example = {
  input: { firstTeeth: 20, secondTeeth: 40 },
  output: { firstPitchDegrees: 26.56505117707799 },
} satisfies ToolExample<BevelGearPitchAngleInput, BevelGearPitchAngleOutput>;

export const tool = createSimpleTool({
  id: "engineering/bevel-gear-pitch-angle",
  title: "Bevel Gear Pitch Angle",
  description:
    "Pitch cone angle of the first straight bevel gear in a 90° intersecting-shaft pair: atan(z1/z2).",
  inputs: [
    { id: "firstTeeth", kind: "integer", label: "First Teeth", minimum: 1 },
    { id: "secondTeeth", kind: "integer", label: "Second Teeth", minimum: 1 },
  ],
  outputs: [
    {
      id: "firstPitchDegrees",
      kind: "number",
      label: "First Pitch Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateBevelGearPitchAngle({
      firstTeeth: input.firstTeeth as number,
      secondTeeth: input.secondTeeth as number,
    }),
});
export const bevelGearPitchAngleTool = tool;
export const runBevelGearPitchAngle = tool.execute;
export default tool;
