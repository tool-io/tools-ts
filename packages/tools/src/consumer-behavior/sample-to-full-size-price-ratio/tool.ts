import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samplePrice: number;
  readonly sampleQuantity: number;
  readonly fullPrice: number;
  readonly fullQuantity: number;
};
export type Output = {
  readonly sampleUnitPrice: number;
  readonly fullUnitPrice: number;
  readonly unitPriceRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplePrice: { type: "number", minimum: 0 },
    sampleQuantity: { type: "number", exclusiveMinimum: 0 },
    fullPrice: { type: "number", exclusiveMinimum: 0 },
    fullQuantity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["samplePrice", "sampleQuantity", "fullPrice", "fullQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleUnitPrice: { type: "number" },
    fullUnitPrice: { type: "number" },
    unitPriceRatio: { type: "number" },
  },
  required: ["sampleUnitPrice", "fullUnitPrice", "unitPriceRatio"],
} as const;
/** Compare explicit sample and full-size unit prices using compatible product quantities and currency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samplePrice, sampleQuantity, fullPrice, fullQuantity } = request;
  const compute = (): Output => {
    H.domain(samplePrice >= 0, "samplePrice");
    (H.domain(
      Number.isFinite(sampleQuantity) && sampleQuantity > 0,
      "sampleQuantity",
    ),
      sampleQuantity);
    (H.domain(Number.isFinite(fullPrice) && fullPrice > 0, "fullPrice"),
      fullPrice);
    (H.domain(
      Number.isFinite(fullQuantity) && fullQuantity > 0,
      "fullQuantity",
    ),
      fullQuantity);
    return {
      sampleUnitPrice: samplePrice / sampleQuantity,
      fullUnitPrice: fullPrice / fullQuantity,
      unitPriceRatio: samplePrice / sampleQuantity / (fullPrice / fullQuantity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    samplePrice: 4,
    sampleQuantity: 20,
    fullPrice: 10,
    fullQuantity: 100,
  },
  output: { sampleUnitPrice: 0.2, fullUnitPrice: 0.1, unitPriceRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const sampleToFullsizePriceRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/sample-to-full-size-price-ratio",
    title: "Sample To Full Size Price Ratio",
    description:
      "Compare explicit sample and full-size unit prices using compatible product quantities and currency.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samplePrice: { type: "number", minimum: 0 },
        sampleQuantity: { type: "number", exclusiveMinimum: 0 },
        fullPrice: { type: "number", exclusiveMinimum: 0 },
        fullQuantity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["samplePrice", "sampleQuantity", "fullPrice", "fullQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleUnitPrice: { type: "number" },
        fullUnitPrice: { type: "number" },
        unitPriceRatio: { type: "number" },
      },
      required: ["sampleUnitPrice", "fullUnitPrice", "unitPriceRatio"],
    },
    ports: {
      inputs: [
        {
          id: "samplePrice",
          label: "Sample Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleQuantity",
          label: "Sample Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullPrice",
          label: "Full Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullQuantity",
          label: "Full Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleUnitPrice",
          label: "Sample Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "fullUnitPrice",
          label: "Full Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "unitPriceRatio",
          label: "Unit Price Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleToFullsizePriceRatioTool.execute;
export default sampleToFullsizePriceRatioTool;
