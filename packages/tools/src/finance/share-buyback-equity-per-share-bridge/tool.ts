import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly equity: number;
  readonly shares: number;
  readonly repurchased: number;
  readonly price: number;
};
export type Output = {
  readonly remainingShares: number;
  readonly remainingEquity: number;
  readonly bookValuePerShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equity: { type: "number" },
    shares: { type: "integer", minimum: 1 },
    repurchased: { type: "integer", minimum: 0 },
    price: { type: "number", minimum: 0 },
  },
  required: ["equity", "shares", "repurchased", "price"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingShares: { type: "integer" },
    remainingEquity: { type: "number" },
    bookValuePerShare: { type: "number" },
  },
  required: ["remainingShares", "remainingEquity", "bookValuePerShare"],
} as const;
/** Calculate share buyback equity per share bridge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { equity, shares, repurchased, price } = request;
  const compute = (): Output => {
    H.integer(shares, 1);
    H.integer(repurchased, 0, shares - 1);
    H.domain(price >= 0);
    const remainingShares = shares - repurchased,
      remainingEquity = equity - repurchased * price;
    return {
      remainingShares,
      remainingEquity,
      bookValuePerShare: remainingEquity / remainingShares,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { equity: 1000, shares: 100, repurchased: 20, price: 8 },
  output: {
    remainingShares: 80,
    remainingEquity: 840,
    bookValuePerShare: 10.5,
  },
} satisfies ToolExample<Input, Output>;
export const shareBuybackEquityPerShareBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/share-buyback-equity-per-share-bridge",
    title: "Share Buyback Equity Per Share Bridge Tool",
    description:
      "Calculate share buyback equity per share bridge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equity: { type: "number" },
        shares: { type: "integer", minimum: 1 },
        repurchased: { type: "integer", minimum: 0 },
        price: { type: "number", minimum: 0 },
      },
      required: ["equity", "shares", "repurchased", "price"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingShares: { type: "integer" },
        remainingEquity: { type: "number" },
        bookValuePerShare: { type: "number" },
      },
      required: ["remainingShares", "remainingEquity", "bookValuePerShare"],
    },
    ports: {
      inputs: [
        {
          id: "equity",
          label: "Equity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shares",
          label: "Shares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repurchased",
          label: "Repurchased",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "price",
          label: "Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingShares",
          label: "Remaining Shares",
          valueType: { type: "integer" },
        },
        {
          id: "remainingEquity",
          label: "Remaining Equity",
          valueType: { type: "number" },
        },
        {
          id: "bookValuePerShare",
          label: "Book Value Per Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shareBuybackEquityPerShareBridgeTool.execute;
export default shareBuybackEquityPerShareBridgeTool;
