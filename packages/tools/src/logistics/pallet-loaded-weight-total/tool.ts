import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PalletLoadedWeightTotalInput = {
  readonly palletTareWeightKg: number;
  readonly cartonCount: number;
  readonly weightPerCartonKg: number;
};

export type PalletLoadedWeightTotalOutput = {
  readonly cargoNetWeightKg: number;
  readonly totalGrossWeightKg: number;
};

export const calculatePalletLoadedWeightTotal = (
  input: PalletLoadedWeightTotalInput,
): PalletLoadedWeightTotalOutput => {
  if (
    !Number.isFinite(input.palletTareWeightKg) ||
    input.palletTareWeightKg < 0
  )
    return simpleError(
      "palletTareWeightKg",
      "The pallet tare weight must be finite and non-negative.",
      "invalid_weight",
    );
  if (!(Number.isSafeInteger(input.cartonCount) && input.cartonCount >= 1))
    return simpleError(
      "cartonCount",
      "The carton count must be a whole number of at least one.",
      "invalid_quantity",
    );
  if (!Number.isFinite(input.weightPerCartonKg) || input.weightPerCartonKg <= 0)
    return simpleError(
      "weightPerCartonKg",
      "The per-carton weight must be finite and greater than zero.",
      "invalid_weight",
    );
  const cargoNetWeightKg = input.cartonCount * input.weightPerCartonKg;
  const totalGrossWeightKg = input.palletTareWeightKg + cargoNetWeightKg;
  if (
    !Number.isFinite(cargoNetWeightKg) ||
    !Number.isFinite(totalGrossWeightKg)
  )
    return simpleError(
      "cartonCount",
      "The loaded weight is outside the representable range.",
      "weight_out_of_range",
    );
  return { cargoNetWeightKg, totalGrossWeightKg };
};

export const palletLoadedWeightTotalExample = {
  input: { palletTareWeightKg: 25, cartonCount: 54, weightPerCartonKg: 18.6 },
  output: { cargoNetWeightKg: 1004.4000000000001, totalGrossWeightKg: 1029.4 },
} satisfies ToolExample<
  PalletLoadedWeightTotalInput,
  PalletLoadedWeightTotalOutput
>;

export const palletLoadedWeightTotalTool = createSimpleTool({
  id: "logistics/pallet-loaded-weight-total",
  title: "Pallet Loaded Weight Total",
  description:
    "Build the unit-load weight by multiplying carton count by per-carton weight and adding the pallet tare.",
  inputs: [
    {
      description: "Empty pallet weight in kilograms.",
      id: "palletTareWeightKg",
      kind: "number",
      label: "Tare",
      minimum: 0,
      unit: "kg",
    },
    {
      description: "Number of cartons on the pallet.",
      id: "cartonCount",
      kind: "integer",
      label: "Cartons",
      minimum: 1,
    },
    {
      description: "Average gross weight of each carton in kilograms.",
      id: "weightPerCartonKg",
      kind: "number",
      label: "Weight/carton",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Net cargo weight excluding the pallet in kilograms.",
      id: "cargoNetWeightKg",
      kind: "number",
      label: "Net weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description: "Total unit-load weight including the pallet in kilograms.",
      id: "totalGrossWeightKg",
      kind: "number",
      label: "Gross weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculatePalletLoadedWeightTotal({
      cartonCount: input.cartonCount as number,
      palletTareWeightKg: input.palletTareWeightKg as number,
      weightPerCartonKg: input.weightPerCartonKg as number,
    }),
});

export const runPalletLoadedWeightTotal = palletLoadedWeightTotalTool.execute;
export default palletLoadedWeightTotalTool;
