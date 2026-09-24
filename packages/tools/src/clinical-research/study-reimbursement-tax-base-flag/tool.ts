import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gross: number;
  readonly expenses: number;
  readonly suppliedTaxRate: number;
  readonly expensesExempt: boolean;
};
export type Output = {
  readonly taxBase: number;
  readonly tax: number;
  readonly net: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number", minimum: 0 },
    expenses: { type: "number", minimum: 0 },
    suppliedTaxRate: { type: "number", minimum: 0, maximum: 1 },
    expensesExempt: { type: "boolean" },
  },
  required: ["gross", "expenses", "suppliedTaxRate", "expensesExempt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taxBase: { type: "number" },
    tax: { type: "number" },
    net: { type: "number" },
  },
  required: ["taxBase", "tax", "net"],
} as const;
/** Illustrate a supplied reimbursement tax-base assumption without determining tax treatment or withholding obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gross, expenses, suppliedTaxRate, expensesExempt } = request;
  const compute = (): Output => {
    H.domain(gross >= 0 && expenses >= 0 && expenses <= gross);
    H.probability(suppliedTaxRate);
    return {
      taxBase: gross - (expensesExempt ? expenses : 0),
      tax: (gross - (expensesExempt ? expenses : 0)) * suppliedTaxRate,
      net: gross - (gross - (expensesExempt ? expenses : 0)) * suppliedTaxRate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gross: 100,
    expenses: 20,
    suppliedTaxRate: 0.25,
    expensesExempt: true,
  },
  output: { taxBase: 80, tax: 20, net: 80 },
} satisfies ToolExample<Input, Output>;
export const studyReimbursementTaxBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-research/study-reimbursement-tax-base-flag",
    title: "Study Reimbursement Tax Base Flag Tool",
    description:
      "Illustrate a supplied reimbursement tax-base assumption without determining tax treatment or withholding obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gross: { type: "number", minimum: 0 },
        expenses: { type: "number", minimum: 0 },
        suppliedTaxRate: { type: "number", minimum: 0, maximum: 1 },
        expensesExempt: { type: "boolean" },
      },
      required: ["gross", "expenses", "suppliedTaxRate", "expensesExempt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taxBase: { type: "number" },
        tax: { type: "number" },
        net: { type: "number" },
      },
      required: ["taxBase", "tax", "net"],
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
          id: "expenses",
          label: "Expenses",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTaxRate",
          label: "Supplied Tax Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expensesExempt",
          label: "Expenses Exempt",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "taxBase", label: "Tax Base", valueType: { type: "number" } },
        { id: "tax", label: "Tax", valueType: { type: "number" } },
        { id: "net", label: "Net", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = studyReimbursementTaxBaseFlagTool.execute;
export default studyReimbursementTaxBaseFlagTool;
