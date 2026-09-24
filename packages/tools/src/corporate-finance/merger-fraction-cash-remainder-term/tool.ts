import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shares: number;
  readonly exchangeRatio: number;
  readonly pricePerNewShare: number;
};
export type Output = {
  readonly wholeNewShares: number;
  readonly fractionalShare: number;
  readonly cashEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shares: { type: "integer", minimum: 0 },
    exchangeRatio: { type: "number", minimum: 0 },
    pricePerNewShare: { type: "number", minimum: 0 },
  },
  required: ["shares", "exchangeRatio", "pricePerNewShare"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeNewShares: { type: "integer" },
    fractionalShare: { type: "number" },
    cashEquivalent: { type: "number" },
  },
  required: ["wholeNewShares", "fractionalShare", "cashEquivalent"],
} as const;
/** Caller-supplied exchange arithmetic with an aggregate fractional-share cash equivalent; no corporate-action policy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shares, exchangeRatio, pricePerNewShare } = request;
  const compute = (): Output => {
    H.integer(shares, 0);
    H.domain(exchangeRatio >= 0 && pricePerNewShare >= 0);
    return {
      wholeNewShares: Math.floor(shares * exchangeRatio),
      fractionalShare:
        shares * exchangeRatio - Math.floor(shares * exchangeRatio),
      cashEquivalent:
        (shares * exchangeRatio - Math.floor(shares * exchangeRatio)) *
        pricePerNewShare,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shares: 7, exchangeRatio: 0.5, pricePerNewShare: 20 },
  output: { wholeNewShares: 3, fractionalShare: 0.5, cashEquivalent: 10 },
} satisfies ToolExample<Input, Output>;
export const mergerFractionCashRemainderTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/merger-fraction-cash-remainder-term",
    title: "Merger Fraction Cash Remainder Term Tool",
    description:
      "Caller-supplied exchange arithmetic with an aggregate fractional-share cash equivalent; no corporate-action policy is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shares: { type: "integer", minimum: 0 },
        exchangeRatio: { type: "number", minimum: 0 },
        pricePerNewShare: { type: "number", minimum: 0 },
      },
      required: ["shares", "exchangeRatio", "pricePerNewShare"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeNewShares: { type: "integer" },
        fractionalShare: { type: "number" },
        cashEquivalent: { type: "number" },
      },
      required: ["wholeNewShares", "fractionalShare", "cashEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "shares",
          label: "Shares",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exchangeRatio",
          label: "Exchange Ratio",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "pricePerNewShare",
          label: "Price Per New Share",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "wholeNewShares",
          label: "Whole New Shares",
          valueType: { type: "integer" },
        },
        {
          id: "fractionalShare",
          label: "Fractional Share",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "cashEquivalent",
          label: "Cash Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mergerFractionCashRemainderTermTool.execute;
export default mergerFractionCashRemainderTermTool;
