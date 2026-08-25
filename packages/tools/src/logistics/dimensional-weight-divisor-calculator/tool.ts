import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DimensionalWeightDivisorCalculatorInput = {
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly volumetricDivisorCm3PerKg?: number;
};

export type DimensionalWeightDivisorCalculatorOutput = {
  readonly volumetricWeightKg: number;
};

export const calculateDimensionalWeightDivisorCalculator = (
  input: DimensionalWeightDivisorCalculatorInput,
): DimensionalWeightDivisorCalculatorOutput => {
  for (const key of ["lengthCm", "widthCm", "heightCm"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Carton dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  const divisor = input.volumetricDivisorCm3PerKg ?? 5000;
  if (!Number.isFinite(divisor) || divisor <= 0)
    return simpleError(
      "volumetricDivisorCm3PerKg",
      "The volumetric divisor must be greater than zero.",
      "invalid_divisor",
    );
  const volumeCm3 = input.lengthCm * input.widthCm * input.heightCm;
  const volumetricWeightKg = volumeCm3 / divisor;
  if (
    !Number.isFinite(volumeCm3) ||
    volumeCm3 <= 0 ||
    !Number.isFinite(volumetricWeightKg) ||
    volumetricWeightKg <= 0
  )
    return simpleError(
      "lengthCm",
      "The volumetric weight is outside the representable range.",
      "weight_out_of_range",
    );
  return { volumetricWeightKg };
};

export const dimensionalWeightDivisorCalculatorExample = {
  input: {
    lengthCm: 60,
    widthCm: 40,
    heightCm: 40,
    volumetricDivisorCm3PerKg: 5000,
  },
  output: { volumetricWeightKg: 19.2 },
} satisfies ToolExample<
  DimensionalWeightDivisorCalculatorInput,
  DimensionalWeightDivisorCalculatorOutput
>;

export const dimensionalWeightDivisorCalculatorTool = createSimpleTool({
  id: "logistics/dimensional-weight-divisor-calculator",
  title: "Dimensional Weight Divisor Calculator",
  description:
    "Compute volumetric weight as L x W x H in centimetres divided by your tariff's dimensional divisor (default 5000 cm3/kg for air freight).",
  inputs: [
    {
      description: "Longest carton side in centimetres.",
      id: "lengthCm",
      kind: "number",
      label: "Length",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Middle carton side in centimetres.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      description: "Shortest carton side in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: Number.MIN_VALUE,
      unit: "cm",
    },
    {
      default: 5000,
      description:
        "Volumetric divisor in cm3 per kg from your carrier tariff (e.g. 5000 air, 3000 road).",
      id: "volumetricDivisorCm3PerKg",
      kind: "number",
      label: "Divisor",
      minimum: Number.MIN_VALUE,
      unit: "cm³/kg",
    },
  ],
  outputs: [
    {
      description: "Volumetric weight in kilograms.",
      id: "volumetricWeightKg",
      kind: "number",
      label: "Volumetric weight",
    },
  ],
  calculate: (input) =>
    calculateDimensionalWeightDivisorCalculator({
      heightCm: input.heightCm as number,
      lengthCm: input.lengthCm as number,
      volumetricDivisorCm3PerKg: input.volumetricDivisorCm3PerKg as
        number | undefined,
      widthCm: input.widthCm as number,
    }),
});

export const runDimensionalWeightDivisorCalculator =
  dimensionalWeightDivisorCalculatorTool.execute;
export default dimensionalWeightDivisorCalculatorTool;
