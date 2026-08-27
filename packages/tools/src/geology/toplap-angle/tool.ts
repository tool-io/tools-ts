import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ToplapAngleInput = {
  readonly strataDipDeg: number;
  readonly upperSurfaceDipDeg: number;
};

export type ToplapAngleOutput = {
  readonly toplapAngleDeg: number;
};

export const calculateToplapAngle = (
  input: ToplapAngleInput,
): ToplapAngleOutput => {
  const { strataDipDeg, upperSurfaceDipDeg } = input;
  for (const [value, field] of [
    [strataDipDeg, "strataDipDeg"],
    [upperSurfaceDipDeg, "upperSurfaceDipDeg"],
  ] as const) {
    if (!(value >= 0 && value <= 90))
      simpleError(
        field,
        "Dips must be between 0 and 90 degrees.",
        "invalid_dip",
      );
  }
  return {
    toplapAngleDeg: Math.abs(strataDipDeg - upperSurfaceDipDeg),
  };
};

export const toplapAngleExample = {
  input: { strataDipDeg: 4, upperSurfaceDipDeg: 0.3 },
  output: { toplapAngleDeg: 3.7 },
} satisfies ToolExample<ToplapAngleInput, ToplapAngleOutput>;

export const toplapAngleTool = createSimpleTool({
  id: "geology/toplap-angle",
  title: "Toplap Angle Calculator",
  description:
    "Angle between initially inclined strata and the nearly horizontal upper surface beneath which they toplap: |dip(strata) - dip(upper surface)|, assuming comparable dip directions.",
  inputs: [
    {
      description: "Dip of the inclined (foreset/clinoform) strata in degrees.",
      id: "strataDipDeg",
      kind: "number",
      label: "Strata dip",
    },
    {
      description: "Dip of the overlying termination surface in degrees.",
      id: "upperSurfaceDipDeg",
      kind: "number",
      label: "Upper surface dip",
    },
  ],
  outputs: [
    {
      description:
        "Toplap angle between strata and the upper surface in degrees.",
      id: "toplapAngleDeg",
      kind: "number",
      label: "Toplap angle",
    },
  ],
  calculate: (input) =>
    calculateToplapAngle(input as unknown as ToplapAngleInput),
});

export const runToplapAngle = toplapAngleTool.execute;
export default toplapAngleTool;
