import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly currentAnnualEnergyTwh: number;
  readonly annualGrowthPercent: number;
  readonly forecastYears: number;
  readonly gridCapacityTwh: number;
}>;
export type Output = Readonly<{
  readonly forecastEnergyTwh: number;
  readonly capacityMarginTwh: number;
  readonly capacityUtilizationPercent: number;
  readonly withinCapacity: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.annualGrowthPercent <= -100 || input.gridCapacityTwh <= 0)
    simpleError(
      "annualGrowthPercent",
      "Growth must exceed -100% and capacity be positive.",
      "invalid_forecast",
    );
  const forecastEnergyTwh =
    input.currentAnnualEnergyTwh *
    (1 + input.annualGrowthPercent / 100) ** input.forecastYears;
  return {
    forecastEnergyTwh,
    capacityMarginTwh: input.gridCapacityTwh - forecastEnergyTwh,
    capacityUtilizationPercent:
      (forecastEnergyTwh / input.gridCapacityTwh) * 100,
    withinCapacity: forecastEnergyTwh <= input.gridCapacityTwh,
  };
};

export const exampleInput = {
  currentAnnualEnergyTwh: 100,
  annualGrowthPercent: 10,
  forecastYears: 2,
  gridCapacityTwh: 150,
} satisfies Input;
export const exampleOutput = {
  forecastEnergyTwh: 121.00000000000001,
  capacityMarginTwh: 28.999999999999986,
  capacityUtilizationPercent: 80.66666666666667,
  withinCapacity: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      currentAnnualEnergyTwh: input.currentAnnualEnergyTwh as number,
      annualGrowthPercent: input.annualGrowthPercent as number,
      forecastYears: input.forecastYears as number,
      gridCapacityTwh: input.gridCapacityTwh as number,
    }),
  description:
    "Forecast data-center power demand against supplied grid capacity.",
  id: "futurology/data-center-power-forecast",
  inputs: [
    {
      id: "currentAnnualEnergyTwh",
      label: "Current annual energy demand",
      kind: "number",
      minimum: 0,
      unit: "TWh",
    },
    {
      id: "annualGrowthPercent",
      label: "Annual demand growth",
      kind: "number",
      unit: "%",
    },
    {
      id: "forecastYears",
      label: "Forecast horizon",
      kind: "integer",
      minimum: 0,
      unit: "years",
    },
    {
      id: "gridCapacityTwh",
      label: "Available annual grid capacity",
      kind: "number",
      minimum: 0,
      unit: "TWh",
    },
  ],
  outputs: [
    {
      id: "forecastEnergyTwh",
      label: "Forecast annual energy demand",
      kind: "number",
      minimum: 0,
      unit: "TWh",
    },
    {
      id: "capacityMarginTwh",
      label: "Grid capacity margin",
      kind: "number",
      unit: "TWh",
    },
    {
      id: "capacityUtilizationPercent",
      label: "Capacity utilization",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "withinCapacity",
      label: "Within supplied capacity",
      kind: "boolean",
    },
  ],
  title: "Data-Center Power Forecast",
});

export const run = tool.execute;
export default tool;
