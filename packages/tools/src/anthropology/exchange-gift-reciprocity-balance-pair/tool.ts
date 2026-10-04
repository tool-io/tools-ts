import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly givenValue: number;
  readonly receivedValue: number;
};
export type Output = {
  readonly netReceived: number;
  readonly absoluteImbalance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    givenValue: { type: "number", minimum: 0 },
    receivedValue: { type: "number", minimum: 0 },
  },
  required: ["givenValue", "receivedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netReceived: { type: "number" },
    absoluteImbalance: { type: "number" },
  },
  required: ["netReceived", "absoluteImbalance"],
} as const;
/** Describe a recorded exchange imbalance in a caller-defined common value unit, without assigning social meaning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { givenValue, receivedValue } = request;
  const compute = (): Output => {
    H.domain(givenValue >= 0 && receivedValue >= 0, "givenValue");
    return {
      netReceived: receivedValue - givenValue,
      absoluteImbalance: Math.abs(receivedValue - givenValue),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { givenValue: 30, receivedValue: 45 },
  output: { netReceived: 15, absoluteImbalance: 15 },
} satisfies ToolExample<Input, Output>;
export const exchangeGiftReciprocityBalancePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/exchange-gift-reciprocity-balance-pair",
    title: "Exchange Gift Reciprocity Balance Pair Tool",
    description:
      "Describe a recorded exchange imbalance in a caller-defined common value unit, without assigning social meaning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        givenValue: { type: "number", minimum: 0 },
        receivedValue: { type: "number", minimum: 0 },
      },
      required: ["givenValue", "receivedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netReceived: { type: "number" },
        absoluteImbalance: { type: "number" },
      },
      required: ["netReceived", "absoluteImbalance"],
    },
    ports: {
      inputs: [
        {
          id: "givenValue",
          label: "Given Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "receivedValue",
          label: "Received Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "netReceived",
          label: "Net Received",
          valueType: { type: "number" },
        },
        {
          id: "absoluteImbalance",
          label: "Absolute Imbalance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = exchangeGiftReciprocityBalancePairTool.execute;
export default exchangeGiftReciprocityBalancePairTool;
