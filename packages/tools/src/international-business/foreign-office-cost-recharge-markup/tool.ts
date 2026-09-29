import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costPool: number;
  readonly allocatedFraction: number;
  readonly markupFraction: number;
  readonly recipientPerLocal: number;
};
export type Output = {
  readonly allocatedLocalCost: number;
  readonly localRecharge: number;
  readonly recipientRecharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costPool: { type: "number", minimum: 0 },
    allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
    markupFraction: { type: "number", exclusiveMinimum: -1 },
    recipientPerLocal: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "costPool",
    "allocatedFraction",
    "markupFraction",
    "recipientPerLocal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedLocalCost: { type: "number" },
    localRecharge: { type: "number" },
    recipientRecharge: { type: "number" },
  },
  required: ["allocatedLocalCost", "localRecharge", "recipientRecharge"],
} as const;
/** Explicit cost-pool allocation, markup and currency factor; no arm-length transfer-pricing conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costPool, allocatedFraction, markupFraction, recipientPerLocal } =
    request;
  const compute = (): Output => {
    H.domain(costPool >= 0 && markupFraction > -1);
    H.probability(allocatedFraction);
    H.positive(recipientPerLocal);
    return {
      allocatedLocalCost: costPool * allocatedFraction,
      localRecharge: costPool * allocatedFraction * (1 + markupFraction),
      recipientRecharge:
        costPool * allocatedFraction * (1 + markupFraction) * recipientPerLocal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    costPool: 10000,
    allocatedFraction: 0.2,
    markupFraction: 0.1,
    recipientPerLocal: 1.5,
  },
  output: {
    allocatedLocalCost: 2000,
    localRecharge: 2200,
    recipientRecharge: 3300,
  },
} satisfies ToolExample<Input, Output>;
export const foreignOfficeCostRechargeMarkupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/foreign-office-cost-recharge-markup",
    title: "Foreign Office Cost Recharge Markup Tool",
    description:
      "Explicit cost-pool allocation, markup and currency factor; no arm-length transfer-pricing conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costPool: { type: "number", minimum: 0 },
        allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
        markupFraction: { type: "number", exclusiveMinimum: -1 },
        recipientPerLocal: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "costPool",
        "allocatedFraction",
        "markupFraction",
        "recipientPerLocal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedLocalCost: { type: "number" },
        localRecharge: { type: "number" },
        recipientRecharge: { type: "number" },
      },
      required: ["allocatedLocalCost", "localRecharge", "recipientRecharge"],
    },
    ports: {
      inputs: [
        {
          id: "costPool",
          label: "Cost Pool",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedFraction",
          label: "Allocated Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "markupFraction",
          label: "Markup Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recipientPerLocal",
          label: "Recipient Per Local",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "allocatedLocalCost",
          label: "Allocated Local Cost",
          valueType: { type: "number" },
        },
        {
          id: "localRecharge",
          label: "Local Recharge",
          valueType: { type: "number" },
        },
        {
          id: "recipientRecharge",
          label: "Recipient Recharge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foreignOfficeCostRechargeMarkupTool.execute;
export default foreignOfficeCostRechargeMarkupTool;
