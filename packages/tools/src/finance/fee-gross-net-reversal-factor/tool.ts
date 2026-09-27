import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly net: number;
  readonly suppliedFeeRate: number;
  readonly suppliedFixedFee: number;
};
export type Output = {
  readonly gross: number;
  readonly fee: number;
  readonly grossUpFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    net: { type: "number" },
    suppliedFeeRate: { type: "number", exclusiveMaximum: 1 },
    suppliedFixedFee: { type: "number" },
  },
  required: ["net", "suppliedFeeRate", "suppliedFixedFee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    fee: { type: "number" },
    grossUpFactor: { type: "number" },
  },
  required: ["gross", "fee", "grossUpFactor"],
} as const;
/** Invert net=gross*(1−rate)−fixed fee using explicit signed inputs, retaining valid rebate rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { net, suppliedFeeRate, suppliedFixedFee } = request;
  const compute = (): Output => {
    H.domain(suppliedFeeRate < 1);
    return {
      gross: (net + suppliedFixedFee) / (1 - suppliedFeeRate),
      fee: (net + suppliedFixedFee) / (1 - suppliedFeeRate) - net,
      grossUpFactor: 1 / (1 - suppliedFeeRate),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { net: 90, suppliedFeeRate: 0.1, suppliedFixedFee: 0 },
  output: { gross: 100, fee: 10, grossUpFactor: 1.1111111111111112 },
} satisfies ToolExample<Input, Output>;
export const feeGrossNetReversalFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/fee-gross-net-reversal-factor",
    title: "Fee Gross Net Reversal Factor Tool",
    description:
      "Invert net=gross*(1−rate)−fixed fee using explicit signed inputs, retaining valid rebate rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        net: { type: "number" },
        suppliedFeeRate: { type: "number", exclusiveMaximum: 1 },
        suppliedFixedFee: { type: "number" },
      },
      required: ["net", "suppliedFeeRate", "suppliedFixedFee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number" },
        fee: { type: "number" },
        grossUpFactor: { type: "number" },
      },
      required: ["gross", "fee", "grossUpFactor"],
    },
    ports: {
      inputs: [
        {
          id: "net",
          label: "Net",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFeeRate",
          label: "Supplied Fee Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFixedFee",
          label: "Supplied Fixed Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gross", label: "Gross", valueType: { type: "number" } },
        { id: "fee", label: "Fee", valueType: { type: "number" } },
        {
          id: "grossUpFactor",
          label: "Gross Up Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feeGrossNetReversalFactorTool.execute;
export default feeGrossNetReversalFactorTool;
