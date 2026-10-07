import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedMassFlow: number;
  readonly feedSolidsFraction: number;
  readonly productSolidsFraction: number;
};
export type Output = {
  readonly productMassFlow: number;
  readonly evaporatedWaterFlow: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedMassFlow: { type: "number", minimum: 0 },
    feedSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
    productSolidsFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["feedMassFlow", "feedSolidsFraction", "productSolidsFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productMassFlow: { type: "number" },
    evaporatedWaterFlow: { type: "number" },
  },
  required: ["productMassFlow", "evaporatedWaterFlow"],
} as const;
/** Balance a nonvolatile-solids single-effect evaporator using explicit feed and product mass fractions, excluding entrainment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedMassFlow, feedSolidsFraction, productSolidsFraction } = request;
  const compute = (): Output => {
    H.domain(feedMassFlow >= 0, "feedMassFlow");
    (H.domain(
      feedSolidsFraction >= 0 && feedSolidsFraction <= 1,
      "feedSolidsFraction",
    ),
      feedSolidsFraction);
    H.domain(
      productSolidsFraction > 0 &&
        productSolidsFraction <= 1 &&
        productSolidsFraction >= feedSolidsFraction,
      "productSolidsFraction",
    );
    return {
      productMassFlow:
        (feedMassFlow * feedSolidsFraction) / productSolidsFraction,
      evaporatedWaterFlow:
        feedMassFlow -
        (feedMassFlow * feedSolidsFraction) / productSolidsFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedMassFlow: 100,
    feedSolidsFraction: 0.2,
    productSolidsFraction: 0.5,
  },
  output: { productMassFlow: 40, evaporatedWaterFlow: 60 },
} satisfies ToolExample<Input, Output>;
export const singleEffectEvaporationWaterBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["chemical-engineering", "chemical engineering", "engineering"],
        keywords: ["chemical engineering", "engineering"],
      },
      id: "chemical-engineering/single-effect-evaporation-water-balance",
      title: "Single Effect Evaporation Water Balance",
      description:
        "Balance a nonvolatile-solids single-effect evaporator using explicit feed and product mass fractions, excluding entrainment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedMassFlow: { type: "number", minimum: 0 },
          feedSolidsFraction: { type: "number", minimum: 0, maximum: 1 },
          productSolidsFraction: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: [
          "feedMassFlow",
          "feedSolidsFraction",
          "productSolidsFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productMassFlow: { type: "number" },
          evaporatedWaterFlow: { type: "number" },
        },
        required: ["productMassFlow", "evaporatedWaterFlow"],
      },
      ports: {
        inputs: [
          {
            id: "feedMassFlow",
            label: "Feed Mass Flow",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feedSolidsFraction",
            label: "Feed Solids Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "productSolidsFraction",
            label: "Product Solids Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "productMassFlow",
            label: "Product Mass Flow",
            valueType: { type: "number" },
          },
          {
            id: "evaporatedWaterFlow",
            label: "Evaporated Water Flow",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = singleEffectEvaporationWaterBalanceTool.execute;
export default singleEffectEvaporationWaterBalanceTool;
