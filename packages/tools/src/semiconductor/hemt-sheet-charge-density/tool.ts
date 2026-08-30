import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HemtSheetChargeDensityInput = Readonly<{
  readonly sheetCarriersPerSquareMeter: number;
}>;
export type HemtSheetChargeDensityOutput = Readonly<{
  readonly chargeCoulombsPerSquareMeter: number;
}>;

export const calculateHemtSheetChargeDensity = (
  x: HemtSheetChargeDensityInput,
): HemtSheetChargeDensityOutput => {
  if (
    !Number.isFinite(x.sheetCarriersPerSquareMeter) ||
    x.sheetCarriersPerSquareMeter < 0
  )
    simpleError(
      "sheetCarriersPerSquareMeter",
      "Provide a finite number at least 0.",
    );
  const chargeCoulombsPerSquareMeter =
    1.602176634e-19 * x.sheetCarriersPerSquareMeter;
  if (!Number.isFinite(chargeCoulombsPerSquareMeter))
    simpleError(
      "chargeCoulombsPerSquareMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    chargeCoulombsPerSquareMeter: Object.is(chargeCoulombsPerSquareMeter, -0)
      ? 0
      : chargeCoulombsPerSquareMeter,
  };
};

export const example = {
  input: { sheetCarriersPerSquareMeter: 10000000000000000 },
  output: { chargeCoulombsPerSquareMeter: 0.001602176634 },
} satisfies ToolExample<
  HemtSheetChargeDensityInput,
  HemtSheetChargeDensityOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/hemt-sheet-charge-density",
  title: "Hemt Sheet Charge Density",
  description:
    "Two-dimensional HEMT electron-sheet charge magnitude from measured sheet carrier number density.",
  inputs: [
    {
      id: "sheetCarriersPerSquareMeter",
      kind: "number",
      label: "Sheet Carriers Per Square Meter",
      unit: "m⁻²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "chargeCoulombsPerSquareMeter",
      kind: "number",
      label: "Charge Coulombs Per Square Meter",
      unit: "C/m²",
    },
  ],
  calculate: (input) =>
    calculateHemtSheetChargeDensity({
      sheetCarriersPerSquareMeter: input.sheetCarriersPerSquareMeter as number,
    }),
});
export const hemtSheetChargeDensityTool = tool;
export const runHemtSheetChargeDensity = tool.execute;
export default tool;
