import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly invoice: number;
  readonly paid: number;
  readonly credited: number;
  readonly dueDate: string;
  readonly referenceDate: string;
};
export type Output = {
  readonly exposure: number;
  readonly daysPastDue: number;
  readonly overdueExposure: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invoice: { type: "number", minimum: 0 },
    paid: { type: "number", minimum: 0 },
    credited: { type: "number", minimum: 0 },
    dueDate: { type: "string", maxLength: 8192 },
    referenceDate: { type: "string", maxLength: 8192 },
  },
  required: ["invoice", "paid", "credited", "dueDate", "referenceDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number" },
    daysPastDue: { type: "integer" },
    overdueExposure: { type: "number" },
  },
  required: ["exposure", "daysPastDue", "overdueExposure"],
} as const;
/** Calculate invoice aging part paid exposure term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { invoice, paid, credited, dueDate, referenceDate } = request;
  const compute = (): Output => {
    H.domain(
      invoice >= 0 && paid >= 0 && credited >= 0 && paid + credited <= invoice,
    );
    return {
      exposure: invoice - paid - credited,
      daysPastDue: Math.max(
        0,
        (H.dateOnly(referenceDate).getTime() - H.dateOnly(dueDate).getTime()) /
          86400000,
      ),
      overdueExposure:
        H.dateOnly(referenceDate).getTime() > H.dateOnly(dueDate).getTime()
          ? invoice - paid - credited
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    invoice: 1000,
    paid: 300,
    credited: 100,
    dueDate: "2026-10-01",
    referenceDate: "2026-10-26",
  },
  output: { exposure: 600, daysPastDue: 25, overdueExposure: 600 },
} satisfies ToolExample<Input, Output>;
export const invoiceAgingPartPaidExposureTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-analytics/invoice-aging-part-paid-exposure-term",
    title: "Invoice Aging Part Paid Exposure Term Tool",
    description:
      "Calculate invoice aging part paid exposure term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invoice: { type: "number", minimum: 0 },
        paid: { type: "number", minimum: 0 },
        credited: { type: "number", minimum: 0 },
        dueDate: { type: "string", maxLength: 8192 },
        referenceDate: { type: "string", maxLength: 8192 },
      },
      required: ["invoice", "paid", "credited", "dueDate", "referenceDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposure: { type: "number" },
        daysPastDue: { type: "integer" },
        overdueExposure: { type: "number" },
      },
      required: ["exposure", "daysPastDue", "overdueExposure"],
    },
    ports: {
      inputs: [
        {
          id: "invoice",
          label: "Invoice",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paid",
          label: "Paid",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "credited",
          label: "Credited",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dueDate",
          label: "Due Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "exposure", label: "Exposure", valueType: { type: "number" } },
        {
          id: "daysPastDue",
          label: "Days Past Due",
          valueType: { type: "integer" },
        },
        {
          id: "overdueExposure",
          label: "Overdue Exposure",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = invoiceAgingPartPaidExposureTermTool.execute;
export default invoiceAgingPartPaidExposureTermTool;
