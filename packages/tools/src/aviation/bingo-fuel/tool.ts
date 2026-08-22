import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BingoFuelInput = {
  readonly reserveFuelKg: number;
  readonly transitFuelKg: number;
};

export type BingoFuelOutput = {
  readonly bingoFuelKg: number;
};

export const bingoFuelExample = {
  input: { reserveFuelKg: 1000, transitFuelKg: 3500 },
  output: { bingoFuelKg: 4500 },
} satisfies ToolExample<BingoFuelInput, BingoFuelOutput>;

export const calculateBingoFuel = (input: BingoFuelInput): BingoFuelOutput => {
  if (input.transitFuelKg < 0)
    simpleError(
      "transitFuelKg",
      "The transit fuel cannot be negative.",
      "invalid_fuel",
    );
  if (input.reserveFuelKg < 0)
    simpleError(
      "reserveFuelKg",
      "The reserve fuel cannot be negative.",
      "invalid_fuel",
    );
  return { bingoFuelKg: input.transitFuelKg + input.reserveFuelKg };
};

export const bingoFuelTool = createSimpleTool({
  calculate: (input) => calculateBingoFuel(input as unknown as BingoFuelInput),
  description:
    "Compute the bingo fuel state by adding the transit requirement to the reserve.",
  id: "aviation/bingo-fuel",
  inputs: [
    {
      description: "Fuel needed to reach the recovery point.",
      id: "transitFuelKg",
      kind: "number",
      label: "Transit fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Fuel to keep in reserve at arrival.",
      id: "reserveFuelKg",
      kind: "number",
      label: "Reserve fuel",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Minimum fuel state before diverting immediately.",
      format: "weight-kg",
      id: "bingoFuelKg",
      kind: "number",
      label: "Bingo fuel",
      unit: "kg",
    },
  ],
  title: "Bingo Fuel Calculator",
});
export const runBingoFuel = bingoFuelTool.execute;
export default bingoFuelTool;
