import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly price: number;
  readonly payout: number;
  readonly eventOccurs: boolean;
  readonly stake: number;
};
export type Output = { readonly buyerNet: number; readonly sellerNet: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    price: { type: "number", minimum: 0 },
    payout: { type: "number", minimum: 0 },
    eventOccurs: { type: "boolean" },
    stake: { type: "number" },
  },
  required: ["price", "payout", "eventOccurs", "stake"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { buyerNet: { type: "number" }, sellerNet: { type: "number" } },
  required: ["buyerNet", "sellerNet"],
} as const;
/** Calculate a single ticket payoff in a supplied event state; a Dutch book requires evaluating a portfolio over all states. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { price, payout, eventOccurs, stake } = request;
  const compute = (): Output => {
    H.domain(payout >= 0 && price >= 0 && price <= payout);
    return {
      buyerNet: stake * ((eventOccurs ? payout : 0) - price),
      sellerNet: -stake * ((eventOccurs ? payout : 0) - price),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { price: 0.4, payout: 1, eventOccurs: true, stake: 10 },
  output: { buyerNet: 6, sellerNet: -6 },
} satisfies ToolExample<Input, Output>;
export const probabilityDutchBookSinglePayoffTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "philosophy/probability-dutch-book-single-payoff",
    title: "Probability Dutch Book Single Payoff Tool",
    description:
      "Calculate a single ticket payoff in a supplied event state; a Dutch book requires evaluating a portfolio over all states.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        price: { type: "number", minimum: 0 },
        payout: { type: "number", minimum: 0 },
        eventOccurs: { type: "boolean" },
        stake: { type: "number" },
      },
      required: ["price", "payout", "eventOccurs", "stake"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        buyerNet: { type: "number" },
        sellerNet: { type: "number" },
      },
      required: ["buyerNet", "sellerNet"],
    },
    ports: {
      inputs: [
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "payout",
          label: "Payout",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eventOccurs",
          label: "Event Occurs",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "stake",
          label: "Stake",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "buyerNet", label: "Buyer Net", valueType: { type: "number" } },
        { id: "sellerNet", label: "Seller Net", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = probabilityDutchBookSinglePayoffTool.execute;
export default probabilityDutchBookSinglePayoffTool;
