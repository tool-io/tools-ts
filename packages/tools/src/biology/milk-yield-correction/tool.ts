import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type MilkYieldCorrectionInput = {
  readonly currentYieldKg: number;
  readonly daysInMilkInt: number;
};

export type MilkYieldCorrectionOutput = {
  readonly correctedYieldKg: number;
};

export const milkYieldCorrectionExample = {
  input: { currentYieldKg: 6000, daysInMilkInt: 150 },
  output: { correctedYieldKg: 12200 },
} satisfies ToolExample<MilkYieldCorrectionInput, MilkYieldCorrectionOutput>;

export const milkYieldCorrectionTool = createSimpleTool({
  id: "biology/milk-yield-correction",
  title: "305-Day Milk Correction",
  description:
    "Project a lactation yield to a 305-day basis as current yield divided by days in milk times three hundred five.",
  inputs: [
    {
      description:
        "Accumulated milk yield so far in kilograms; must not be negative.",
      id: "currentYieldKg",
      kind: "number",
      label: "Current yield",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Days in milk since calving; an integer between 1 and 305.",
      id: "daysInMilkInt",
      kind: "integer",
      label: "Days in milk",
      maximum: 305,
      minimum: 1,
      unit: "days",
    },
  ],
  outputs: [
    {
      description: "Projected 305-day milk yield in kilograms.",
      id: "correctedYieldKg",
      kind: "number",
      label: "Corrected 305-day yield",
      unit: "kg",
    },
  ],
  calculate: (input) => ({
    correctedYieldKg:
      ((input.currentYieldKg as number) / (input.daysInMilkInt as number)) *
      305,
  }),
});
export const runMilkYieldCorrection = milkYieldCorrectionTool.execute;
export default milkYieldCorrectionTool;
