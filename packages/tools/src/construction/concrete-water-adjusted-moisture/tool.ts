import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteWaterAdjustedMoistureInput = Readonly<{
  readonly targetMixingWaterKg: number;
  readonly aggregateOvenDryMassKg: number;
  readonly totalMoisturePercent: number;
  readonly absorptionPercent: number;
}>;
export type ConcreteWaterAdjustedMoistureOutput = Readonly<{
  waterToAddKg: number;
}>;

export const calculateConcreteWaterAdjustedMoisture = (
  i: ConcreteWaterAdjustedMoistureInput,
): ConcreteWaterAdjustedMoistureOutput => {
  if (
    i.targetMixingWaterKg -
      (i.aggregateOvenDryMassKg *
        (i.totalMoisturePercent - i.absorptionPercent)) /
        100 <
    0
  )
    simpleError(
      "targetMixingWaterKg",
      "Free aggregate water exceeds target mixing water.",
    );
  const value =
    i.targetMixingWaterKg -
    (i.aggregateOvenDryMassKg *
      (i.totalMoisturePercent - i.absorptionPercent)) /
      100;
  if (!Number.isFinite(value))
    simpleError("waterToAddKg", "The inputs produce a non-finite result.");
  return { waterToAddKg: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    targetMixingWaterKg: 180,
    aggregateOvenDryMassKg: 1000,
    totalMoisturePercent: 3,
    absorptionPercent: 1,
  },
  output: { waterToAddKg: 160 },
} satisfies ToolExample<
  ConcreteWaterAdjustedMoistureInput,
  ConcreteWaterAdjustedMoistureOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-water-adjusted-moisture",
  title: "Concrete Water Adjusted For Moisture",
  description:
    "Adjust added mixing water for aggregate free moisture relative to SSD, using moisture and absorption percentages on oven-dry aggregate mass.",
  inputs: [
    {
      id: "targetMixingWaterKg",
      kind: "number",
      label: "Target Mixing Water (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "aggregateOvenDryMassKg",
      kind: "number",
      label: "Aggregate Oven Dry Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "totalMoisturePercent",
      kind: "number",
      label: "Total Moisture (%)",
      unit: "%",
      minimum: 0,
    },
    {
      id: "absorptionPercent",
      kind: "number",
      label: "Absorption (%)",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "waterToAddKg",
      kind: "number",
      label: "Water To Add (kg)",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateConcreteWaterAdjustedMoisture({
      targetMixingWaterKg: input.targetMixingWaterKg as number,
      aggregateOvenDryMassKg: input.aggregateOvenDryMassKg as number,
      totalMoisturePercent: input.totalMoisturePercent as number,
      absorptionPercent: input.absorptionPercent as number,
    }),
});
export const concreteWaterAdjustedMoistureTool = tool;
export const runConcreteWaterAdjustedMoisture = tool.execute;
export default tool;
