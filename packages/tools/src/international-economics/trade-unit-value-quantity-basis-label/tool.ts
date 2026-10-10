import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tradeValue: number;
  readonly quantity: number;
  readonly quantityUnit: string;
};
export type Output = { readonly unitValue: number; readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tradeValue: { type: "number" },
    quantity: { type: "number", exclusiveMinimum: 0 },
    quantityUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["tradeValue", "quantity", "quantityUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitValue: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["unitValue", "label"],
} as const;
/** Calculate an explicit trade unit value while labeling its supplied quantity basis without treating it as a quality-adjusted price. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tradeValue, quantity, quantityUnit } = request;
  const compute = (): Output => {
    (H.domain(quantity > 0, "quantity"), quantity);
    H.domain(quantityUnit.length > 0, "quantityUnit");
    return {
      unitValue: tradeValue / quantity,
      label: "value per " + quantityUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tradeValue: 1000, quantity: 20, quantityUnit: "kg" },
  output: { unitValue: 50, label: "value per kg" },
} satisfies ToolExample<Input, Output>;
export const tradeUnitValueQuantityBasisLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "international-economics",
        "international economics",
        "economics",
      ],
      keywords: ["international economics", "economics"],
    },
    id: "international-economics/trade-unit-value-quantity-basis-label",
    title: "Trade Unit Value Quantity Basis Label",
    description:
      "Calculate an explicit trade unit value while labeling its supplied quantity basis without treating it as a quality-adjusted price.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tradeValue: { type: "number" },
        quantity: { type: "number", exclusiveMinimum: 0 },
        quantityUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["tradeValue", "quantity", "quantityUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitValue: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["unitValue", "label"],
    },
    ports: {
      inputs: [
        {
          id: "tradeValue",
          label: "Trade Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantityUnit",
          label: "Quantity Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "unitValue", label: "Unit Value", valueType: { type: "number" } },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = tradeUnitValueQuantityBasisLabelTool.execute;
export default tradeUnitValueQuantityBasisLabelTool;
