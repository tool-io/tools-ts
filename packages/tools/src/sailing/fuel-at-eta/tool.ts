import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelAtEtaInput = {
  readonly burnLitersPerHour: number;
  readonly etaHours: number;
};

export type FuelAtEtaOutput = {
  readonly fuelUsedLiters: number;
};

export const calculateFuelAtEta = (
  input: FuelAtEtaInput,
): FuelAtEtaOutput | null =>
  Number.isFinite(input.burnLitersPerHour) &&
  Number.isFinite(input.etaHours) &&
  input.burnLitersPerHour >= 0 &&
  input.etaHours >= 0
    ? { fuelUsedLiters: input.burnLitersPerHour * input.etaHours }
    : null;

export const fuelAtEtaExample = {
  input: { burnLitersPerHour: 4.5, etaHours: 2 },
  output: { fuelUsedLiters: 9 },
} satisfies ToolExample<FuelAtEtaInput, FuelAtEtaOutput>;

export const fuelAtEtaTool = createSimpleTool({
  id: "sailing/fuel-at-eta",
  title: "Fuel At ETA Calculator",
  description:
    "Compute the liters of fuel burned by the time of arrival as the burn rate in liters per hour times the ETA in hours.",
  inputs: [
    {
      description: "Fuel consumption at cruising output.",
      id: "burnLitersPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "L/h",
    },
    {
      description: "Hours until arrival at the destination.",
      id: "etaHours",
      kind: "number",
      label: "ETA",
      minimum: 0,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Fuel consumed by the estimated time of arrival.",
      format: "volume-l",
      id: "fuelUsedLiters",
      kind: "number",
      label: "Fuel used",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const fuelUsedLiters = calculateFuelAtEta(
      input as unknown as FuelAtEtaInput,
    );
    if (fuelUsedLiters === null)
      simpleError(
        "burnLitersPerHour",
        "The burn rate and ETA must be finite and not negative.",
        "invalid_value",
      );
    return fuelUsedLiters;
  },
});

export const runFuelAtEta = fuelAtEtaTool.execute;
export default fuelAtEtaTool;
