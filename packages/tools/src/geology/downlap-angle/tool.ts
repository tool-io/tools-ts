import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DownlapAngleInput = {
  readonly downlappingDipDeg: number;
  readonly basalSurfaceDipDeg: number;
};

export type DownlapAngleOutput = {
  readonly downlapAngleDeg: number;
};

export const calculateDownlapAngle = (
  input: DownlapAngleInput,
): DownlapAngleOutput => {
  const { downlappingDipDeg, basalSurfaceDipDeg } = input;
  for (const [value, field] of [
    [downlappingDipDeg, "downlappingDipDeg"],
    [basalSurfaceDipDeg, "basalSurfaceDipDeg"],
  ] as const) {
    if (!(value >= 0 && value <= 90))
      simpleError(
        field,
        "Dips must be between 0 and 90 degrees.",
        "invalid_dip",
      );
  }
  return {
    downlapAngleDeg: Math.abs(downlappingDipDeg - basalSurfaceDipDeg),
  };
};

export const downlapAngleExample = {
  input: { downlappingDipDeg: 5, basalSurfaceDipDeg: 0.5 },
  output: { downlapAngleDeg: 4.5 },
} satisfies ToolExample<DownlapAngleInput, DownlapAngleOutput>;

export const downlapAngleTool = createSimpleTool({
  id: "geology/downlap-angle",
  title: "Downlap Angle Calculator",
  description:
    "Angle between downsloping (progradational) strata and the older surface onto which they downlap: |dip(strata) - dip(basal surface)|, assuming comparable dip directions.",
  inputs: [
    {
      description: "Dip of the downsloping (clinoform) strata in degrees.",
      id: "downlappingDipDeg",
      kind: "number",
      label: "Strata dip",
    },
    {
      description: "Dip of the basal surface receiving downlap in degrees.",
      id: "basalSurfaceDipDeg",
      kind: "number",
      label: "Basal dip",
    },
  ],
  outputs: [
    {
      description: "Downlap angle between strata and basal surface in degrees.",
      id: "downlapAngleDeg",
      kind: "number",
      label: "Downlap angle",
    },
  ],
  calculate: (input) =>
    calculateDownlapAngle(input as unknown as DownlapAngleInput),
});

export const runDownlapAngle = downlapAngleTool.execute;
export default downlapAngleTool;
