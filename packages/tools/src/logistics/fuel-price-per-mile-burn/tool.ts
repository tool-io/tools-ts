import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelPricePerMileBurnInput = {
  readonly dieselPriceUsdPerGallon: number;
  readonly truckMpg: number;
};

export type FuelPricePerMileBurnOutput = {
  readonly fuelCostPerMileUsd: number;
};

export const calculateFuelPricePerMileBurn = (
  input: FuelPricePerMileBurnInput,
): FuelPricePerMileBurnOutput => {
  if (
    !Number.isFinite(input.dieselPriceUsdPerGallon) ||
    input.dieselPriceUsdPerGallon < 0
  )
    return simpleError(
      "dieselPriceUsdPerGallon",
      "Diesel price must be finite and non-negative.",
      "invalid_price",
    );
  if (!Number.isFinite(input.truckMpg) || input.truckMpg <= 0)
    return simpleError(
      "truckMpg",
      "Truck fuel economy must be greater than zero.",
      "invalid_mpg",
    );
  const fuelCostPerMileUsd = input.dieselPriceUsdPerGallon / input.truckMpg;
  if (
    !Number.isFinite(fuelCostPerMileUsd) ||
    (input.dieselPriceUsdPerGallon > 0 && fuelCostPerMileUsd <= 0)
  )
    return simpleError(
      "dieselPriceUsdPerGallon",
      "Fuel cost per mile is outside the representable range.",
      "cost_out_of_range",
    );
  return { fuelCostPerMileUsd };
};

export const fuelPricePerMileBurnExample = {
  input: { dieselPriceUsdPerGallon: 3.85, truckMpg: 6.5 },
  output: { fuelCostPerMileUsd: 0.5923076923076923 },
} satisfies ToolExample<FuelPricePerMileBurnInput, FuelPricePerMileBurnOutput>;

export const fuelPricePerMileBurnTool = createSimpleTool({
  id: "logistics/fuel-price-per-mile-burn",
  title: "Fuel Price Per Mile Burn Calculator",
  description:
    "Convert a diesel pump price and truck fuel economy into the fuel cost per mile.",
  inputs: [
    {
      description: "Diesel price in USD per gallon.",
      id: "dieselPriceUsdPerGallon",
      kind: "number",
      label: "Diesel price/gal",
      minimum: 0,
    },
    {
      description: "Truck fuel economy in miles per gallon.",
      id: "truckMpg",
      kind: "number",
      label: "Truck MPG",
      minimum: Number.MIN_VALUE,
      unit: "mpg",
    },
  ],
  outputs: [
    {
      description: "Fuel cost per mile in USD.",
      id: "fuelCostPerMileUsd",
      kind: "number",
      label: "Fuel cost/mile",
    },
  ],
  calculate: (input) =>
    calculateFuelPricePerMileBurn({
      dieselPriceUsdPerGallon: input.dieselPriceUsdPerGallon as number,
      truckMpg: input.truckMpg as number,
    }),
});

export const runFuelPricePerMileBurn = fuelPricePerMileBurnTool.execute;
export default fuelPricePerMileBurnTool;
