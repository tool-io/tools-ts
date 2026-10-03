import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lineBase: number;
  readonly taxRate: number;
  readonly retentionRate: number;
  readonly retainTax: boolean;
};
export type Output = {
  readonly tax: number;
  readonly retention: number;
  readonly payable: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineBase: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    retentionRate: { type: "number", minimum: 0, maximum: 1 },
    retainTax: { type: "boolean" },
  },
  required: ["lineBase", "taxRate", "retentionRate", "retainTax"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tax: { type: "number" },
    retention: { type: "number" },
    payable: { type: "number" },
  },
  required: ["tax", "retention", "payable"],
} as const;
/** Explicit tax base and tax-inclusive/exclusive retention convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lineBase, taxRate, retentionRate, retainTax } = request;
  const compute = (): Output => {
    H.domain(lineBase >= 0 && taxRate >= 0);
    H.probability(retentionRate);
    return {
      tax: lineBase * taxRate,
      retention: lineBase * (retainTax ? 1 + taxRate : 1) * retentionRate,
      payable:
        lineBase * (1 + taxRate) -
        lineBase * (retainTax ? 1 + taxRate : 1) * retentionRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lineBase: 1000,
    taxRate: 0.1,
    retentionRate: 0.05,
    retainTax: false,
  },
  output: { tax: 100, retention: 50, payable: 1050 },
} satisfies ToolExample<Input, Output>;
export const procurementLineTaxRetentionOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/procurement-line-tax-retention-order",
    title: "Procurement Line Tax Retention Order Tool",
    description:
      "Explicit tax base and tax-inclusive/exclusive retention convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineBase: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        retentionRate: { type: "number", minimum: 0, maximum: 1 },
        retainTax: { type: "boolean" },
      },
      required: ["lineBase", "taxRate", "retentionRate", "retainTax"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        tax: { type: "number" },
        retention: { type: "number" },
        payable: { type: "number" },
      },
      required: ["tax", "retention", "payable"],
    },
    ports: {
      inputs: [
        {
          id: "lineBase",
          label: "Line Base",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxRate",
          label: "Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retentionRate",
          label: "Retention Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retainTax",
          label: "Retain Tax",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "retention", label: "Retention", valueType: { type: "number" } },
        { id: "payable", label: "Payable", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = procurementLineTaxRetentionOrderTool.execute;
export default procurementLineTaxRetentionOrderTool;
