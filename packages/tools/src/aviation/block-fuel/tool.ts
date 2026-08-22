import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BlockFuelInput = {
  readonly alternateFuelKg: number;
  readonly contingencyFuelKg: number;
  readonly finalReserveFuelKg: number;
  readonly taxiFuelKg: number;
  readonly tripFuelKg: number;
};

export type BlockFuelOutput = {
  readonly blockFuelKg: number;
};

export const blockFuelExample = {
  input: {
    alternateFuelKg: 1500,
    contingencyFuelKg: 600,
    finalReserveFuelKg: 1100,
    taxiFuelKg: 400,
    tripFuelKg: 12000,
  },
  output: { blockFuelKg: 15600 },
} satisfies ToolExample<BlockFuelInput, BlockFuelOutput>;

const rejectNegativeFuel = (field: keyof BlockFuelInput, value: number) => {
  if (value < 0)
    simpleError(field, `${field} cannot be negative.`, "invalid_fuel");
};

export const calculateBlockFuel = (input: BlockFuelInput): BlockFuelOutput => {
  rejectNegativeFuel("tripFuelKg", input.tripFuelKg);
  rejectNegativeFuel("contingencyFuelKg", input.contingencyFuelKg);
  rejectNegativeFuel("alternateFuelKg", input.alternateFuelKg);
  rejectNegativeFuel("finalReserveFuelKg", input.finalReserveFuelKg);
  rejectNegativeFuel("taxiFuelKg", input.taxiFuelKg);
  return {
    blockFuelKg:
      input.tripFuelKg +
      input.contingencyFuelKg +
      input.alternateFuelKg +
      input.finalReserveFuelKg +
      input.taxiFuelKg,
  };
};

export const blockFuelTool = createSimpleTool({
  calculate: (input) => calculateBlockFuel(input as unknown as BlockFuelInput),
  description:
    "Sum trip, contingency, alternate, final reserve, and taxi fuel into the total block fuel.",
  id: "aviation/block-fuel",
  inputs: [
    {
      description: "Fuel for the planned route.",
      id: "tripFuelKg",
      kind: "number",
      label: "Trip fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Reserve for unforeseen deviations.",
      id: "contingencyFuelKg",
      kind: "number",
      label: "Contingency fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Fuel to reach the alternate airport.",
      id: "alternateFuelKg",
      kind: "number",
      label: "Alternate fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Fuel held in reserve at arrival.",
      id: "finalReserveFuelKg",
      kind: "number",
      label: "Final reserve fuel",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Fuel expected to be used on the ground before takeoff.",
      id: "taxiFuelKg",
      kind: "number",
      label: "Taxi fuel",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Total ramp fuel required for the flight.",
      format: "weight-kg",
      id: "blockFuelKg",
      kind: "number",
      label: "Block fuel",
      unit: "kg",
    },
  ],
  title: "Block Fuel Calculator",
});
export const runBlockFuel = blockFuelTool.execute;
export default blockFuelTool;
