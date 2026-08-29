import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteAggregateVolumeInput = Readonly<{
  readonly targetVolumeCubicMeters: number;
  readonly cementMassKg: number;
  readonly cementDensityKgPerCubicMeter: number;
  readonly waterVolumeCubicMeters: number;
  readonly airVolumeCubicMeters: number;
}>;
export type ConcreteAggregateVolumeOutput = Readonly<{
  aggregateVolumeCubicMeters: number;
}>;

export const calculateConcreteAggregateVolume = (
  i: ConcreteAggregateVolumeInput,
): ConcreteAggregateVolumeOutput => {
  if (
    i.targetVolumeCubicMeters <
    i.cementMassKg / i.cementDensityKgPerCubicMeter +
      i.waterVolumeCubicMeters +
      i.airVolumeCubicMeters
  )
    simpleError(
      "targetVolumeCubicMeters",
      "Non-aggregate ingredient volumes exceed target volume.",
    );
  const value =
    i.targetVolumeCubicMeters -
    i.cementMassKg / i.cementDensityKgPerCubicMeter -
    i.waterVolumeCubicMeters -
    i.airVolumeCubicMeters;
  if (!Number.isFinite(value))
    simpleError(
      "aggregateVolumeCubicMeters",
      "The inputs produce a non-finite result.",
    );
  return { aggregateVolumeCubicMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    targetVolumeCubicMeters: 1,
    cementMassKg: 315,
    cementDensityKgPerCubicMeter: 3150,
    waterVolumeCubicMeters: 0.18,
    airVolumeCubicMeters: 0.04,
  },
  output: { aggregateVolumeCubicMeters: 0.6799999999999999 },
} satisfies ToolExample<
  ConcreteAggregateVolumeInput,
  ConcreteAggregateVolumeOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-aggregate-volume",
  title: "Concrete Aggregate Volume",
  description:
    "Calculate aggregate absolute volume as target concrete volume minus cement, water, and entrained-air volumes; supplied cement density must match the batch.",
  inputs: [
    {
      id: "targetVolumeCubicMeters",
      kind: "number",
      label: "Target Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "cementMassKg",
      kind: "number",
      label: "Cement Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "cementDensityKgPerCubicMeter",
      kind: "number",
      label: "Cement Density (kg/m³)",
      unit: "kg/m³",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "waterVolumeCubicMeters",
      kind: "number",
      label: "Water Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "airVolumeCubicMeters",
      kind: "number",
      label: "Air Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "aggregateVolumeCubicMeters",
      kind: "number",
      label: "Aggregate Volume (m³)",
      unit: "m³",
    },
  ],
  calculate: (input) =>
    calculateConcreteAggregateVolume({
      targetVolumeCubicMeters: input.targetVolumeCubicMeters as number,
      cementMassKg: input.cementMassKg as number,
      cementDensityKgPerCubicMeter:
        input.cementDensityKgPerCubicMeter as number,
      waterVolumeCubicMeters: input.waterVolumeCubicMeters as number,
      airVolumeCubicMeters: input.airVolumeCubicMeters as number,
    }),
});
export const concreteAggregateVolumeTool = tool;
export const runConcreteAggregateVolume = tool.execute;
export default tool;
