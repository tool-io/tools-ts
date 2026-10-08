import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly basketId: string;
  readonly itemId: string;
  readonly suppliedSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    basketId: { type: "string", maxLength: 8192, minLength: 1 },
    itemId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["basketId", "itemId", "suppliedSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit source code for a supplied basket-added item without inferring purchase motivation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basketId, itemId, suppliedSource } = request;
  const compute = (): Output => {
    H.domain(basketId.length > 0, "basketId");
    H.domain(itemId.length > 0, "itemId");
    H.domain(suppliedSource.length > 0, "suppliedSource");
    return { token: JSON.stringify([basketId, itemId, suppliedSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basketId: "B17", itemId: "I4", suppliedSource: "search" },
  output: { token: '["B17","I4","search"]' },
} satisfies ToolExample<Input, Output>;
export const basketAddedItemSourceCodeTool = H.defineSchemaCalculation<
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
    id: "consumer-behavior/basket-added-item-source-code",
    title: "Basket Added Item Source Code",
    description:
      "Record an explicit source code for a supplied basket-added item without inferring purchase motivation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        basketId: { type: "string", maxLength: 8192, minLength: 1 },
        itemId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["basketId", "itemId", "suppliedSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "basketId",
          label: "Basket Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemId",
          label: "Item Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSource",
          label: "Supplied Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = basketAddedItemSourceCodeTool.execute;
export default basketAddedItemSourceCodeTool;
