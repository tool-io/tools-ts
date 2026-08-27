import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnconformityAngleInput = {
  readonly overlyingDipDeg: number;
  readonly underlyingDipDeg: number;
};

export type UnconformityAngleOutput = {
  readonly unconformityAngleDeg: number;
};

export const calculateUnconformityAngle = (
  input: UnconformityAngleInput,
): UnconformityAngleOutput => {
  const { overlyingDipDeg, underlyingDipDeg } = input;
  for (const [value, field] of [
    [overlyingDipDeg, "overlyingDipDeg"],
    [underlyingDipDeg, "underlyingDipDeg"],
  ] as const) {
    if (!(value >= 0 && value <= 90))
      simpleError(
        field,
        "Dips must be between 0 and 90 degrees.",
        "invalid_dip",
      );
  }
  return {
    unconformityAngleDeg: Math.abs(overlyingDipDeg - underlyingDipDeg),
  };
};

export const unconformityAngleExample = {
  input: { overlyingDipDeg: 18, underlyingDipDeg: 42 },
  output: { unconformityAngleDeg: 24 },
} satisfies ToolExample<UnconformityAngleInput, UnconformityAngleOutput>;

export const unconformityAngleTool = createSimpleTool({
  id: "geology/unconformity-angle",
  title: "Unconformity Angle Calculator",
  description:
    "Angular discordance across an unconformity: the absolute difference between dip of beds above and dip of beds below, assuming comparable dip directions.",
  inputs: [
    {
      description: "Dip of strata above the unconformity in degrees.",
      id: "overlyingDipDeg",
      kind: "number",
      label: "Overlying dip",
    },
    {
      description: "Dip of strata below the unconformity in degrees.",
      id: "underlyingDipDeg",
      kind: "number",
      label: "Underlying dip",
    },
  ],
  outputs: [
    {
      description: "Angular discordance across the unconformity in degrees.",
      id: "unconformityAngleDeg",
      kind: "number",
      label: "Discordance",
    },
  ],
  calculate: (input) =>
    calculateUnconformityAngle(input as unknown as UnconformityAngleInput),
});

export const runUnconformityAngle = unconformityAngleTool.execute;
export default unconformityAngleTool;
