import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstAmount: number;
  readonly secondAmount: number;
};
export type Output = {
  readonly firstPerSecond: number;
  readonly secondPerFirst: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstAmount: { type: "number", exclusiveMinimum: 0 },
    secondAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstAmount", "secondAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPerSecond: { type: "number" },
    secondPerFirst: { type: "number" },
  },
  required: ["firstPerSecond", "secondPerFirst"],
} as const;
/** Return the two reciprocal positive amount ratios with their reference denominators explicitly distinguished. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstAmount, secondAmount } = request;
  const compute = (): Output => {
    (H.domain(firstAmount > 0, "firstAmount"), firstAmount);
    (H.domain(secondAmount > 0, "secondAmount"), secondAmount);
    return {
      firstPerSecond: firstAmount / secondAmount,
      secondPerFirst: secondAmount / firstAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstAmount: 3, secondAmount: 12 },
  output: { firstPerSecond: 0.25, secondPerFirst: 4 },
} satisfies ToolExample<Input, Output>;
export const shareDenominatorReversalPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/share-denominator-reversal-pair",
    title: "Share Denominator Reversal Pair Tool",
    description:
      "Return the two reciprocal positive amount ratios with their reference denominators explicitly distinguished.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstAmount: { type: "number", exclusiveMinimum: 0 },
        secondAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstAmount", "secondAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPerSecond: { type: "number" },
        secondPerFirst: { type: "number" },
      },
      required: ["firstPerSecond", "secondPerFirst"],
    },
    ports: {
      inputs: [
        {
          id: "firstAmount",
          label: "First Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondAmount",
          label: "Second Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstPerSecond",
          label: "First Per Second",
          valueType: { type: "number" },
        },
        {
          id: "secondPerFirst",
          label: "Second Per First",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = shareDenominatorReversalPairTool.execute;
export default shareDenominatorReversalPairTool;
