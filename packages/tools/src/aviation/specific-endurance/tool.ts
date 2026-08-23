import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificEnduranceInput = {
  readonly fuelFlowKgPerHour: number;
};

export type SpecificEnduranceOutput = {
  readonly enduranceHoursPerKg: number;
};

export const specificEnduranceExample = {
  input: { fuelFlowKgPerHour: 500 },
  output: { enduranceHoursPerKg: 0.002 },
} satisfies ToolExample<SpecificEnduranceInput, SpecificEnduranceOutput>;

export const calculateSpecificEndurance = (
  input: SpecificEnduranceInput,
): SpecificEnduranceOutput => {
  if (input.fuelFlowKgPerHour <= 0)
    simpleError(
      "fuelFlowKgPerHour",
      "Fuel flow must be greater than zero.",
      "invalid_fuel_flow",
    );
  return { enduranceHoursPerKg: 1 / input.fuelFlowKgPerHour };
};

export const specificEnduranceTool = createSimpleTool({
  calculate: (input) =>
    calculateSpecificEndurance(input as unknown as SpecificEnduranceInput),
  description:
    "Compute the specific endurance as enduranceHoursPerKg = 1 / fuelFlowKgPerHour.",
  id: "aviation/specific-endurance",
  inputs: [
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
      description: "Flight time sustained per kilogram of fuel.",
      id: "enduranceHoursPerKg",
      kind: "number",
      label: "Specific endurance",
      unit: "h/kg",
    },
  ],
  title: "Specific Endurance Calculator",
});
export const runSpecificEndurance = specificEnduranceTool.execute;
export default specificEnduranceTool;
