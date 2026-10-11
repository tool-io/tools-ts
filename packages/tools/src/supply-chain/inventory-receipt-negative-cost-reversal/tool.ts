import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedUnits: number;
  readonly suppliedUnitCost: number;
  readonly reverseReceipt: boolean;
};
export type Output = {
  readonly signedQuantity: number;
  readonly signedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedUnits: { type: "integer", minimum: 0 },
    suppliedUnitCost: { type: "number" },
    reverseReceipt: { type: "boolean" },
  },
  required: ["receivedUnits", "suppliedUnitCost", "reverseReceipt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedQuantity: { type: "integer" },
    signedCost: { type: "number" },
  },
  required: ["signedQuantity", "signedCost"],
} as const;
/** Apply an explicit receipt reversal sign to supplied quantity and signed unit cost without inferring accounting treatment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedUnits, suppliedUnitCost, reverseReceipt } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(receivedUnits) &&
        receivedUnits >= 0 &&
        receivedUnits <= Number.MAX_SAFE_INTEGER,
      "receivedUnits",
    ),
      receivedUnits);
    return {
      signedQuantity: reverseReceipt ? -receivedUnits : receivedUnits,
      signedCost: receivedUnits * suppliedUnitCost * (reverseReceipt ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { receivedUnits: 10, suppliedUnitCost: 3, reverseReceipt: true },
  output: { signedQuantity: -10, signedCost: -30 },
} satisfies ToolExample<Input, Output>;
export const inventoryReceiptNegativeCostReversalTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["cost", "data"],
        fields: ["supply-chain", "supply chain", "business and finance"],
        keywords: ["supply chain", "business and finance"],
      },
      id: "supply-chain/inventory-receipt-negative-cost-reversal",
      title: "Inventory Receipt Negative Cost Reversal",
      description:
        "Apply an explicit receipt reversal sign to supplied quantity and signed unit cost without inferring accounting treatment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          receivedUnits: { type: "integer", minimum: 0 },
          suppliedUnitCost: { type: "number" },
          reverseReceipt: { type: "boolean" },
        },
        required: ["receivedUnits", "suppliedUnitCost", "reverseReceipt"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedQuantity: { type: "integer" },
          signedCost: { type: "number" },
        },
        required: ["signedQuantity", "signedCost"],
      },
      ports: {
        inputs: [
          {
            id: "receivedUnits",
            label: "Received Units",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "suppliedUnitCost",
            label: "Supplied Unit Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reverseReceipt",
            label: "Reverse Receipt",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedQuantity",
            label: "Signed Quantity",
            valueType: { type: "integer" },
          },
          {
            id: "signedCost",
            label: "Signed Cost",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = inventoryReceiptNegativeCostReversalTool.execute;
export default inventoryReceiptNegativeCostReversalTool;
