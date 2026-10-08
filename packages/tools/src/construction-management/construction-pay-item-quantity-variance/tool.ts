import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contractQuantity: number;
  readonly installedQuantity: number;
  readonly paidQuantity: number;
};
export type Output = {
  readonly installedMinusContract: number;
  readonly unpaidInstalledQuantity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contractQuantity: { type: "number", minimum: 0 },
    installedQuantity: { type: "number", minimum: 0 },
    paidQuantity: { type: "number", minimum: 0 },
  },
  required: ["contractQuantity", "installedQuantity", "paidQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    installedMinusContract: { type: "number" },
    unpaidInstalledQuantity: { type: "number" },
  },
  required: ["installedMinusContract", "unpaidInstalledQuantity"],
} as const;
/** Compare explicitly recorded contract, installed and paid quantities in one common pay-item unit without determining payment entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contractQuantity, installedQuantity, paidQuantity } = request;
  const compute = (): Output => {
    H.domain(
      contractQuantity >= 0 && installedQuantity >= 0 && paidQuantity >= 0,
      "contractQuantity",
    );
    return {
      installedMinusContract: installedQuantity - contractQuantity,
      unpaidInstalledQuantity: installedQuantity - paidQuantity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contractQuantity: 100, installedQuantity: 110, paidQuantity: 80 },
  output: { installedMinusContract: 10, unpaidInstalledQuantity: 30 },
} satisfies ToolExample<Input, Output>;
export const constructionPayItemQuantityVarianceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "construction-management",
          "construction management",
          "engineering",
        ],
        keywords: ["construction management", "engineering"],
      },
      id: "construction-management/construction-pay-item-quantity-variance",
      title: "Construction Pay Item Quantity Variance",
      description:
        "Compare explicitly recorded contract, installed and paid quantities in one common pay-item unit without determining payment entitlement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contractQuantity: { type: "number", minimum: 0 },
          installedQuantity: { type: "number", minimum: 0 },
          paidQuantity: { type: "number", minimum: 0 },
        },
        required: ["contractQuantity", "installedQuantity", "paidQuantity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          installedMinusContract: { type: "number" },
          unpaidInstalledQuantity: { type: "number" },
        },
        required: ["installedMinusContract", "unpaidInstalledQuantity"],
      },
      ports: {
        inputs: [
          {
            id: "contractQuantity",
            label: "Contract Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "installedQuantity",
            label: "Installed Quantity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "paidQuantity",
            label: "Paid Quantity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "installedMinusContract",
            label: "Installed Minus Contract",
            valueType: { type: "number" },
          },
          {
            id: "unpaidInstalledQuantity",
            label: "Unpaid Installed Quantity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = constructionPayItemQuantityVarianceTool.execute;
export default constructionPayItemQuantityVarianceTool;
