import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiversionFuelInput = {
  readonly approachAllowanceKg?: number;
  readonly burnRateKgPerHour: number;
  readonly distanceNm: number;
  readonly groundSpeedKt: number;
};

export type DiversionFuelOutput = {
  readonly diversionFuelKg: number;
};

const DEFAULT_APPROACH_ALLOWANCE_KG = 200;

export const diversionFuelExample = {
  input: {
    approachAllowanceKg: 250,
    burnRateKgPerHour: 2400,
    distanceNm: 200,
    groundSpeedKt: 400,
  },
  output: { diversionFuelKg: 1450 },
} satisfies ToolExample<DiversionFuelInput, DiversionFuelOutput>;

export const calculateDiversionFuel = (
  input: DiversionFuelInput,
): DiversionFuelOutput => {
  const allowance = input.approachAllowanceKg ?? DEFAULT_APPROACH_ALLOWANCE_KG;
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The diversion distance must be positive.",
      "invalid_distance",
    );
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be positive.",
      "invalid_speed",
    );
  if (input.burnRateKgPerHour <= 0)
    simpleError(
      "burnRateKgPerHour",
      "The burn rate must be positive.",
      "invalid_rate",
    );
  if (allowance < 0)
    simpleError(
      "approachAllowanceKg",
      "The approach allowance cannot be negative.",
      "invalid_allowance",
    );
  return {
    diversionFuelKg:
      (input.distanceNm / input.groundSpeedKt) * input.burnRateKgPerHour +
      allowance,
  };
};

export const diversionFuelTool = createSimpleTool({
  calculate: (input) =>
    calculateDiversionFuel(input as unknown as DiversionFuelInput),
  description:
    "Compute the fuel needed to divert a given distance plus an approach and landing allowance.",
  id: "aviation/diversion-fuel",
  inputs: [
    {
      description: "Distance to the diversion airport.",
      id: "distanceNm",
      kind: "number",
      label: "Diversion distance",
      unit: "nm",
    },
    {
      description: "Expected ground speed to the diversion airport.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
    {
      description: "Average fuel consumption rate.",
      id: "burnRateKgPerHour",
      kind: "number",
      label: "Burn rate",
      unit: "kg/h",
    },
    {
      default: 200,
      description:
        "Extra fuel for the approach, one missed approach, and landing.",
      id: "approachAllowanceKg",
      kind: "number",
      label: "Approach allowance",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Total fuel required to divert and land.",
      format: "weight-kg",
      id: "diversionFuelKg",
      kind: "number",
      label: "Diversion fuel",
      unit: "kg",
    },
  ],
  title: "Diversion Fuel Calculator",
});
export const runDiversionFuel = diversionFuelTool.execute;
export default diversionFuelTool;
