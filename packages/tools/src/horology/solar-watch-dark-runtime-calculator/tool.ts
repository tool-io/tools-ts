import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SolarDarkRuntimeInput = {
  readonly averageDailyConsumptionMilliampHours: number;
  readonly usableStoredEnergyMilliampHours: number;
};

export type SolarDarkRuntimeOutput = {
  readonly modeledDarkRuntimeDays: number;
  readonly modeledDarkRuntimeMonths: number;
  readonly productSpecificityCaution: string;
};

export const calculateSolarWatchDarkRuntime = (
  input: SolarDarkRuntimeInput,
): SolarDarkRuntimeOutput => {
  if (
    !Number.isFinite(input.usableStoredEnergyMilliampHours) ||
    input.usableStoredEnergyMilliampHours <= 0
  )
    simpleError(
      "usableStoredEnergyMilliampHours",
      "Usable stored energy must be finite and positive.",
      "stored_energy_invalid",
    );
  if (
    !Number.isFinite(input.averageDailyConsumptionMilliampHours) ||
    input.averageDailyConsumptionMilliampHours <= 0
  )
    simpleError(
      "averageDailyConsumptionMilliampHours",
      "Average daily consumption must be finite and positive.",
      "daily_consumption_invalid",
    );
  const modeledDarkRuntimeDays =
    input.usableStoredEnergyMilliampHours /
    input.averageDailyConsumptionMilliampHours;
  return {
    modeledDarkRuntimeDays,
    modeledDarkRuntimeMonths: modeledDarkRuntimeDays / 30.4375,
    productSpecificityCaution:
      "This is a capacity-to-load model. Real solar-watch autonomy depends on the cell, rechargeable cell, light exposure, temperature, features, and minimum operating voltage; use the caliber specification, not a universal month count.",
  };
};

export const solarDarkRuntimeExample = {
  input: {
    averageDailyConsumptionMilliampHours: 1,
    usableStoredEnergyMilliampHours: 180,
  },
  output: {
    modeledDarkRuntimeDays: 180,
    modeledDarkRuntimeMonths: 5.9137577002053385,
    productSpecificityCaution:
      "This is a capacity-to-load model. Real solar-watch autonomy depends on the cell, rechargeable cell, light exposure, temperature, features, and minimum operating voltage; use the caliber specification, not a universal month count.",
  },
} satisfies ToolExample<SolarDarkRuntimeInput, SolarDarkRuntimeOutput>;

export const solarDarkRuntimeTool = createSimpleTool({
  calculate: (input) =>
    calculateSolarWatchDarkRuntime({
      averageDailyConsumptionMilliampHours:
        input.averageDailyConsumptionMilliampHours as number,
      usableStoredEnergyMilliampHours:
        input.usableStoredEnergyMilliampHours as number,
    }),
  description:
    "Calculate dark runtime from caller-supplied usable stored energy and average daily consumption without asserting a universal solar-watch autonomy.",
  id: "horology/solar-watch-dark-runtime-calculator",
  inputs: [
    {
      id: "averageDailyConsumptionMilliampHours",
      kind: "number",
      label: "Average daily energy consumption",
      minimum: 0,
      unit: "mAh",
    },
    {
      id: "usableStoredEnergyMilliampHours",
      kind: "number",
      label: "Usable stored energy",
      minimum: 0,
      unit: "mAh",
    },
  ],
  outputs: [
    {
      id: "modeledDarkRuntimeDays",
      kind: "number",
      label: "Modeled dark runtime",
      minimum: 0,
      unit: "d",
    },
    {
      id: "modeledDarkRuntimeMonths",
      kind: "number",
      label: "Modeled dark runtime",
      minimum: 0,
      unit: "mean month",
    },
    {
      id: "productSpecificityCaution",
      kind: "string",
      label: "Product-specificity caution",
    },
  ],
  title: "Solar Watch Dark Runtime Calculator",
});

export const runSolarDarkRuntime = solarDarkRuntimeTool.execute;
export default solarDarkRuntimeTool;
