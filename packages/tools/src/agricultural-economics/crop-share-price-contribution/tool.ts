import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantity: number;
  readonly suppliedShare: number;
  readonly price: number;
};
export type Output = {
  readonly attributedQuantity: number;
  readonly valueContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantity: { type: "number", minimum: 0 },
    suppliedShare: { type: "number", minimum: 0, maximum: 1 },
    price: { type: "number" },
  },
  required: ["quantity", "suppliedShare", "price"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    attributedQuantity: { type: "number" },
    valueContribution: { type: "number" },
  },
  required: ["attributedQuantity", "valueContribution"],
} as const;
/** Calculate crop share price contribution from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantity, suppliedShare, price } = request;
  const compute = (): Output => {
    H.domain(quantity >= 0);
    H.probability(suppliedShare);
    return {
      attributedQuantity: quantity * suppliedShare,
      valueContribution: quantity * suppliedShare * price,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantity: 100, suppliedShare: 0.3, price: 5 },
  output: { attributedQuantity: 30, valueContribution: 150 },
} satisfies ToolExample<Input, Output>;
export const cropSharePriceContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/crop-share-price-contribution",
    title: "Crop Share Price Contribution Tool",
    description:
      "Calculate crop share price contribution from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantity: { type: "number", minimum: 0 },
        suppliedShare: { type: "number", minimum: 0, maximum: 1 },
        price: { type: "number" },
      },
      required: ["quantity", "suppliedShare", "price"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        attributedQuantity: { type: "number" },
        valueContribution: { type: "number" },
      },
      required: ["attributedQuantity", "valueContribution"],
    },
    ports: {
      inputs: [
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedShare",
          label: "Supplied Share",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "attributedQuantity",
          label: "Attributed Quantity",
          valueType: { type: "number" },
        },
        {
          id: "valueContribution",
          label: "Value Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropSharePriceContributionTool.execute;
export default cropSharePriceContributionTool;
