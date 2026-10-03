import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amounts: readonly number[];
  readonly buyerPays: readonly boolean[];
};
export type Output = {
  readonly buyerTotal: number;
  readonly sellerTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amounts: { type: "array", maxItems: 256, items: { type: "number" } },
    buyerPays: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["amounts", "buyerPays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    buyerTotal: { type: "number" },
    sellerTotal: { type: "number" },
  },
  required: ["buyerTotal", "sellerTotal"],
} as const;
/** Allocate supplied cost components using explicit payer flags; no Incoterms rule is selected or interpreted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amounts, buyerPays } = request;
  const compute = (): Output => {
    H.sameLength(amounts, buyerPays);
    H.domain(amounts.every((x) => x >= 0));
    return {
      buyerTotal: amounts.reduce((s, x, i) => s + (buyerPays[i] ? x : 0), 0),
      sellerTotal: amounts.reduce((s, x, i) => s + (buyerPays[i] ? 0 : x), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amounts: [100, 20, 30], buyerPays: [true, false, true] },
  output: { buyerTotal: 130, sellerTotal: 20 },
} satisfies ToolExample<Input, Output>;
export const incotermCostComponentCallerAllocationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "supply-chain/incoterm-cost-component-caller-allocation",
      title: "Incoterm Cost Component Caller Allocation Tool",
      description:
        "Allocate supplied cost components using explicit payer flags; no Incoterms rule is selected or interpreted.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amounts: { type: "array", maxItems: 256, items: { type: "number" } },
          buyerPays: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["amounts", "buyerPays"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          buyerTotal: { type: "number" },
          sellerTotal: { type: "number" },
        },
        required: ["buyerTotal", "sellerTotal"],
      },
      ports: {
        inputs: [
          {
            id: "amounts",
            label: "Amounts",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "buyerPays",
            label: "Buyer Pays",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "buyerTotal",
            label: "Buyer Total",
            valueType: { type: "number" },
          },
          {
            id: "sellerTotal",
            label: "Seller Total",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = incotermCostComponentCallerAllocationTool.execute;
export default incotermCostComponentCallerAllocationTool;
