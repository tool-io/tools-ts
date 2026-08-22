import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FuelPerNmInput = {
  readonly fuelFlowLitersPerHour: number;
  readonly groundSpeedKt: number;
};

export type FuelPerNmOutput = {
  readonly litersPerNm: number;
};

export const fuelPerNmExample = {
  input: { fuelFlowLitersPerHour: 40, groundSpeedKt: 120 },
  output: { litersPerNm: 0.333333333333 },
} satisfies ToolExample<FuelPerNmInput, FuelPerNmOutput>;

export const calculateFuelPerNm = (input: FuelPerNmInput): FuelPerNmOutput => {
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be positive.",
      "invalid_speed",
    );
  if (input.fuelFlowLitersPerHour < 0)
    simpleError(
      "fuelFlowLitersPerHour",
      "The fuel flow cannot be negative.",
      "invalid_flow",
    );
  return {
    litersPerNm: roundStatistic(
      input.fuelFlowLitersPerHour / input.groundSpeedKt,
    ),
  };
};

export const fuelPerNmTool = createSimpleTool({
  calculate: (input) => calculateFuelPerNm(input as unknown as FuelPerNmInput),
  description:
    "Compute the fuel burned per nautical mile from the hourly flow and ground speed.",
  id: "aviation/fuel-per-nm",
  inputs: [
    {
      description: "Fuel consumption rate.",
      id: "fuelFlowLitersPerHour",
      kind: "number",
      label: "Fuel flow",
      unit: "L/h",
    },
    {
      description: "Ground speed over the route.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Fuel burned per nautical mile.",
      format: "volume-l",
      id: "litersPerNm",
      kind: "number",
      label: "Fuel per nm",
      unit: "L/nm",
    },
  ],
  title: "Fuel Per Nautical Mile Calculator",
});
export const runFuelPerNm = fuelPerNmTool.execute;
export default fuelPerNmTool;
