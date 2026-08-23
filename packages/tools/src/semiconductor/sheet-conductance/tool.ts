import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SheetConductanceInput = {
  readonly donorDopingPerCm3: number;
  readonly filmThicknessUm: number;
};

export type SheetConductanceOutput = {
  readonly sheetConductanceSPerSq: number;
};

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
/** Electron mobility at moderate doping, cm²/V·s. Assumed constant for this sheet model. */
const MU_N_CM2_PER_VS = 1200;

export const sheetConductanceExample = {
  input: { donorDopingPerCm3: 1e16, filmThicknessUm: 1 },
  output: { sheetConductanceSPerSq: 0.00019226119608 },
} satisfies ToolExample<SheetConductanceInput, SheetConductanceOutput>;

export const calculateSheetConductance = (
  input: SheetConductanceInput,
): SheetConductanceOutput => {
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
  const conductivity =
    ELEMENTARY_CHARGE_C * MU_N_CM2_PER_VS * input.donorDopingPerCm3;
  if (!Number.isFinite(conductivity) || conductivity <= 0)
    simpleError(
      "donorDopingPerCm3",
      "Conductivity is outside the positive finite numeric range.",
      "numeric_range",
    );
  const sheetConductanceSPerSq = conductivity * (input.filmThicknessUm * 1e-4);
  if (!Number.isFinite(sheetConductanceSPerSq) || sheetConductanceSPerSq <= 0)
    simpleError(
      "filmThicknessUm",
      "Sheet conductance is outside the positive finite numeric range.",
      "numeric_range",
    );
  return {
    sheetConductanceSPerSq:
      sheetConductanceSPerSq === 0 ? 0 : sheetConductanceSPerSq,
  };
};

export const sheetConductanceTool = createSimpleTool({
  calculate: (input) =>
    calculateSheetConductance({
      donorDopingPerCm3: input.donorDopingPerCm3 as number,
      filmThicknessUm: input.filmThicknessUm as number,
    }),
  description:
    "Compute the sheet conductance of a uniformly doped silicon film assuming constant electron mobility.",
  id: "semiconductor/sheet-conductance",
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
      description: "Sheet conductance in siemens per square.",
      format: "conductance-s-per-sq",
      id: "sheetConductanceSPerSq",
      kind: "number",
      label: "Sheet conductance",
      minimum: Number.MIN_VALUE,
      unit: "S/sq",
    },
  ],
  title: "Doped Silicon Sheet Conductance Calculator",
});
export const runSheetConductance = sheetConductanceTool.execute;
export default sheetConductanceTool;
