import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseAmount: number;
  readonly indexIncrease: number;
  readonly priceIncrease: number;
};
export type Output = {
  readonly indexedAmount: number;
  readonly realBaseValue: number;
  readonly realGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseAmount: { type: "number", minimum: 0 },
    indexIncrease: { type: "number", exclusiveMinimum: -1 },
    priceIncrease: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["baseAmount", "indexIncrease", "priceIncrease"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    indexedAmount: { type: "number" },
    realBaseValue: { type: "number" },
    realGap: { type: "number" },
  },
  required: ["indexedAmount", "realBaseValue", "realGap"],
} as const;
/** Calculate policy indexation real value gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseAmount, indexIncrease, priceIncrease } = request;
  const compute = (): Output => {
    H.domain(baseAmount >= 0 && indexIncrease > -1 && priceIncrease > -1);
    return {
      indexedAmount: baseAmount * (1 + indexIncrease),
      realBaseValue: (baseAmount * (1 + indexIncrease)) / (1 + priceIncrease),
      realGap:
        (baseAmount * (1 + indexIncrease)) / (1 + priceIncrease) - baseAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseAmount: 100, indexIncrease: 0.05, priceIncrease: 0.2 },
  output: { indexedAmount: 105, realBaseValue: 87.5, realGap: -12.5 },
} satisfies ToolExample<Input, Output>;
export const policyIndexationRealValueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-indexation-real-value-gap",
    title: "Policy Indexation Real Value Gap Tool",
    description:
      "Calculate policy indexation real value gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseAmount: { type: "number", minimum: 0 },
        indexIncrease: { type: "number", exclusiveMinimum: -1 },
        priceIncrease: { type: "number", exclusiveMinimum: -1 },
      },
      required: ["baseAmount", "indexIncrease", "priceIncrease"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        indexedAmount: { type: "number" },
        realBaseValue: { type: "number" },
        realGap: { type: "number" },
      },
      required: ["indexedAmount", "realBaseValue", "realGap"],
    },
    ports: {
      inputs: [
        {
          id: "baseAmount",
          label: "Base Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "indexIncrease",
          label: "Index Increase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priceIncrease",
          label: "Price Increase",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "indexedAmount",
          label: "Indexed Amount",
          valueType: { type: "number" },
        },
        {
          id: "realBaseValue",
          label: "Real Base Value",
          valueType: { type: "number" },
        },
        { id: "realGap", label: "Real Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = policyIndexationRealValueGapTool.execute;
export default policyIndexationRealValueGapTool;
