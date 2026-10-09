import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wetBasisMoistureFraction: number };
export type Output = { readonly dryBasisWaterPerDryMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetBasisMoistureFraction: {
      type: "number",
      minimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: ["wetBasisMoistureFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryBasisWaterPerDryMass: { type: "number" } },
  required: ["dryBasisWaterPerDryMass"],
} as const;
/** Convert explicit wet-basis water mass fraction to water mass per dry-solids mass without predicting shelf life. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetBasisMoistureFraction } = request;
  const compute = (): Output => {
    H.domain(
      wetBasisMoistureFraction >= 0 && wetBasisMoistureFraction < 1,
      "wetBasisMoistureFraction",
    );
    return {
      dryBasisWaterPerDryMass:
        wetBasisMoistureFraction / (1 - wetBasisMoistureFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetBasisMoistureFraction: 0.2 },
  output: { dryBasisWaterPerDryMass: 0.25 },
} satisfies ToolExample<Input, Output>;
export const foodPowderMoistureBasisCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "food-technology",
        "food technology",
        "research and quality management",
      ],
      keywords: ["food technology", "research and quality management"],
    },
    id: "food-technology/food-powder-moisture-basis-crosswalk",
    title: "Food Powder Moisture Basis Crosswalk",
    description:
      "Convert explicit wet-basis water mass fraction to water mass per dry-solids mass without predicting shelf life.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wetBasisMoistureFraction: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["wetBasisMoistureFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryBasisWaterPerDryMass: { type: "number" } },
      required: ["dryBasisWaterPerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "wetBasisMoistureFraction",
          label: "Wet Basis Moisture Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryBasisWaterPerDryMass",
          label: "Dry Basis Water Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodPowderMoistureBasisCrosswalkTool.execute;
export default foodPowderMoistureBasisCrosswalkTool;
