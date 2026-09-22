import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly willingnessToPay: number;
  readonly willingnessToAccept: number;
};
export type Output = {
  readonly absoluteGap: number;
  readonly acceptPayRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    willingnessToPay: { type: "number", exclusiveMinimum: 0 },
    willingnessToAccept: { type: "number", minimum: 0 },
  },
  required: ["willingnessToPay", "willingnessToAccept"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteGap: { type: "number" },
    acceptPayRatio: { type: "number" },
  },
  required: ["absoluteGap", "acceptPayRatio"],
} as const;
/** Compare explicitly elicited prices; a gap alone does not establish an endowment effect or cause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { willingnessToPay, willingnessToAccept } = request;
  const compute = (): Output => {
    H.positive(willingnessToPay);
    H.domain(willingnessToAccept >= 0);
    return {
      absoluteGap: willingnessToAccept - willingnessToPay,
      acceptPayRatio: willingnessToAccept / willingnessToPay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { willingnessToPay: 20, willingnessToAccept: 30 },
  output: { absoluteGap: 10, acceptPayRatio: 1.5 },
} satisfies ToolExample<Input, Output>;
export const endowmentBuySellPriceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/endowment-buy-sell-price-gap",
    title: "Endowment Buy Sell Price Gap Tool",
    description:
      "Compare explicitly elicited prices; a gap alone does not establish an endowment effect or cause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        willingnessToPay: { type: "number", exclusiveMinimum: 0 },
        willingnessToAccept: { type: "number", minimum: 0 },
      },
      required: ["willingnessToPay", "willingnessToAccept"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteGap: { type: "number" },
        acceptPayRatio: { type: "number" },
      },
      required: ["absoluteGap", "acceptPayRatio"],
    },
    ports: {
      inputs: [
        {
          id: "willingnessToPay",
          label: "Willingness To Pay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "willingnessToAccept",
          label: "Willingness To Accept",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteGap",
          label: "Absolute Gap",
          valueType: { type: "number" },
        },
        {
          id: "acceptPayRatio",
          label: "Accept Pay Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endowmentBuySellPriceGapTool.execute;
export default endowmentBuySellPriceGapTool;
