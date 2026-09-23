import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoiceValue: number;
  readonly targetPerInvoice: number;
  readonly suppliedLimit: number;
  readonly compareInTargetCurrency: boolean;
};
export type Output = {
  readonly approvalBase: number;
  readonly withinSuppliedLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoiceValue: { type: "number", minimum: 0 },
    targetPerInvoice: { type: "number", exclusiveMinimum: 0 },
    suppliedLimit: { type: "number", minimum: 0 },
    compareInTargetCurrency: { type: "boolean" },
  },
  required: [
    "invoiceValue",
    "targetPerInvoice",
    "suppliedLimit",
    "compareInTargetCurrency",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    approvalBase: { type: "number" },
    withinSuppliedLimit: { type: "boolean" },
  },
  required: ["approvalBase", "withinSuppliedLimit"],
} as const;
/** Calculate invoice approval currency base flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    invoiceValue,
    targetPerInvoice,
    suppliedLimit,
    compareInTargetCurrency,
  } = request;
  const compute = (): Output => {
    H.domain(invoiceValue >= 0 && suppliedLimit >= 0);
    H.positive(targetPerInvoice);
    return {
      approvalBase: compareInTargetCurrency
        ? invoiceValue * targetPerInvoice
        : invoiceValue,
      withinSuppliedLimit:
        (compareInTargetCurrency
          ? invoiceValue * targetPerInvoice
          : invoiceValue) <= suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoiceValue: 100,
    targetPerInvoice: 2,
    suppliedLimit: 150,
    compareInTargetCurrency: true,
  },
  output: { approvalBase: 200, withinSuppliedLimit: false },
} satisfies ToolExample<Input, Output>;
export const invoiceApprovalCurrencyBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/invoice-approval-currency-base-flag",
    title: "Invoice Approval Currency Base Flag Tool",
    description:
      "Calculate invoice approval currency base flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoiceValue: { type: "number", minimum: 0 },
        targetPerInvoice: { type: "number", exclusiveMinimum: 0 },
        suppliedLimit: { type: "number", minimum: 0 },
        compareInTargetCurrency: { type: "boolean" },
      },
      required: [
        "invoiceValue",
        "targetPerInvoice",
        "suppliedLimit",
        "compareInTargetCurrency",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        approvalBase: { type: "number" },
        withinSuppliedLimit: { type: "boolean" },
      },
      required: ["approvalBase", "withinSuppliedLimit"],
    },
    ports: {
      inputs: [
        {
          id: "invoiceValue",
          label: "Invoice Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetPerInvoice",
          label: "Target Per Invoice",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLimit",
          label: "Supplied Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compareInTargetCurrency",
          label: "Compare In Target Currency",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "approvalBase",
          label: "Approval Base",
          valueType: { type: "number" },
        },
        {
          id: "withinSuppliedLimit",
          label: "Within Supplied Limit",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceApprovalCurrencyBaseFlagTool.execute;
export default invoiceApprovalCurrencyBaseFlagTool;
