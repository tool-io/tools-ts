import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BasicBlockFuelSumInput = {
  readonly contingencyFuelKg: number;
  readonly finalReserveFuelKg: number;
  readonly taxiFuelKg: number;
  readonly tripFuelKg: number;
};

export type BasicBlockFuelSumOutput = {
  readonly blockFuelSubtotalKg: number;
};

export const basicBlockFuelSumExample = {
  input: {
    contingencyFuelKg: 400,
    finalReserveFuelKg: 1500,
    taxiFuelKg: 200,
    tripFuelKg: 8000,
  },
  output: { blockFuelSubtotalKg: 10100 },
} satisfies ToolExample<BasicBlockFuelSumInput, BasicBlockFuelSumOutput>;

export const basicBlockFuelSumTool = createSimpleTool({
  id: "aviation/basic-block-fuel-sum",
  title: "Basic Block Fuel Subtotal Calculator",
  description:
    "Sum taxi, trip, contingency, and final-reserve components into a basic block-fuel subtotal; other required fuel may still apply.",
  inputs: [
    {
      id: "contingencyFuelKg",
      label: "Contingency fuel",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "finalReserveFuelKg",
      label: "Final reserve fuel",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "taxiFuelKg",
      label: "Taxi fuel",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "tripFuelKg",
      label: "Trip fuel",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      id: "blockFuelSubtotalKg",
      label: "Block fuel subtotal",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => ({
    blockFuelSubtotalKg:
      (input.taxiFuelKg as number) +
      (input.tripFuelKg as number) +
      (input.contingencyFuelKg as number) +
      (input.finalReserveFuelKg as number),
  }),
});
export const runBasicBlockFuelSum = basicBlockFuelSumTool.execute;
export default basicBlockFuelSumTool;
