import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly threshold: number;
  readonly value: number;
  readonly belowAmount: number;
  readonly aboveAmount: number;
  readonly equalityAbove: boolean;
};
export type Output = { readonly amount: number; readonly jump: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    threshold: { type: "number" },
    value: { type: "number" },
    belowAmount: { type: "number" },
    aboveAmount: { type: "number" },
    equalityAbove: { type: "boolean" },
  },
  required: [
    "threshold",
    "value",
    "belowAmount",
    "aboveAmount",
    "equalityAbove",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { amount: { type: "number" }, jump: { type: "number" } },
  required: ["amount", "jump"],
} as const;
/** Evaluate a caller-defined step policy and its one-sided jump without selecting eligibility or legal rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { threshold, value, belowAmount, aboveAmount, equalityAbove } = request;
  const compute = (): Output => {
    return {
      amount: (equalityAbove ? value >= threshold : value > threshold)
        ? aboveAmount
        : belowAmount,
      jump: aboveAmount - belowAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    threshold: 100,
    value: 100,
    belowAmount: 50,
    aboveAmount: 0,
    equalityAbove: true,
  },
  output: { amount: 0, jump: -50 },
} satisfies ToolExample<Input, Output>;
export const thresholdCliffDiscontinuityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/threshold-cliff-discontinuity",
    title: "Threshold Cliff Discontinuity Tool",
    description:
      "Evaluate a caller-defined step policy and its one-sided jump without selecting eligibility or legal rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        threshold: { type: "number" },
        value: { type: "number" },
        belowAmount: { type: "number" },
        aboveAmount: { type: "number" },
        equalityAbove: { type: "boolean" },
      },
      required: [
        "threshold",
        "value",
        "belowAmount",
        "aboveAmount",
        "equalityAbove",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { amount: { type: "number" }, jump: { type: "number" } },
      required: ["amount", "jump"],
    },
    ports: {
      inputs: [
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "value",
          label: "Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "belowAmount",
          label: "Below Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aboveAmount",
          label: "Above Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityAbove",
          label: "Equality Above",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "amount", label: "Amount", valueType: { type: "number" } },
        { id: "jump", label: "Jump", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thresholdCliffDiscontinuityTool.execute;
export default thresholdCliffDiscontinuityTool;
