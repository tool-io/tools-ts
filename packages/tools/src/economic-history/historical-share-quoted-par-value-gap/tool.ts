import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parValue: number;
  readonly quotePercent: number;
  readonly paidFraction: number;
};
export type Output = {
  readonly marketPrice: number;
  readonly paidCapital: number;
  readonly premiumToPaid: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parValue: { type: "number", exclusiveMinimum: 0 },
    quotePercent: { type: "number", minimum: 0 },
    paidFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["parValue", "quotePercent", "paidFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    marketPrice: { type: "number" },
    paidCapital: { type: "number" },
    premiumToPaid: { type: "number" },
  },
  required: ["marketPrice", "paidCapital", "premiumToPaid"],
} as const;
/** Calculate historical share quoted par value gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parValue, quotePercent, paidFraction } = request;
  const compute = (): Output => {
    H.positive(parValue);
    H.domain(quotePercent >= 0);
    H.probability(paidFraction);
    const marketPrice = (parValue * quotePercent) / 100,
      paidCapital = parValue * paidFraction;
    return {
      marketPrice,
      paidCapital,
      premiumToPaid: marketPrice - paidCapital,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parValue: 100, quotePercent: 80, paidFraction: 0.5 },
  output: { marketPrice: 80, paidCapital: 50, premiumToPaid: 30 },
} satisfies ToolExample<Input, Output>;
export const historicalShareQuotedParValueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/historical-share-quoted-par-value-gap",
    title: "Historical Share Quoted PAR Value Gap Tool",
    description:
      "Calculate historical share quoted par value gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parValue: { type: "number", exclusiveMinimum: 0 },
        quotePercent: { type: "number", minimum: 0 },
        paidFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["parValue", "quotePercent", "paidFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        marketPrice: { type: "number" },
        paidCapital: { type: "number" },
        premiumToPaid: { type: "number" },
      },
      required: ["marketPrice", "paidCapital", "premiumToPaid"],
    },
    ports: {
      inputs: [
        {
          id: "parValue",
          label: "Par Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quotePercent",
          label: "Quote Percent",
          required: true,
          valueType: { type: "number", unit: "%" },
        },
        {
          id: "paidFraction",
          label: "Paid Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "marketPrice",
          label: "Market Price",
          valueType: { type: "number" },
        },
        {
          id: "paidCapital",
          label: "Paid Capital",
          valueType: { type: "number" },
        },
        {
          id: "premiumToPaid",
          label: "Premium To Paid",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = historicalShareQuotedParValueGapTool.execute;
export default historicalShareQuotedParValueGapTool;
