import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly giftValue: number;
  readonly rate: number;
  readonly fee: number;
  readonly feeInSourceCurrency: boolean;
};
export type Output = {
  readonly convertedValue: number;
  readonly convertedFee: number;
  readonly netValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    giftValue: { type: "number", minimum: 0 },
    rate: { type: "number", exclusiveMinimum: 0 },
    fee: { type: "number", minimum: 0 },
    feeInSourceCurrency: { type: "boolean" },
  },
  required: ["giftValue", "rate", "fee", "feeInSourceCurrency"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedValue: { type: "number" },
    convertedFee: { type: "number" },
    netValue: { type: "number" },
  },
  required: ["convertedValue", "convertedFee", "netValue"],
} as const;
/** Explicit currency-denomination arithmetic without determining gift acceptance or disclosure obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { giftValue, rate, fee, feeInSourceCurrency } = request;
  const compute = (): Output => {
    H.domain(giftValue >= 0 && fee >= 0);
    H.positive(rate);
    return {
      convertedValue: giftValue * rate,
      convertedFee: feeInSourceCurrency ? fee * rate : fee,
      netValue: giftValue * rate - (feeInSourceCurrency ? fee * rate : fee),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { giftValue: 100, rate: 2, fee: 5, feeInSourceCurrency: true },
  output: { convertedValue: 200, convertedFee: 10, netValue: 190 },
} satisfies ToolExample<Input, Output>;
export const giftValueConversionBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/gift-value-conversion-base-flag",
    title: "Gift Value Conversion Base Flag Tool",
    description:
      "Explicit currency-denomination arithmetic without determining gift acceptance or disclosure obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        giftValue: { type: "number", minimum: 0 },
        rate: { type: "number", exclusiveMinimum: 0 },
        fee: { type: "number", minimum: 0 },
        feeInSourceCurrency: { type: "boolean" },
      },
      required: ["giftValue", "rate", "fee", "feeInSourceCurrency"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        convertedValue: { type: "number" },
        convertedFee: { type: "number" },
        netValue: { type: "number" },
      },
      required: ["convertedValue", "convertedFee", "netValue"],
    },
    ports: {
      inputs: [
        {
          id: "giftValue",
          label: "Gift Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fee",
          label: "Fee",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feeInSourceCurrency",
          label: "Fee In Source Currency",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "convertedValue",
          label: "Converted Value",
          valueType: { type: "number" },
        },
        {
          id: "convertedFee",
          label: "Converted Fee",
          valueType: { type: "number" },
        },
        { id: "netValue", label: "Net Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = giftValueConversionBaseFlagTool.execute;
export default giftValueConversionBaseFlagTool;
