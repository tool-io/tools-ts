import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificRangeInput = {
  readonly trueAirspeedKt: number;
  readonly fuelFlowKgPerHour: number;
};

export type SpecificRangeOutput = {
  readonly nauticalMilesPerKg: number;
};

export const specificRangeExample = {
  input: { fuelFlowKgPerHour: 1500, trueAirspeedKt: 450 },
  output: { nauticalMilesPerKg: 0.3 },
} satisfies ToolExample<SpecificRangeInput, SpecificRangeOutput>;

export const calculateSpecificRange = (
  input: SpecificRangeInput,
): SpecificRangeOutput => {
  if (input.trueAirspeedKt <= 0)
    simpleError(
      "trueAirspeedKt",
      "True airspeed must be greater than zero.",
      "invalid_true_airspeed",
    );
  if (input.fuelFlowKgPerHour <= 0)
    simpleError(
      "fuelFlowKgPerHour",
      "Fuel flow must be greater than zero.",
      "invalid_fuel_flow",
    );
  return {
    nauticalMilesPerKg: input.trueAirspeedKt / input.fuelFlowKgPerHour,
  };
};

export const specificRangeTool = createSimpleTool({
  calculate: (input) =>
    calculateSpecificRange({
      fuelFlowKgPerHour: input.fuelFlowKgPerHour as number,
      trueAirspeedKt: input.trueAirspeedKt as number,
    }),
  description:
    "Compute the specific range as nauticalMilesPerKg = trueAirspeedKt / fuelFlowKgPerHour.",
  id: "aviation/specific-range",
  inputs: [
    {
      description: "True airspeed of the aircraft.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "True airspeed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Total fuel flow for all engines.",
      id: "fuelFlowKgPerHour",
      kind: "number",
      label: "Fuel flow",
      minimum: 0,
      unit: "kg/h",
    },
  ],
  outputs: [
    {
      description: "Distance flown per kilogram of fuel burned.",
      id: "nauticalMilesPerKg",
      kind: "number",
      label: "Specific range",
      unit: "nm/kg",
    },
  ],
  title: "Specific Range Calculator",
});
export const runSpecificRange = specificRangeTool.execute;
export default specificRangeTool;
