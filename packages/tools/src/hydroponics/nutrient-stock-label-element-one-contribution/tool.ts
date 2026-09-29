import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockMass: number;
  readonly labelFraction: number;
  readonly elementConversion: number;
  readonly deliveredFraction: number;
};
export type Output = {
  readonly elementMass: number;
  readonly deliveredElement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockMass: { type: "number", minimum: 0 },
    labelFraction: { type: "number", minimum: 0, maximum: 1 },
    elementConversion: { type: "number", minimum: 0 },
    deliveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "stockMass",
    "labelFraction",
    "elementConversion",
    "deliveredFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elementMass: { type: "number" },
    deliveredElement: { type: "number" },
  },
  required: ["elementMass", "deliveredElement"],
} as const;
/** Supplied label-inventory contribution without selecting a nutrient recipe. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockMass, labelFraction, elementConversion, deliveredFraction } =
    request;
  const compute = (): Output => {
    H.domain(stockMass >= 0 && elementConversion >= 0);
    H.probability(labelFraction);
    H.probability(deliveredFraction);
    return {
      elementMass: stockMass * labelFraction * elementConversion,
      deliveredElement:
        stockMass * labelFraction * elementConversion * deliveredFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stockMass: 100,
    labelFraction: 0.1,
    elementConversion: 0.5,
    deliveredFraction: 0.8,
  },
  output: { elementMass: 5, deliveredElement: 4 },
} satisfies ToolExample<Input, Output>;
export const nutrientStockLabelElementOneContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/nutrient-stock-label-element-one-contribution",
      title: "Nutrient Stock Label Element One Contribution Tool",
      description:
        "Supplied label-inventory contribution without selecting a nutrient recipe.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stockMass: { type: "number", minimum: 0 },
          labelFraction: { type: "number", minimum: 0, maximum: 1 },
          elementConversion: { type: "number", minimum: 0 },
          deliveredFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "stockMass",
          "labelFraction",
          "elementConversion",
          "deliveredFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          elementMass: { type: "number" },
          deliveredElement: { type: "number" },
        },
        required: ["elementMass", "deliveredElement"],
      },
      ports: {
        inputs: [
          {
            id: "stockMass",
            label: "Stock Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "labelFraction",
            label: "Label Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "elementConversion",
            label: "Element Conversion",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deliveredFraction",
            label: "Delivered Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "elementMass",
            label: "Element Mass",
            valueType: { type: "number" },
          },
          {
            id: "deliveredElement",
            label: "Delivered Element",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nutrientStockLabelElementOneContributionTool.execute;
export default nutrientStockLabelElementOneContributionTool;
