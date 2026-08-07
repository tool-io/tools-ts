import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export type FuelCost = {
  readonly currency: string;
  readonly fuelAmount: number;
  readonly fuelUnit: "gal" | "L";
  readonly totalCost: number;
};
export const calculateFuelCost = (
  system: "metric" | "us",
  distance: number,
  efficiency: number,
  price: number,
  currency: string,
): FuelCost | null => {
  if (!currency.trim() || efficiency <= 0) return null;
  const fuelAmount =
    system === "us" ? distance / efficiency : (distance * efficiency) / 100;
  return {
    currency,
    fuelAmount,
    fuelUnit: system === "us" ? "gal" : "L",
    totalCost: fuelAmount * price,
  };
};
export const fuelCostExample = {
  input: {
    currency: "USD",
    distance: 300,
    efficiency: 30,
    price: 3.5,
    system: "us",
  },
  output: {
    result: { currency: "USD", fuelAmount: 10, fuelUnit: "gal", totalCost: 35 },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly distance: number;
    readonly efficiency: number;
    readonly price: number;
    readonly system: string;
  },
  { readonly result: FuelCost }
>;
export const fuelCostTool = createSimpleTool({
  id: "cost/fuel",
  title: "Fuel Cost Calculator",
  description:
    "Estimate fuel consumption and cost using US or metric fuel-economy conventions.",
  inputs: [
    { id: "currency", kind: "string", label: "Currency" },
    { enum: ["us", "metric"], id: "system", kind: "string", label: "Units" },
    { id: "distance", kind: "number", label: "Distance", minimum: 0 },
    {
      id: "efficiency",
      kind: "number",
      label: "Fuel economy",
      minimum: Number.MIN_VALUE,
    },
    { id: "price", kind: "number", label: "Fuel price", minimum: 0 },
  ],
  outputs: [
    { format: "cost/fuel", id: "result", kind: "object", label: "Fuel cost" },
  ],
  calculate: (input) => {
    const result = calculateFuelCost(
      input.system as "metric" | "us",
      input.distance as number,
      input.efficiency as number,
      input.price as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "efficiency",
        "Fuel economy must be positive and currency must be nonempty.",
      );
    return { result };
  },
});
export const runFuelCost = fuelCostTool.execute;
export default fuelCostTool;
