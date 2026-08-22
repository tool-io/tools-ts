import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JokerFuelInput = {
  readonly bingoFuelKg: number;
  readonly plannedMarginKg: number;
};

export type JokerFuelOutput = {
  readonly jokerFuelKg: number;
};

export const jokerFuelExample = {
  input: { bingoFuelKg: 4500, plannedMarginKg: 500 },
  output: { jokerFuelKg: 5000 },
} satisfies ToolExample<JokerFuelInput, JokerFuelOutput>;

export const calculateJokerFuel = (input: JokerFuelInput): JokerFuelOutput => {
  if (input.bingoFuelKg < 0)
    simpleError(
      "bingoFuelKg",
      "The bingo fuel cannot be negative.",
      "invalid_fuel",
    );
  if (input.plannedMarginKg < 0)
    simpleError(
      "plannedMarginKg",
      "The planned margin cannot be negative.",
      "invalid_fuel",
    );
  return { jokerFuelKg: input.bingoFuelKg + input.plannedMarginKg };
};

export const jokerFuelTool = createSimpleTool({
  calculate: (input) => calculateJokerFuel(input as unknown as JokerFuelInput),
  description:
    "Compute the joker fuel state by adding a planned margin to the bingo fuel.",
  id: "aviation/joker-fuel",
  inputs: [
    {
      description: "Minimum fuel state before immediate diversion.",
      id: "bingoFuelKg",
      kind: "number",
      label: "Bingo fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Additional planned margin above bingo fuel.",
      id: "plannedMarginKg",
      kind: "number",
      label: "Planned margin",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Fuel state at which recovery is planned.",
      format: "weight-kg",
      id: "jokerFuelKg",
      kind: "number",
      label: "Joker fuel",
      unit: "kg",
    },
  ],
  title: "Joker Fuel Calculator",
});
export const runJokerFuel = jokerFuelTool.execute;
export default jokerFuelTool;
