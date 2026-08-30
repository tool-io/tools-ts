import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InteriorAngleTwoBearingsInput = Readonly<{
  readonly firstAzimuthDegrees: number;
  readonly secondAzimuthDegrees: number;
}>;
export type InteriorAngleTwoBearingsOutput = Readonly<{
  readonly interiorAngleDegrees: number;
}>;

export const calculateInteriorAngleTwoBearings = (
  x: InteriorAngleTwoBearingsInput,
): InteriorAngleTwoBearingsOutput => {
  if (!Number.isFinite(x.firstAzimuthDegrees) || x.firstAzimuthDegrees < 0)
    simpleError("firstAzimuthDegrees", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.secondAzimuthDegrees) || x.secondAzimuthDegrees < 0)
    simpleError("secondAzimuthDegrees", "Provide a finite nonnegative number.");
  if (!(x.firstAzimuthDegrees < 360 && x.secondAzimuthDegrees < 360))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const interiorAngleDegrees = Math.abs(
    ((x.secondAzimuthDegrees - x.firstAzimuthDegrees + 540) % 360) - 180,
  );
  if (!Number.isFinite(interiorAngleDegrees))
    simpleError(
      "interiorAngleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    interiorAngleDegrees: Object.is(interiorAngleDegrees, -0)
      ? 0
      : interiorAngleDegrees,
  };
};

export const example = {
  input: {
    firstAzimuthDegrees: 20,
    secondAzimuthDegrees: 100,
  },
  output: { interiorAngleDegrees: 80 },
} satisfies ToolExample<
  InteriorAngleTwoBearingsInput,
  InteriorAngleTwoBearingsOutput
>;

export const tool = createSimpleTool({
  id: "cartography/interior-angle-two-bearings",
  title: "Interior Angle Two Bearings",
  description:
    "Smallest unsigned angle between two azimuth bearings in degrees.",
  inputs: [
    {
      id: "firstAzimuthDegrees",
      kind: "number",
      label: "First Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
    {
      id: "secondAzimuthDegrees",
      kind: "number",
      label: "Second Azimuth Degrees",
      unit: "deg",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "interiorAngleDegrees",
      kind: "number",
      label: "Interior Angle Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateInteriorAngleTwoBearings({
      firstAzimuthDegrees: input.firstAzimuthDegrees as number,
      secondAzimuthDegrees: input.secondAzimuthDegrees as number,
    }),
});
export const interiorAngleTwoBearingsTool = tool;
export const runInteriorAngleTwoBearings = tool.execute;
export default tool;
