import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purchase: number;
  readonly deposit: number;
  readonly taxRate: number;
  readonly depositTaxable: boolean;
};
export type Output = {
  readonly taxBase: number;
  readonly tax: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purchase: { type: "number", minimum: 0 },
    deposit: { type: "number", minimum: 0 },
    taxRate: { type: "number", minimum: 0 },
    depositTaxable: { type: "boolean" },
  },
  required: ["purchase", "deposit", "taxRate", "depositTaxable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxBase: { type: "number" },
    tax: { type: "number" },
    total: { type: "number" },
  },
  required: ["taxBase", "tax", "total"],
} as const;
/** Tax arithmetic with an explicit deposit-inclusion policy; no jurisdictional treatment is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { purchase, deposit, taxRate, depositTaxable } = request;
  const compute = (): Output => {
    H.domain(purchase >= 0 && deposit >= 0 && taxRate >= 0);
    return {
      taxBase: purchase + (depositTaxable ? deposit : 0),
      tax: (purchase + (depositTaxable ? deposit : 0)) * taxRate,
      total:
        purchase +
        deposit +
        (purchase + (depositTaxable ? deposit : 0)) * taxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { purchase: 20, deposit: 5, taxRate: 0.2, depositTaxable: false },
  output: { taxBase: 20, tax: 4, total: 29 },
} satisfies ToolExample<Input, Output>;
export const minibarDepositVatbaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/minibar-deposit-vatbase-flag",
    title: "Minibar Deposit Vatbase Flag Tool",
    description:
      "Tax arithmetic with an explicit deposit-inclusion policy; no jurisdictional treatment is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purchase: { type: "number", minimum: 0 },
        deposit: { type: "number", minimum: 0 },
        taxRate: { type: "number", minimum: 0 },
        depositTaxable: { type: "boolean" },
      },
      required: ["purchase", "deposit", "taxRate", "depositTaxable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxBase: { type: "number" },
        tax: { type: "number" },
        total: { type: "number" },
      },
      required: ["taxBase", "tax", "total"],
    },
    ports: {
      inputs: [
        {
          id: "purchase",
          label: "Purchase",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deposit",
          label: "Deposit",
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
          id: "depositTaxable",
          label: "Deposit Taxable",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "total", label: "Total", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = minibarDepositVatbaseFlagTool.execute;
export default minibarDepositVatbaseFlagTool;
