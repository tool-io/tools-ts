import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingOwedItems: number;
  readonly newOwedItems: number;
  readonly returnedItems: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingOwedItems: { type: "integer", minimum: 0 },
    newOwedItems: { type: "integer", minimum: 0 },
    returnedItems: { type: "integer", minimum: 0 },
  },
  required: ["openingOwedItems", "newOwedItems", "returnedItems"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile explicit item counts in a recorded exchange without assigning social obligation or equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingOwedItems, newOwedItems, returnedItems } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingOwedItems) &&
        openingOwedItems >= 0 &&
        openingOwedItems <= Number.MAX_SAFE_INTEGER,
      "openingOwedItems",
    ),
      openingOwedItems);
    (H.domain(
      Number.isSafeInteger(newOwedItems) &&
        newOwedItems >= 0 &&
        newOwedItems <= Number.MAX_SAFE_INTEGER,
      "newOwedItems",
    ),
      newOwedItems);
    (H.domain(
      Number.isSafeInteger(returnedItems) &&
        returnedItems >= 0 &&
        returnedItems <= Number.MAX_SAFE_INTEGER,
      "returnedItems",
    ),
      returnedItems);
    return {
      closingBalance: Number(
        BigInt(openingOwedItems) + BigInt(newOwedItems) - BigInt(returnedItems),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingOwedItems: 20, newOwedItems: 8, returnedItems: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const reciprocalExchangeOutstandingItemCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["anthropology", "social sciences"],
        keywords: ["anthropology", "social sciences"],
      },
      id: "anthropology/reciprocal-exchange-outstanding-item-count",
      title: "Reciprocal Exchange Outstanding Item Count",
      description:
        "Reconcile explicit item counts in a recorded exchange without assigning social obligation or equivalence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          openingOwedItems: { type: "integer", minimum: 0 },
          newOwedItems: { type: "integer", minimum: 0 },
          returnedItems: { type: "integer", minimum: 0 },
        },
        required: ["openingOwedItems", "newOwedItems", "returnedItems"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { closingBalance: { type: "integer" } },
        required: ["closingBalance"],
      },
      ports: {
        inputs: [
          {
            id: "openingOwedItems",
            label: "Opening Owed Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "newOwedItems",
            label: "New Owed Items",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "returnedItems",
            label: "Returned Items",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "closingBalance",
            label: "Closing Balance",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = reciprocalExchangeOutstandingItemCountTool.execute;
export default reciprocalExchangeOutstandingItemCountTool;
