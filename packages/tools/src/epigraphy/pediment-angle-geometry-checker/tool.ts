import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PedimentAngleGeometryCheckerInput = {
  readonly leftBaseAngleDeg: number;
  readonly rightBaseAngleDeg: number;
};

export type PedimentAngleGeometryCheckerOutput = {
  readonly apexAngleDeg: number;
  readonly angleSumDeg: number;
  readonly isValidTriangle: boolean;
};

export const calculatePedimentAngleGeometryChecker = (
  input: PedimentAngleGeometryCheckerInput,
): PedimentAngleGeometryCheckerOutput => {
  for (const key of ["leftBaseAngleDeg", "rightBaseAngleDeg"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Base angles must be greater than zero degrees.",
        "invalid_angle",
      );
  }
  if (input.leftBaseAngleDeg + input.rightBaseAngleDeg >= 180)
    return simpleError(
      "leftBaseAngleDeg",
      "Base angles must sum to less than 180 degrees.",
      "invalid_angle",
    );
  const apexAngleDeg = 180 - (input.leftBaseAngleDeg + input.rightBaseAngleDeg);
  return { apexAngleDeg, angleSumDeg: 180, isValidTriangle: true };
};

export const pedimentAngleGeometryCheckerExample = {
  input: { leftBaseAngleDeg: 18, rightBaseAngleDeg: 12 },
  output: { apexAngleDeg: 150, angleSumDeg: 180, isValidTriangle: true },
} satisfies ToolExample<
  PedimentAngleGeometryCheckerInput,
  PedimentAngleGeometryCheckerOutput
>;

export const pedimentAngleGeometryCheckerTool = createSimpleTool({
  id: "epigraphy/pediment-angle-geometry-checker",
  title: "Pediment Frame Triangle Angle Geometry Checker",
  description:
    "Check the raking geometry of a pediment frame triangle by deriving the apex angle from the two measured base angles.",
  inputs: [
    {
      description: "Left base corner angle in degrees.",
      id: "leftBaseAngleDeg",
      kind: "number",
      label: "Left base angle",
      minimum: 0,
    },
    {
      description: "Right base corner angle in degrees.",
      id: "rightBaseAngleDeg",
      kind: "number",
      label: "Right base angle",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Derived apex angle in degrees.",
      id: "apexAngleDeg",
      kind: "number",
      label: "Apex angle",
    },
    {
      description: "Total interior angle sum in degrees.",
      id: "angleSumDeg",
      kind: "number",
      label: "Angle sum",
    },
    {
      description: "Whether the three angles form a valid triangle.",
      id: "isValidTriangle",
      kind: "boolean",
      label: "Valid triangle",
    },
  ],
  calculate: (input) =>
    calculatePedimentAngleGeometryChecker(
      input as unknown as PedimentAngleGeometryCheckerInput,
    ),
});

export const runPedimentAngleGeometryChecker =
  pedimentAngleGeometryCheckerTool.execute;
export default pedimentAngleGeometryCheckerTool;
