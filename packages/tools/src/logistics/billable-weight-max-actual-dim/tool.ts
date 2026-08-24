import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BillableWeightMaxActualDimInput = {
  readonly actualWeightKg: number;
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly volumetricDivisorCm3PerKg?: number;
};

export type BillableWeightMaxActualDimOutput = {
  readonly volumetricWeightKg: number;
  readonly chargeableWeightKg: number;
  readonly billingBasis: "actual" | "volumetric";
};

export const calculateBillableWeightMaxActualDim = (
  input: BillableWeightMaxActualDimInput,
): BillableWeightMaxActualDimOutput => {
  for (const key of [
    "actualWeightKg",
    "lengthCm",
    "widthCm",
    "heightCm",
  ] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Weights and dimensions must be finite and greater than zero.",
        "invalid_measure",
      );
  }
  const divisor =
    input.volumetricDivisorCm3PerKg === undefined
      ? 5000
      : input.volumetricDivisorCm3PerKg;
  if (!Number.isFinite(divisor) || divisor <= 0)
    return simpleError(
      "volumetricDivisorCm3PerKg",
      "The volumetric divisor must be finite and greater than zero.",
      "invalid_divisor",
    );
  const volumeCm3 = input.lengthCm * input.widthCm * input.heightCm;
  let volumetricWeightKg = volumeCm3 / divisor;
  if (!Number.isFinite(volumetricWeightKg) || volumetricWeightKg <= 0)
    volumetricWeightKg = Math.exp(
      Math.log(input.lengthCm) +
        Math.log(input.widthCm) +
        Math.log(input.heightCm) -
        Math.log(divisor),
    );
  if (!Number.isFinite(volumetricWeightKg) || volumetricWeightKg <= 0)
    return simpleError(
      "volumetricDivisorCm3PerKg",
      "The volumetric weight is outside the representable range.",
      "weight_out_of_range",
    );
  const chargeableWeightKg = Math.max(input.actualWeightKg, volumetricWeightKg);
  return {
    volumetricWeightKg,
    chargeableWeightKg,
    billingBasis:
      input.actualWeightKg >= volumetricWeightKg ? "actual" : "volumetric",
  };
};

export const billableWeightMaxActualDimExample = {
  input: {
    actualWeightKg: 10,
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    volumetricDivisorCm3PerKg: 5000,
  },
  output: {
    volumetricWeightKg: 19.2,
    chargeableWeightKg: 19.2,
    billingBasis: "volumetric",
  },
} satisfies ToolExample<
  BillableWeightMaxActualDimInput,
  BillableWeightMaxActualDimOutput
>;

export const billableWeightMaxActualDimTool = createSimpleTool({
  id: "logistics/billable-weight-max-actual-dim",
  title: "Billable Weight (Max of Actual vs Dim) Calculator",
  description:
    "Compare actual and volumetric weight before carrier-specific dimension, weight, or billing rounding; an exact tie uses actual weight.",
  inputs: [
    {
      description: "Scale weight of the shipment in kilograms.",
      id: "actualWeightKg",
      kind: "number",
      label: "Actual weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description:
        "One carton side in centimetres; side order does not affect volume.",
      id: "lengthCm",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "A second carton side in centimetres.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "The remaining carton side in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 5000,
      description:
        "Cubic-centimetres-per-kilogram divisor from the applicable carrier tariff; defaults to 5000.",
      id: "volumetricDivisorCm3PerKg",
      kind: "number",
      label: "Volumetric divisor",
      minimum: Number.MIN_VALUE,
      unit: "cm³/kg",
    },
  ],
  outputs: [
    {
      description: "Unrounded volumetric weight in kilograms.",
      id: "volumetricWeightKg",
      kind: "number",
      label: "Volumetric weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description:
        "Greater of actual and volumetric weight before tariff rounding.",
      id: "chargeableWeightKg",
      kind: "number",
      label: "Chargeable weight",
      minimum: Number.MIN_VALUE,
      unit: "kg",
    },
    {
      description: "Which basis the chargeable weight came from.",
      id: "billingBasis",
      enum: ["actual", "volumetric"],
      kind: "string",
      label: "Billing basis",
    },
  ],
  calculate: (input) =>
    calculateBillableWeightMaxActualDim({
      actualWeightKg: input.actualWeightKg as number,
      heightCm: input.heightCm as number,
      lengthCm: input.lengthCm as number,
      volumetricDivisorCm3PerKg: input.volumetricDivisorCm3PerKg as number,
      widthCm: input.widthCm as number,
    }),
});

export const runBillableWeightMaxActualDim =
  billableWeightMaxActualDimTool.execute;
export default billableWeightMaxActualDimTool;
