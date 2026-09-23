import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receiptTotal: number;
  readonly allocatedFraction: number;
  readonly priorReimbursement: number;
  readonly cap: number;
};
export type Output = { readonly allocated: number; readonly payable: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receiptTotal: { type: "number", minimum: 0 },
    allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
    priorReimbursement: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["receiptTotal", "allocatedFraction", "priorReimbursement", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocated: { type: "number" }, payable: { type: "number" } },
  required: ["allocated", "payable"],
} as const;
/** Calculate expense cap shared receipt term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receiptTotal, allocatedFraction, priorReimbursement, cap } = request;
  const compute = (): Output => {
    H.domain(receiptTotal >= 0 && priorReimbursement >= 0 && cap >= 0);
    H.probability(allocatedFraction);
    return {
      allocated: receiptTotal * allocatedFraction,
      payable: Math.max(
        0,
        Math.min(receiptTotal * allocatedFraction - priorReimbursement, cap),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    receiptTotal: 100,
    allocatedFraction: 0.5,
    priorReimbursement: 10,
    cap: 30,
  },
  output: { allocated: 50, payable: 30 },
} satisfies ToolExample<Input, Output>;
export const expenseCapSharedReceiptTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/expense-cap-shared-receipt-term",
    title: "Expense Cap Shared Receipt Term Tool",
    description:
      "Calculate expense cap shared receipt term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        receiptTotal: { type: "number", minimum: 0 },
        allocatedFraction: { type: "number", minimum: 0, maximum: 1 },
        priorReimbursement: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
      },
      required: [
        "receiptTotal",
        "allocatedFraction",
        "priorReimbursement",
        "cap",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocated: { type: "number" },
        payable: { type: "number" },
      },
      required: ["allocated", "payable"],
    },
    ports: {
      inputs: [
        {
          id: "receiptTotal",
          label: "Receipt Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedFraction",
          label: "Allocated Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "priorReimbursement",
          label: "Prior Reimbursement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "allocated", label: "Allocated", valueType: { type: "number" } },
        { id: "payable", label: "Payable", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = expenseCapSharedReceiptTermTool.execute;
export default expenseCapSharedReceiptTermTool;
