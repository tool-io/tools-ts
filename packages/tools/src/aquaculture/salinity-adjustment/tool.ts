import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SalinityAdjustmentInput = Readonly<{
  readonly salinityIncreasePpt: number;
  readonly waterVolumeLiters: number;
}>;
export type SalinityAdjustmentOutput = Readonly<{
  readonly approximateSaltKilograms: number;
}>;

export const calculateSalinityAdjustment = (
  x: SalinityAdjustmentInput,
): SalinityAdjustmentOutput => {
  if (!Number.isFinite(x.salinityIncreasePpt) || x.salinityIncreasePpt < 0)
    simpleError("salinityIncreasePpt", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.waterVolumeLiters) || x.waterVolumeLiters < 0)
    simpleError("waterVolumeLiters", "Provide a finite nonnegative number.");
  const approximateSaltKilograms =
    (x.salinityIncreasePpt * x.waterVolumeLiters) / 1000;
  if (!Number.isFinite(approximateSaltKilograms))
    simpleError(
      "approximateSaltKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    approximateSaltKilograms: Object.is(approximateSaltKilograms, -0)
      ? 0
      : approximateSaltKilograms,
  };
};

export const example = {
  input: {
    salinityIncreasePpt: 5,
    waterVolumeLiters: 1000,
  },
  output: { approximateSaltKilograms: 5 },
} satisfies ToolExample<SalinityAdjustmentInput, SalinityAdjustmentOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/salinity-adjustment",
  title: "Salinity Adjustment",
  description:
    "Estimate added salt for a target ppt increase assuming water density near 1 kg/L; verify density and existing salinity.",
  inputs: [
    {
      id: "salinityIncreasePpt",
      kind: "number",
      label: "Salinity Increase Ppt",
      unit: "ppt",
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
      id: "approximateSaltKilograms",
      kind: "number",
      label: "Approximate Salt Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateSalinityAdjustment({
      salinityIncreasePpt: input.salinityIncreasePpt as number,
      waterVolumeLiters: input.waterVolumeLiters as number,
    }),
});
export const runSalinityAdjustment = tool.execute;
export default tool;
