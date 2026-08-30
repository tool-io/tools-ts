import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TongueThicknessInput = Readonly<{
  readonly grooveWidthMm: number;
  readonly fitClearanceMm: number;
}>;
export type TongueThicknessOutput = Readonly<{
  readonly tongueThicknessMm: number;
}>;

export const calculateTongueThickness = (
  x: TongueThicknessInput,
): TongueThicknessOutput => {
  if (!Number.isFinite(x.grooveWidthMm) || x.grooveWidthMm < 0)
    simpleError("grooveWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.fitClearanceMm) || x.fitClearanceMm < 0)
    simpleError("fitClearanceMm", "Provide a finite number at least 0.");
  if (!(x.grooveWidthMm >= x.fitClearanceMm))
    simpleError("grooveWidthMm", "Groove width must cover clearance.");
  const tongueThicknessMm = x.grooveWidthMm - x.fitClearanceMm;
  if (!Number.isFinite(tongueThicknessMm))
    simpleError("tongueThicknessMm", "The inputs produce an invalid result.");
  return {
    tongueThicknessMm: Object.is(tongueThicknessMm, -0) ? 0 : tongueThicknessMm,
  };
};

export const example = {
  input: { grooveWidthMm: 8, fitClearanceMm: 0.2 },
  output: { tongueThicknessMm: 7.8 },
} satisfies ToolExample<TongueThicknessInput, TongueThicknessOutput>;

export const tool = createSimpleTool({
  id: "carpentry/tongue-thickness",
  title: "Tongue Thickness",
  description:
    "Find tongue thickness from mating groove width after subtracting an explicit total fit clearance.",
  inputs: [
    {
      id: "grooveWidthMm",
      kind: "number",
      label: "Groove width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "fitClearanceMm",
      kind: "number",
      label: "Total fit clearance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "tongueThicknessMm",
      kind: "number",
      label: "Tongue thickness",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateTongueThickness({
      grooveWidthMm: input.grooveWidthMm as number,
      fitClearanceMm: input.fitClearanceMm as number,
    }),
});
export const tongueThicknessTool = tool;
export const runTongueThickness = tool.execute;
export default tool;
