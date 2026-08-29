import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelEconomyUnit = "L/100km" | "km/L" | "mpg-Imperial" | "mpg-US";

export type ConvertFuelEconomyInput = {
  readonly fromUnit: FuelEconomyUnit;
  readonly toUnit: FuelEconomyUnit;
  readonly value: number;
};

export type ConvertFuelEconomyOutput = {
  readonly unit: FuelEconomyUnit;
  readonly value: number;
};

const kilometersPerLiter = (value: number, unit: FuelEconomyUnit): number => {
  if (unit === "km/L") return value;
  if (unit === "L/100km") return 100 / value;
  if (unit === "mpg-US") return value * (1.609344 / 3.785411784);
  return value * (1.609344 / 4.54609);
};

export const convertFuelEconomy = (
  input: ConvertFuelEconomyInput,
): ConvertFuelEconomyOutput => {
  if (!(input.value > 0))
    simpleError(
      "value",
      "Fuel economy or consumption must be greater than zero.",
      "value_not_positive",
    );
  const kmPerLiter = kilometersPerLiter(input.value, input.fromUnit);
  const value =
    input.toUnit === "km/L"
      ? kmPerLiter
      : input.toUnit === "L/100km"
        ? 100 / kmPerLiter
        : input.toUnit === "mpg-US"
          ? kmPerLiter / (1.609344 / 3.785411784)
          : kmPerLiter / (1.609344 / 4.54609);
  if (!Number.isFinite(value))
    simpleError(
      "value",
      "The converted value is outside the supported numeric range.",
      "result_not_finite",
    );
  return { unit: input.toUnit, value };
};

export const fuelEconomyExample = {
  input: { fromUnit: "mpg-US" as const, toUnit: "L/100km" as const, value: 30 },
  output: { unit: "L/100km" as const, value: 7.840486111111111 },
} satisfies ToolExample<ConvertFuelEconomyInput, ConvertFuelEconomyOutput>;

const units = ["L/100km", "km/L", "mpg-US", "mpg-Imperial"] as const;

export const fuelEconomyTool = createSimpleTool({
  calculate: (input) =>
    convertFuelEconomy({
      fromUnit: input.fromUnit as FuelEconomyUnit,
      toUnit: input.toUnit as FuelEconomyUnit,
      value: input.value as number,
    }),
  description:
    "Convert positive vehicle efficiency and reciprocal fuel-consumption values among km/L, L/100 km, US mpg, and Imperial mpg.",
  id: "convert/fuel-economy",
  inputs: [
    {
      description: "Must be greater than zero because L/100 km is reciprocal.",
      id: "value",
      kind: "number",
      label: "Value",
      minimum: 0,
    },
    { enum: units, id: "fromUnit", kind: "string", label: "From unit" },
    { enum: units, id: "toUnit", kind: "string", label: "To unit" },
  ],
  outputs: [
    { id: "value", kind: "number", label: "Converted value" },
    { enum: units, id: "unit", kind: "string", label: "Unit" },
  ],
  title: "Convert Fuel Economy and Consumption",
});

export const runFuelEconomy = fuelEconomyTool.execute;
export default fuelEconomyTool;
