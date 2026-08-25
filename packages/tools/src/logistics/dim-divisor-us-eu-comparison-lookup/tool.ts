import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DimDivisorUsEuComparisonLookupInput = {
  readonly lengthCm: number;
  readonly widthCm: number;
  readonly heightCm: number;
  readonly usExpressDivisorCm3PerKg?: number;
  readonly euRoadDivisorCm3PerKg?: number;
};

export type DimDivisorUsEuComparisonLookupOutput = {
  readonly volumetricUsExpressKg: number;
  readonly volumetricEuRoadKg: number;
  readonly volumetricDifferenceKg: number;
};

export const calculateDimDivisorUsEuComparisonLookup = (
  input: DimDivisorUsEuComparisonLookupInput,
): DimDivisorUsEuComparisonLookupOutput => {
  for (const key of ["lengthCm", "widthCm", "heightCm"] as const) {
    if (!Number.isFinite(input[key]) || input[key] <= 0)
      return simpleError(
        key,
        "Carton dimensions must be finite and greater than zero.",
        "invalid_dimension",
      );
  }
  const usDivisor = input.usExpressDivisorCm3PerKg ?? 5000;
  const euDivisor = input.euRoadDivisorCm3PerKg ?? 3000;
  if (!Number.isFinite(usDivisor) || usDivisor <= 0)
    return simpleError(
      "usExpressDivisorCm3PerKg",
      "The US divisor must be greater than zero.",
      "invalid_divisor",
    );
  if (!Number.isFinite(euDivisor) || euDivisor <= 0)
    return simpleError(
      "euRoadDivisorCm3PerKg",
      "The EU road divisor must be greater than zero.",
      "invalid_divisor",
    );
  const volumeCm3 = input.lengthCm * input.widthCm * input.heightCm;
  const volumetricUsExpressKg = volumeCm3 / usDivisor;
  const volumetricEuRoadKg = volumeCm3 / euDivisor;
  if (
    !Number.isFinite(volumeCm3) ||
    volumeCm3 <= 0 ||
    !Number.isFinite(volumetricUsExpressKg) ||
    volumetricUsExpressKg <= 0 ||
    !Number.isFinite(volumetricEuRoadKg) ||
    volumetricEuRoadKg <= 0
  )
    return simpleError(
      "lengthCm",
      "The volumetric weights are outside the representable range.",
      "weight_out_of_range",
    );
  return {
    volumetricUsExpressKg,
    volumetricEuRoadKg,
    volumetricDifferenceKg: volumetricEuRoadKg - volumetricUsExpressKg,
  };
};

export const dimDivisorUsEuComparisonLookupExample = {
  input: { lengthCm: 60, widthCm: 40, heightCm: 40 },
  output: {
    volumetricUsExpressKg: 19.2,
    volumetricEuRoadKg: 32,
    volumetricDifferenceKg: 12.8,
  },
} satisfies ToolExample<
  DimDivisorUsEuComparisonLookupInput,
  DimDivisorUsEuComparisonLookupOutput
>;

export const dimDivisorUsEuComparisonLookupTool = createSimpleTool({
  id: "logistics/dim-divisor-us-eu-comparison-lookup",
  title: "Dim Divisor US-EU Comparison Lookup",
  description:
    "Compare volumetric weight for the same carton under a US express-style divisor (default 5000 cm3/kg) and an EU road-style divisor (default 3000 cm3/kg), both overridable from your tariffs.",
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
      description: "US express air divisor in cm3 per kg.",
      id: "usExpressDivisorCm3PerKg",
      kind: "number",
      label: "US divisor",
      minimum: Number.MIN_VALUE,
      unit: "cm³/kg",
    },
    {
      default: 3000,
      description: "EU road divisor in cm3 per kg.",
      id: "euRoadDivisorCm3PerKg",
      kind: "number",
      label: "EU divisor",
      minimum: Number.MIN_VALUE,
      unit: "cm³/kg",
    },
  ],
  outputs: [
    {
      description:
        "Volumetric weight under the US express divisor, in kilograms.",
      id: "volumetricUsExpressKg",
      kind: "number",
      label: "US express",
    },
    {
      description: "Volumetric weight under the EU road divisor, in kilograms.",
      id: "volumetricEuRoadKg",
      kind: "number",
      label: "EU road",
    },
    {
      description: "EU road minus US express volumetric weight, in kilograms.",
      id: "volumetricDifferenceKg",
      kind: "number",
      label: "Difference",
    },
  ],
  calculate: (input) =>
    calculateDimDivisorUsEuComparisonLookup({
      euRoadDivisorCm3PerKg: input.euRoadDivisorCm3PerKg as number | undefined,
      heightCm: input.heightCm as number,
      lengthCm: input.lengthCm as number,
      usExpressDivisorCm3PerKg: input.usExpressDivisorCm3PerKg as
        number | undefined,
      widthCm: input.widthCm as number,
    }),
});

export const runDimDivisorUsEuComparisonLookup =
  dimDivisorUsEuComparisonLookupTool.execute;
export default dimDivisorUsEuComparisonLookupTool;
