import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expenditureShare: number;
  readonly ownPriceElasticity: number;
};
export type Output = { readonly weightedElasticity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expenditureShare: { type: "number", minimum: 0, maximum: 1 },
    ownPriceElasticity: { type: "number" },
  },
  required: ["expenditureShare", "ownPriceElasticity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weightedElasticity: { type: "number" } },
  required: ["weightedElasticity"],
} as const;
/** Calculate farm input share price elasticity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expenditureShare, ownPriceElasticity } = request;
  const compute = (): Output => {
    H.probability(expenditureShare);
    return { weightedElasticity: expenditureShare * ownPriceElasticity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expenditureShare: 0.25, ownPriceElasticity: -0.8 },
  output: { weightedElasticity: -0.2 },
} satisfies ToolExample<Input, Output>;
export const farmInputSharePriceElasticityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-input-share-price-elasticity",
    title: "Farm Input Share Price Elasticity Tool",
    description:
      "Calculate farm input share price elasticity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expenditureShare: { type: "number", minimum: 0, maximum: 1 },
        ownPriceElasticity: { type: "number" },
      },
      required: ["expenditureShare", "ownPriceElasticity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weightedElasticity: { type: "number" } },
      required: ["weightedElasticity"],
    },
    ports: {
      inputs: [
        {
          id: "expenditureShare",
          label: "Expenditure Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ownPriceElasticity",
          label: "Own Price Elasticity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedElasticity",
          label: "Weighted Elasticity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmInputSharePriceElasticityTool.execute;
export default farmInputSharePriceElasticityTool;
