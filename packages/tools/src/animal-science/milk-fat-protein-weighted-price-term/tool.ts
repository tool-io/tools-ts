import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly milkMass: number;
  readonly fatFraction: number;
  readonly proteinFraction: number;
  readonly basePrice: number;
  readonly fatPrice: number;
  readonly proteinPrice: number;
};
export type Output = {
  readonly fatValue: number;
  readonly proteinValue: number;
  readonly totalValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    milkMass: { type: "number", minimum: 0 },
    fatFraction: { type: "number", minimum: 0, maximum: 1 },
    proteinFraction: { type: "number", minimum: 0, maximum: 1 },
    basePrice: { type: "number", minimum: 0 },
    fatPrice: { type: "number", minimum: 0 },
    proteinPrice: { type: "number", minimum: 0 },
  },
  required: [
    "milkMass",
    "fatFraction",
    "proteinFraction",
    "basePrice",
    "fatPrice",
    "proteinPrice",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fatValue: { type: "number" },
    proteinValue: { type: "number" },
    totalValue: { type: "number" },
  },
  required: ["fatValue", "proteinValue", "totalValue"],
} as const;
/** Calculate milk fat protein weighted price term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    milkMass,
    fatFraction,
    proteinFraction,
    basePrice,
    fatPrice,
    proteinPrice,
  } = request;
  const compute = (): Output => {
    H.domain(
      milkMass >= 0 && basePrice >= 0 && fatPrice >= 0 && proteinPrice >= 0,
    );
    H.probability(fatFraction);
    H.probability(proteinFraction);
    H.domain(fatFraction + proteinFraction <= 1);
    return {
      fatValue: milkMass * fatFraction * fatPrice,
      proteinValue: milkMass * proteinFraction * proteinPrice,
      totalValue:
        milkMass *
        (basePrice + fatFraction * fatPrice + proteinFraction * proteinPrice),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    milkMass: 100,
    fatFraction: 0.04,
    proteinFraction: 0.03,
    basePrice: 0.2,
    fatPrice: 2,
    proteinPrice: 3,
  },
  output: { fatValue: 8, proteinValue: 9, totalValue: 37 },
} satisfies ToolExample<Input, Output>;
export const milkFatProteinWeightedPriceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "animal-science/milk-fat-protein-weighted-price-term",
    title: "Milk Fat Protein Weighted Price Term Tool",
    description:
      "Calculate milk fat protein weighted price term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        milkMass: { type: "number", minimum: 0 },
        fatFraction: { type: "number", minimum: 0, maximum: 1 },
        proteinFraction: { type: "number", minimum: 0, maximum: 1 },
        basePrice: { type: "number", minimum: 0 },
        fatPrice: { type: "number", minimum: 0 },
        proteinPrice: { type: "number", minimum: 0 },
      },
      required: [
        "milkMass",
        "fatFraction",
        "proteinFraction",
        "basePrice",
        "fatPrice",
        "proteinPrice",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fatValue: { type: "number" },
        proteinValue: { type: "number" },
        totalValue: { type: "number" },
      },
      required: ["fatValue", "proteinValue", "totalValue"],
    },
    ports: {
      inputs: [
        {
          id: "milkMass",
          label: "Milk Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatFraction",
          label: "Fat Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinFraction",
          label: "Protein Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "basePrice",
          label: "Base Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fatPrice",
          label: "Fat Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "proteinPrice",
          label: "Protein Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fatValue", label: "Fat Value", valueType: { type: "number" } },
        {
          id: "proteinValue",
          label: "Protein Value",
          valueType: { type: "number" },
        },
        {
          id: "totalValue",
          label: "Total Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = milkFatProteinWeightedPriceTermTool.execute;
export default milkFatProteinWeightedPriceTermTool;
