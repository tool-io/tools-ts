import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ActivatedSludgeFmRatioInput = Readonly<{
  readonly flowCubicMetersPerDay: number;
  readonly influentBodMilligramsPerLiter: number;
  readonly aerationVolumeCubicMeters: number;
  readonly biomassMilligramsPerLiter: number;
}>;
export type ActivatedSludgeFmRatioOutput = Readonly<{
  readonly foodToMicroorganismPerDay: number;
}>;

export const calculateActivatedSludgeFmRatio = (
  x: ActivatedSludgeFmRatioInput,
): ActivatedSludgeFmRatioOutput => {
  if (!Number.isFinite(x.flowCubicMetersPerDay) || x.flowCubicMetersPerDay < 0)
    simpleError("flowCubicMetersPerDay", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.influentBodMilligramsPerLiter) ||
    x.influentBodMilligramsPerLiter < 0
  )
    simpleError(
      "influentBodMilligramsPerLiter",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.aerationVolumeCubicMeters) ||
    x.aerationVolumeCubicMeters < 0
  )
    simpleError(
      "aerationVolumeCubicMeters",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.biomassMilligramsPerLiter) ||
    x.biomassMilligramsPerLiter < 0
  )
    simpleError(
      "biomassMilligramsPerLiter",
      "Provide a finite number at least 0.",
    );
  const foodToMicroorganismPerDay =
    (x.flowCubicMetersPerDay * x.influentBodMilligramsPerLiter) /
    (x.aerationVolumeCubicMeters * x.biomassMilligramsPerLiter);
  if (!Number.isFinite(foodToMicroorganismPerDay))
    simpleError(
      "foodToMicroorganismPerDay",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    foodToMicroorganismPerDay: Object.is(foodToMicroorganismPerDay, -0)
      ? 0
      : foodToMicroorganismPerDay,
  };
};

export const example = {
  input: {
    flowCubicMetersPerDay: 1000,
    influentBodMilligramsPerLiter: 200,
    aerationVolumeCubicMeters: 1000,
    biomassMilligramsPerLiter: 2000,
  },
  output: { foodToMicroorganismPerDay: 0.1 },
} satisfies ToolExample<
  ActivatedSludgeFmRatioInput,
  ActivatedSludgeFmRatioOutput
>;

export const tool = createSimpleTool({
  id: "engineering/activated-sludge-fm-ratio",
  title: "Activated Sludge F/M Ratio",
  description:
    "Activated-sludge food-to-microorganism ratio Q·S0/(V·X) using matching influent substrate and biomass concentration units.",
  inputs: [
    {
      id: "flowCubicMetersPerDay",
      kind: "number",
      label: "Flow Cubic Meters Per Day",
      unit: "m³/day",
      minimum: 0,
    },
    {
      id: "influentBodMilligramsPerLiter",
      kind: "number",
      label: "Influent Bod Milligrams Per Liter",
      unit: "mg/L",
      minimum: 0,
    },
    {
      id: "aerationVolumeCubicMeters",
      kind: "number",
      label: "Aeration Volume Cubic Meters",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "biomassMilligramsPerLiter",
      kind: "number",
      label: "Biomass Milligrams Per Liter",
      unit: "mg/L",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "foodToMicroorganismPerDay",
      kind: "number",
      label: "Food To Microorganism Per Day",
      unit: "1/day",
    },
  ],
  calculate: (input) =>
    calculateActivatedSludgeFmRatio({
      flowCubicMetersPerDay: input.flowCubicMetersPerDay as number,
      influentBodMilligramsPerLiter:
        input.influentBodMilligramsPerLiter as number,
      aerationVolumeCubicMeters: input.aerationVolumeCubicMeters as number,
      biomassMilligramsPerLiter: input.biomassMilligramsPerLiter as number,
    }),
});
export const activatedSludgeFmRatioTool = tool;
export const runActivatedSludgeFmRatio = tool.execute;
export default tool;
