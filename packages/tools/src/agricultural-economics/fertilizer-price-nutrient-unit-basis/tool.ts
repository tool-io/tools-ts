import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pricePerProductUnit: number;
  readonly nutrientMassFraction: number;
};
export type Output = { readonly pricePerNutrientUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pricePerProductUnit: { type: "number", minimum: 0 },
    nutrientMassFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["pricePerProductUnit", "nutrientMassFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pricePerNutrientUnit: { type: "number" } },
  required: ["pricePerNutrientUnit"],
} as const;
/** Convert a supplied fertilizer product-unit price to the same mass unit of nutrient using an explicit positive nutrient fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pricePerProductUnit, nutrientMassFraction } = request;
  const compute = (): Output => {
    H.domain(pricePerProductUnit >= 0, "pricePerProductUnit");
    H.domain(
      nutrientMassFraction > 0 && nutrientMassFraction <= 1,
      "nutrientMassFraction",
    );
    return { pricePerNutrientUnit: pricePerProductUnit / nutrientMassFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { pricePerProductUnit: 300, nutrientMassFraction: 0.5 },
  output: { pricePerNutrientUnit: 600 },
} satisfies ToolExample<Input, Output>;
export const fertilizerPriceNutrientUnitBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/fertilizer-price-nutrient-unit-basis",
    title: "Fertilizer Price Nutrient Unit Basis",
    description:
      "Convert a supplied fertilizer product-unit price to the same mass unit of nutrient using an explicit positive nutrient fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pricePerProductUnit: { type: "number", minimum: 0 },
        nutrientMassFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: ["pricePerProductUnit", "nutrientMassFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pricePerNutrientUnit: { type: "number" } },
      required: ["pricePerNutrientUnit"],
    },
    ports: {
      inputs: [
        {
          id: "pricePerProductUnit",
          label: "Price Per Product Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientMassFraction",
          label: "Nutrient Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pricePerNutrientUnit",
          label: "Price Per Nutrient Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fertilizerPriceNutrientUnitBasisTool.execute;
export default fertilizerPriceNutrientUnitBasisTool;
