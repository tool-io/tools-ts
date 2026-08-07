import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateFuelCost } from "../fuel/tool.js";
export type RoadTripCost = {
  readonly costPerTraveler: number;
  readonly currency: string;
  readonly fuelCost: number;
  readonly tollsAndParking: number;
  readonly totalCost: number;
};
export const calculateRoadTripCost = (
  system: "metric" | "us",
  distance: number,
  efficiency: number,
  fuelPrice: number,
  tolls: number,
  parking: number,
  travelers: number,
  currency: string,
): RoadTripCost | null => {
  const fuel = calculateFuelCost(
    system,
    distance,
    efficiency,
    fuelPrice,
    currency,
  );
  if (!fuel || !Number.isSafeInteger(travelers) || travelers <= 0) return null;
  const tollsAndParking = tolls + parking,
    totalCost = fuel.totalCost + tollsAndParking;
  return {
    costPerTraveler: totalCost / travelers,
    currency,
    fuelCost: fuel.totalCost,
    tollsAndParking,
    totalCost,
  };
};
export const roadTripCostExample = {
  input: {
    currency: "USD",
    distance: 300,
    efficiency: 30,
    fuelPrice: 3.5,
    parking: 10,
    system: "us",
    tolls: 20,
    travelers: 2,
  },
  output: {
    result: {
      costPerTraveler: 32.5,
      currency: "USD",
      fuelCost: 35,
      tollsAndParking: 30,
      totalCost: 65,
    },
  },
} satisfies ToolExample<
  {
    readonly currency: string;
    readonly distance: number;
    readonly efficiency: number;
    readonly fuelPrice: number;
    readonly parking: number;
    readonly system: string;
    readonly tolls: number;
    readonly travelers: number;
  },
  { readonly result: RoadTripCost }
>;
export const roadTripCostTool = createSimpleTool({
  id: "cost/road-trip",
  title: "Road Trip Cost Calculator",
  description:
    "Estimate fuel, toll, parking, total, and per-person road-trip costs.",
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
    { id: "fuelPrice", kind: "number", label: "Fuel price", minimum: 0 },
    { id: "tolls", kind: "number", label: "Tolls", minimum: 0 },
    { id: "parking", kind: "number", label: "Parking", minimum: 0 },
    { id: "travelers", kind: "integer", label: "Travelers", minimum: 1 },
  ],
  outputs: [
    {
      format: "cost/road-trip",
      id: "result",
      kind: "object",
      label: "Road trip cost",
    },
  ],
  calculate: (input) => {
    const result = calculateRoadTripCost(
      input.system as "metric" | "us",
      input.distance as number,
      input.efficiency as number,
      input.fuelPrice as number,
      input.tolls as number,
      input.parking as number,
      input.travelers as number,
      input.currency as string,
    );
    if (!result)
      return simpleError(
        "travelers",
        "Travelers and fuel economy must be positive.",
      );
    return { result };
  },
});
export const runRoadTripCost = roadTripCostTool.execute;
export default roadTripCostTool;
