import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quotedPrice: number;
  readonly sourceQuantity: number;
  readonly targetQuantity: number;
  readonly commodity: string;
  readonly source: string;
  readonly dateLabel: string;
};
export type Output = {
  readonly targetUnitPrice: number;
  readonly provenanceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quotedPrice: { type: "number" },
    sourceQuantity: { type: "number", exclusiveMinimum: 0 },
    targetQuantity: { type: "number", exclusiveMinimum: 0 },
    commodity: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    dateLabel: { type: "string", maxLength: 8192 },
  },
  required: [
    "quotedPrice",
    "sourceQuantity",
    "targetQuantity",
    "commodity",
    "source",
    "dateLabel",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetUnitPrice: { type: "number" },
    provenanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["targetUnitPrice", "provenanceKey"],
} as const;
/** Convert one verified same-commodity quantity-unit price with explicit source/date provenance; no currency or basket conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    quotedPrice,
    sourceQuantity,
    targetQuantity,
    commodity,
    source,
    dateLabel,
  } = request;
  const compute = (): Output => {
    H.positive(sourceQuantity);
    H.positive(targetQuantity);
    return {
      targetUnitPrice: (quotedPrice * targetQuantity) / sourceQuantity,
      provenanceKey: JSON.stringify([source, dateLabel, commodity]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    quotedPrice: 100,
    sourceQuantity: 20,
    targetQuantity: 5,
    commodity: "grain-A",
    source: "ledger-2",
    dateLabel: "year-X",
  },
  output: {
    targetUnitPrice: 25,
    provenanceKey: '["ledger-2","year-X","grain-A"]',
  },
} satisfies ToolExample<Input, Output>;
export const historicalPriceUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-price-unit-factor",
    title: "Historical Price Unit Factor Tool",
    description:
      "Convert one verified same-commodity quantity-unit price with explicit source/date provenance; no currency or basket conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quotedPrice: { type: "number" },
        sourceQuantity: { type: "number", exclusiveMinimum: 0 },
        targetQuantity: { type: "number", exclusiveMinimum: 0 },
        commodity: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        dateLabel: { type: "string", maxLength: 8192 },
      },
      required: [
        "quotedPrice",
        "sourceQuantity",
        "targetQuantity",
        "commodity",
        "source",
        "dateLabel",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetUnitPrice: { type: "number" },
        provenanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["targetUnitPrice", "provenanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "quotedPrice",
          label: "Quoted Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceQuantity",
          label: "Source Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetQuantity",
          label: "Target Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "commodity",
          label: "Commodity",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateLabel",
          label: "Date Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "targetUnitPrice",
          label: "Target Unit Price",
          valueType: { type: "number" },
        },
        {
          id: "provenanceKey",
          label: "Provenance Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalPriceUnitFactorTool.execute;
export default historicalPriceUnitFactorTool;
