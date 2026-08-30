import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HardnessAdjustmentInput = Readonly<{
  readonly hardnessIncreaseMgPerLiter: number;
  readonly waterVolumeLiters: number;
}>;
export type HardnessAdjustmentOutput = Readonly<{
  readonly caco3EquivalentKilograms: number;
}>;

export const calculateHardnessAdjustment = (
  x: HardnessAdjustmentInput,
): HardnessAdjustmentOutput => {
  if (
    !Number.isFinite(x.hardnessIncreaseMgPerLiter) ||
    x.hardnessIncreaseMgPerLiter < 0
  )
    simpleError(
      "hardnessIncreaseMgPerLiter",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.waterVolumeLiters) || x.waterVolumeLiters < 0)
    simpleError("waterVolumeLiters", "Provide a finite nonnegative number.");
  const caco3EquivalentKilograms =
    (x.hardnessIncreaseMgPerLiter * x.waterVolumeLiters) / 1e6;
  if (!Number.isFinite(caco3EquivalentKilograms))
    simpleError(
      "caco3EquivalentKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    caco3EquivalentKilograms: Object.is(caco3EquivalentKilograms, -0)
      ? 0
      : caco3EquivalentKilograms,
  };
};

export const example = {
  input: {
    hardnessIncreaseMgPerLiter: 50,
    waterVolumeLiters: 10000,
  },
  output: { caco3EquivalentKilograms: 0.5 },
} satisfies ToolExample<HardnessAdjustmentInput, HardnessAdjustmentOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/hardness-adjustment",
  title: "Hardness Adjustment",
  description:
    "Convert a desired hardness increase stated as mg/L CaCO3 to kilograms of CaCO3 equivalent. Actual product mass depends on its chemistry and purity.",
  inputs: [
    {
      id: "hardnessIncreaseMgPerLiter",
      kind: "number",
      label: "Hardness Increase Mg Per Liter",
      unit: "mg/L",
    },
    {
      id: "waterVolumeLiters",
      kind: "number",
      label: "Water Volume Liters",
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "caco3EquivalentKilograms",
      kind: "number",
      label: "CaCO3 Equivalent Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateHardnessAdjustment({
      hardnessIncreaseMgPerLiter: input.hardnessIncreaseMgPerLiter as number,
      waterVolumeLiters: input.waterVolumeLiters as number,
    }),
});
export const runHardnessAdjustment = tool.execute;
export default tool;
