import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteSlumpWaterAdjustmentInput = Readonly<{
  readonly trialWaterLiters: number;
  readonly trialSlumpMm: number;
  readonly targetSlumpMm: number;
  readonly waterLitersPerMm: number;
}>;
export type ConcreteSlumpWaterAdjustmentOutput = Readonly<{
  revisedWaterLiters: number;
}>;

export const calculateConcreteSlumpWaterAdjustment = (
  i: ConcreteSlumpWaterAdjustmentInput,
): ConcreteSlumpWaterAdjustmentOutput => {
  if (
    i.trialWaterLiters +
      (i.targetSlumpMm - i.trialSlumpMm) * i.waterLitersPerMm <
    0
  )
    simpleError("targetSlumpMm", "Calibration predicts negative mixing water.");
  const value =
    i.trialWaterLiters +
    (i.targetSlumpMm - i.trialSlumpMm) * i.waterLitersPerMm;
  if (!Number.isFinite(value))
    simpleError(
      "revisedWaterLiters",
      "The inputs produce a non-finite result.",
    );
  return { revisedWaterLiters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    trialWaterLiters: 160,
    trialSlumpMm: 75,
    targetSlumpMm: 100,
    waterLitersPerMm: 0.2,
  },
  output: { revisedWaterLiters: 165 },
} satisfies ToolExample<
  ConcreteSlumpWaterAdjustmentInput,
  ConcreteSlumpWaterAdjustmentOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-slump-water-adjustment",
  title: "Concrete Slump Water Adjustment",
  description:
    "Estimate revised concrete mixing-water amount from a trial slump and a project-calibrated water change per millimeter of slump; do not treat this as a universal mix-design rule.",
  inputs: [
    {
      id: "trialWaterLiters",
      kind: "number",
      label: "Trial Water (L)",
      unit: "L",
      minimum: 0,
    },
    {
      id: "trialSlumpMm",
      kind: "number",
      label: "Trial slump (mm)",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "targetSlumpMm",
      kind: "number",
      label: "Target slump (mm)",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "waterLitersPerMm",
      kind: "number",
      label: "Water calibration (L/mm)",
      unit: "L/mm",
    },
  ],
  outputs: [
    {
      id: "revisedWaterLiters",
      kind: "number",
      label: "Revised Water (L)",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculateConcreteSlumpWaterAdjustment({
      trialWaterLiters: input.trialWaterLiters as number,
      trialSlumpMm: input.trialSlumpMm as number,
      targetSlumpMm: input.targetSlumpMm as number,
      waterLitersPerMm: input.waterLitersPerMm as number,
    }),
});
export const concreteSlumpWaterAdjustmentTool = tool;
export const runConcreteSlumpWaterAdjustment = tool.execute;
export default tool;
