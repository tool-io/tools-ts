import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ColdStabilizationChillInput = {
  readonly densityKgPerLiter: number;
  readonly endTemperatureC: number;
  readonly specificHeatKjPerKgK: number;
  readonly startTemperatureC: number;
  readonly volumeLiters: number;
};

export type ColdStabilizationChillOutput = {
  readonly energyKwh: number;
};

export const coldStabilizationChillExample = {
  input: {
    densityKgPerLiter: 0.99,
    endTemperatureC: -4,
    specificHeatKjPerKgK: 4,
    startTemperatureC: 15,
    volumeLiters: 1000,
  },
  output: {
    energyKwh: 20.9,
  },
} satisfies ToolExample<
  ColdStabilizationChillInput,
  ColdStabilizationChillOutput
>;

export const calculateColdStabilizationChill = (
  input: ColdStabilizationChillInput,
): ColdStabilizationChillOutput => {
  if (input.endTemperatureC >= input.startTemperatureC)
    simpleError(
      "endTemperatureC",
      "The target temperature must be below the starting temperature for a chilling calculation.",
      "invalid_value",
    );
  const deltaK = input.startTemperatureC - input.endTemperatureC;
  const kilojoules =
    input.volumeLiters *
    input.densityKgPerLiter *
    deltaK *
    input.specificHeatKjPerKgK;
  return {
    energyKwh: roundStatistic(kilojoules / 3600),
  };
};

export const coldStabilizationChillTool = createSimpleTool({
  calculate: (input) =>
    calculateColdStabilizationChill(
      input as unknown as ColdStabilizationChillInput,
    ),
  description:
    "Estimate the heat that must be removed to pull a wine lot down for cold stabilization from its mass and heat capacity; divide by the chiller's coefficient of performance to get electrical energy.",
  id: "oenology/cold-stabilization-chill",
  inputs: [
    {
      description: "Measured or assumed wine density.",
      id: "densityKgPerLiter",
      kind: "number",
      label: "Wine density",
      minimum: 0.000001,
      unit: "kg/L",
    },
    {
      description: "Holding temperature for tartrate precipitation.",
      id: "endTemperatureC",
      kind: "number",
      label: "Target temperature",
      unit: "°C",
    },
    {
      description: "Specific heat capacity used for the wine lot.",
      id: "specificHeatKjPerKgK",
      kind: "number",
      label: "Specific heat",
      minimum: 0.000001,
      unit: "kJ/kg·K",
    },
    {
      description: "Temperature of the lot before chilling.",
      id: "startTemperatureC",
      kind: "number",
      label: "Starting temperature",
      unit: "°C",
    },
    {
      description: "Volume of wine to chill.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "L",
    },
  ],
  outputs: [
    {
      description:
        "Heat removed from the lot (Q = mcΔT, sensible heat only), expressed as kWh of thermal energy; divide by the chiller COP for the electrical energy consumed.",
      id: "energyKwh",
      kind: "number",
      label: "Heat removed",
      unit: "kWh",
    },
  ],
  title: "Cold Stabilization Chill Requirement Calculator",
});
export const runColdStabilizationChill = coldStabilizationChillTool.execute;
export default coldStabilizationChillTool;
