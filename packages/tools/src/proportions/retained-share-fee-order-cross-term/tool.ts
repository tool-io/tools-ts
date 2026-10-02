import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly retainedFraction: number;
  readonly fee: number;
};
export type Output = {
  readonly shareThenFee: number;
  readonly feeThenShare: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    fee: { type: "number", minimum: 0 },
  },
  required: ["gross", "retainedFraction", "fee"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shareThenFee: { type: "number" },
    feeThenShare: { type: "number" },
    difference: { type: "number" },
  },
  required: ["shareThenFee", "feeThenShare", "difference"],
} as const;
/** Signed noncommutativity of subtracting a fixed fee and applying a retained share. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, retainedFraction, fee } = request;
  const compute = (): Output => {
    H.domain(gross >= 0 && fee >= 0);
    H.probability(retainedFraction);
    return {
      shareThenFee: gross * retainedFraction - fee,
      feeThenShare: (gross - fee) * retainedFraction,
      difference: -fee * (1 - retainedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gross: 100, retainedFraction: 0.8, fee: 10 },
  output: {
    shareThenFee: 70,
    feeThenShare: 72,
    difference: -1.9999999999999996,
  },
} satisfies ToolExample<Input, Output>;
export const retainedShareFeeOrderCrossTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/retained-share-fee-order-cross-term",
    title: "Retained Share Fee Order Cross Term Tool",
    description:
      "Signed noncommutativity of subtracting a fixed fee and applying a retained share.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number", minimum: 0 },
        retainedFraction: { type: "number", minimum: 0, maximum: 1 },
        fee: { type: "number", minimum: 0 },
      },
      required: ["gross", "retainedFraction", "fee"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shareThenFee: { type: "number" },
        feeThenShare: { type: "number" },
        difference: { type: "number" },
      },
      required: ["shareThenFee", "feeThenShare", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "gross",
          label: "Gross",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "fee",
          label: "Fee",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shareThenFee",
          label: "Share Then Fee",
          valueType: { type: "number" },
        },
        {
          id: "feeThenShare",
          label: "Fee Then Share",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = retainedShareFeeOrderCrossTermTool.execute;
export default retainedShareFeeOrderCrossTermTool;
