import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuelSurchargeIndexWeeklyLookupInput = {
  readonly indexValue: number;
  readonly lowIndexValue: number;
  readonly highIndexValue: number;
  readonly lowSurchargePercent: number;
  readonly highSurchargePercent: number;
};

export type FuelSurchargeIndexWeeklyLookupOutput = {
  readonly surchargePercent: number;
  readonly indexPositionPercent: number;
};

export const calculateFuelSurchargeIndexWeeklyLookup = (
  input: FuelSurchargeIndexWeeklyLookupInput,
): FuelSurchargeIndexWeeklyLookupOutput => {
  for (const key of [
    "indexValue",
    "lowIndexValue",
    "highIndexValue",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Index values must be finite and greater than zero.",
        "invalid_index",
      );
  }
  if (!(input.highIndexValue > input.lowIndexValue))
    return simpleError(
      "highIndexValue",
      "The high index value must be greater than the low index value.",
      "invalid_index",
    );
  if (
    input.indexValue < input.lowIndexValue ||
    input.indexValue > input.highIndexValue
  )
    return simpleError(
      "indexValue",
      "The index value falls outside the published bracket.",
      "out_of_range",
    );
  for (const key of ["lowSurchargePercent", "highSurchargePercent"] as const) {
    if (!Number.isFinite(input[key]) || input[key] < 0)
      return simpleError(
        key,
        "Surcharge percentages must be finite and non-negative.",
        "invalid_percent",
      );
  }
  const fraction =
    (input.indexValue - input.lowIndexValue) /
    (input.highIndexValue - input.lowIndexValue);
  const surchargePercent =
    input.lowSurchargePercent +
    fraction * (input.highSurchargePercent - input.lowSurchargePercent);
  if (!Number.isFinite(surchargePercent) || surchargePercent < 0)
    return simpleError(
      "lowSurchargePercent",
      "The interpolated surcharge is outside the representable range.",
      "surcharge_out_of_range",
    );
  return { surchargePercent, indexPositionPercent: fraction * 100 };
};

export const fuelSurchargeIndexWeeklyLookupExample = {
  input: {
    indexValue: 140,
    lowIndexValue: 100,
    highIndexValue: 200,
    lowSurchargePercent: 10,
    highSurchargePercent: 20,
  },
  output: { surchargePercent: 14, indexPositionPercent: 40 },
} satisfies ToolExample<
  FuelSurchargeIndexWeeklyLookupInput,
  FuelSurchargeIndexWeeklyLookupOutput
>;

export const fuelSurchargeIndexWeeklyLookupTool = createSimpleTool({
  id: "logistics/fuel-surcharge-index-weekly-lookup",
  title: "Fuel Surcharge Index Weekly Lookup",
  description:
    "Linearly interpolate this week's fuel surcharge percentage between the low and high brackets of your published index table.",
  inputs: [
    {
      description: "Current weekly fuel index reading.",
      id: "indexValue",
      kind: "number",
      label: "Index",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Lower bound of the tariff's index bracket.",
      id: "lowIndexValue",
      kind: "number",
      label: "Low index",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Upper bound of the tariff's index bracket.",
      id: "highIndexValue",
      kind: "number",
      label: "High index",
      minimum: Number.MIN_VALUE,
    },
    {
      description: "Surcharge percentage at the lower bracket bound.",
      id: "lowSurchargePercent",
      kind: "number",
      label: "Low %",
      minimum: 0,
      unit: "%",
    },
    {
      description: "Surcharge percentage at the upper bracket bound.",
      id: "highSurchargePercent",
      kind: "number",
      label: "High %",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Interpolated fuel surcharge percentage.",
      id: "surchargePercent",
      kind: "number",
      label: "Surcharge %",
    },
    {
      description:
        "Position of the reading within the bracket as a percentage of the span.",
      id: "indexPositionPercent",
      kind: "number",
      label: "Position",
    },
  ],
  calculate: (input) =>
    calculateFuelSurchargeIndexWeeklyLookup({
      highIndexValue: input.highIndexValue as number,
      highSurchargePercent: input.highSurchargePercent as number,
      indexValue: input.indexValue as number,
      lowIndexValue: input.lowIndexValue as number,
      lowSurchargePercent: input.lowSurchargePercent as number,
    }),
});

export const runFuelSurchargeIndexWeeklyLookup =
  fuelSurchargeIndexWeeklyLookupTool.execute;
export default fuelSurchargeIndexWeeklyLookupTool;
