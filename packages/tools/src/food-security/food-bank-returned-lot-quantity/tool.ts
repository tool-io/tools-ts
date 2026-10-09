import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly issuedQuantity: number;
  readonly returnedQuantity: number;
};
export type Output = { readonly netIssuedQuantity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    issuedQuantity: { type: "number", minimum: 0 },
    returnedQuantity: { type: "number", minimum: 0 },
  },
  required: ["issuedQuantity", "returnedQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netIssuedQuantity: { type: "number" } },
  required: ["netIssuedQuantity"],
} as const;
/** Subtract an explicit returned-lot quantity from issued quantity on a compatible unit basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { issuedQuantity, returnedQuantity } = request;
  const compute = (): Output => {
    H.domain(issuedQuantity >= 0 && returnedQuantity >= 0, "issuedQuantity");
    return { netIssuedQuantity: issuedQuantity - returnedQuantity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { issuedQuantity: 120, returnedQuantity: 15 },
  output: { netIssuedQuantity: 105 },
} satisfies ToolExample<Input, Output>;
export const foodBankReturnedlotQuantityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["food-security", "food security", "agriculture"],
      keywords: ["food security", "agriculture"],
    },
    id: "food-security/food-bank-returned-lot-quantity",
    title: "Food Bank Returned Lot Quantity",
    description:
      "Subtract an explicit returned-lot quantity from issued quantity on a compatible unit basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        issuedQuantity: { type: "number", minimum: 0 },
        returnedQuantity: { type: "number", minimum: 0 },
      },
      required: ["issuedQuantity", "returnedQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netIssuedQuantity: { type: "number" } },
      required: ["netIssuedQuantity"],
    },
    ports: {
      inputs: [
        {
          id: "issuedQuantity",
          label: "Issued Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnedQuantity",
          label: "Returned Quantity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netIssuedQuantity",
          label: "Net Issued Quantity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodBankReturnedlotQuantityTool.execute;
export default foodBankReturnedlotQuantityTool;
