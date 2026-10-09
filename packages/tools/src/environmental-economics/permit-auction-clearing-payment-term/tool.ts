import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedPermits: number;
  readonly clearingPrice: number;
};
export type Output = { readonly payment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedPermits: { type: "number", minimum: 0 },
    clearingPrice: { type: "number" },
  },
  required: ["allocatedPermits", "clearingPrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { payment: { type: "number" } },
  required: ["payment"],
} as const;
/** Apply a supplied signed clearing price to an explicit permit allocation without simulating an auction or enforcing market rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedPermits, clearingPrice } = request;
  const compute = (): Output => {
    H.domain(allocatedPermits >= 0, "allocatedPermits");
    return { payment: allocatedPermits * clearingPrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedPermits: 40, clearingPrice: 25 },
  output: { payment: 1000 },
} satisfies ToolExample<Input, Output>;
export const permitAuctionClearingPaymentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/permit-auction-clearing-payment-term",
    title: "Permit Auction Clearing Payment Term Tool",
    description:
      "Apply a supplied signed clearing price to an explicit permit allocation without simulating an auction or enforcing market rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedPermits: { type: "number", minimum: 0 },
        clearingPrice: { type: "number" },
      },
      required: ["allocatedPermits", "clearingPrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { payment: { type: "number" } },
      required: ["payment"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedPermits",
          label: "Allocated Permits",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clearingPrice",
          label: "Clearing Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "payment", label: "Payment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = permitAuctionClearingPaymentTermTool.execute;
export default permitAuctionClearingPaymentTermTool;
