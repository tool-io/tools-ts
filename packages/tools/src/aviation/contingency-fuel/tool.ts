import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContingencyFuelInput = {
  readonly contingencyPercent?: number;
  readonly tripFuelKg: number;
};

export type ContingencyFuelOutput = {
  readonly contingencyFuelKg: number;
};

const DEFAULT_CONTINGENCY_PERCENT = 5;

export const contingencyFuelExample = {
  input: { contingencyPercent: 5, tripFuelKg: 8000 },
} satisfies ToolExample<ContingencyFuelInput>;

export const contingencyFuelTool = createSimpleTool({
  id: "aviation/contingency-fuel",
  title: "Contingency Fuel Calculator",
  description:
    "Compute the contingency fuel allowance as a percentage of trip fuel.",
  inputs: [
    {
      default: DEFAULT_CONTINGENCY_PERCENT,
      description: "Percentage of trip fuel; defaults to five percent.",
      id: "contingencyPercent",
      label: "Contingency percentage",
      kind: "number",
      maximum: 20,
      minimum: 0,
      unit: "%",
    },
    { id: "tripFuelKg", label: "Trip fuel", kind: "number", unit: "kg" },
  ],
  outputs: [
    {
      id: "contingencyFuelKg",
      label: "Contingency fuel",
      kind: "number",
      unit: "kg",
    },
  ],
  calculate: (input) => {
    const tripFuelKg = input.tripFuelKg as number;
    if (tripFuelKg <= 0)
      simpleError("tripFuelKg", "The trip fuel must be greater than zero.");
    return {
      contingencyFuelKg:
        (tripFuelKg * (input.contingencyPercent as number)) / 100,
    };
  },
});
export const runContingencyFuel = contingencyFuelTool.execute;
export default contingencyFuelTool;
