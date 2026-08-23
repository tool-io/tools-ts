import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SheetResistanceInput = {
  readonly donorDopingPerCm3: number;
  readonly filmThicknessUm: number;
};

export type SheetResistanceOutput = {
  readonly sheetResistanceOhmPerSq: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
/** Electron mobility at moderate doping, cm²/V·s. Assumed constant for this sheet model. */
const MU_N_CM2_PER_VS = 1200;

export const sheetResistanceExample = {
  input: { donorDopingPerCm3: 1e16, filmThicknessUm: 1 },
  output: { sheetResistanceOhmPerSq: 5201.257562050636 },
} satisfies ToolExample<SheetResistanceInput, SheetResistanceOutput>;

export const calculateSheetResistance = (
  input: SheetResistanceInput,
): SheetResistanceOutput => {
  if (!Number.isFinite(input.donorDopingPerCm3) || input.donorDopingPerCm3 <= 0)
    simpleError(
      "donorDopingPerCm3",
      "Donor doping must be a finite positive number.",
      "invalid_donor_doping",
    );
  if (!Number.isFinite(input.filmThicknessUm) || input.filmThicknessUm <= 0)
    simpleError(
      "filmThicknessUm",
      "Film thickness must be a finite positive number.",
      "invalid_thickness",
    );
  // ρ = 1/(q·μn·N); Rs = ρ/t; t in µm → ×1e-4 for cm.
  const resistivity =
    1 / (ELEMENTARY_CHARGE_C * MU_N_CM2_PER_VS * input.donorDopingPerCm3);
  if (!Number.isFinite(resistivity))
    simpleError(
      "donorDopingPerCm3",
      "Resistivity could not be calculated due to numeric overflow.",
      "numeric_overflow",
    );
  const sheetResistanceOhmPerSq = resistivity / (input.filmThicknessUm * 1e-4);
  if (!Number.isFinite(sheetResistanceOhmPerSq) || sheetResistanceOhmPerSq <= 0)
    simpleError(
      "filmThicknessUm",
      "Sheet resistance is outside the positive finite numeric range.",
      "numeric_range",
    );
  return {
    sheetResistanceOhmPerSq,
  };
};

export const sheetResistanceTool = createSimpleTool({
  calculate: (input) =>
    calculateSheetResistance({
      donorDopingPerCm3: input.donorDopingPerCm3 as number,
      filmThicknessUm: input.filmThicknessUm as number,
    }),
  description:
    "Compute the sheet resistance of a uniformly doped silicon film assuming constant electron mobility.",
  id: "semiconductor/sheet-resistance",
  inputs: [
    {
      description:
        "Uniform donor concentration in the film. Must be greater than 0 cm^-3.",
      format: "density-per-cm3",
      id: "donorDopingPerCm3",
      kind: "number",
      label: "Donor doping",
      minimum: Number.MIN_VALUE,
      unit: "cm^-3",
    },
    {
      description: "Film thickness. Must be greater than 0 µm.",
      format: "length-um",
      id: "filmThicknessUm",
      kind: "number",
      label: "Thickness",
      minimum: Number.MIN_VALUE,
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Sheet resistance in ohms per square.",
      format: "resistance-ohm-per-sq",
      id: "sheetResistanceOhmPerSq",
      kind: "number",
      label: "Sheet resistance",
      minimum: Number.MIN_VALUE,
      unit: "Ω/sq",
    },
  ],
  title: "Doped Silicon Sheet Resistance Calculator",
});
export const runSheetResistance = sheetResistanceTool.execute;
export default sheetResistanceTool;
