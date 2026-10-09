import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderDate: string;
  readonly suppliedRetentionEndDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderDate: { type: "string", maxLength: 8192 },
    suppliedRetentionEndDate: { type: "string", maxLength: 8192 },
  },
  required: ["orderDate", "suppliedRetentionEndDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed calendar days between supplied retention-order and retention-end dates without interpreting legal duties. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderDate, suppliedRetentionEndDate } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    return {
      signedCalendarDays:
        (namedDate(
          suppliedRetentionEndDate,
          "suppliedRetentionEndDate",
        ).getTime() -
          namedDate(orderDate, "orderDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderDate: "2026-10-28", suppliedRetentionEndDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const evidenceRetentionOrderDateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/evidence-retention-order-date-gap",
    title: "Evidence Retention Order Date Gap Tool",
    description:
      "Calculate signed calendar days between supplied retention-order and retention-end dates without interpreting legal duties.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderDate: { type: "string", maxLength: 8192 },
        suppliedRetentionEndDate: { type: "string", maxLength: 8192 },
      },
      required: ["orderDate", "suppliedRetentionEndDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "integer" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "orderDate",
          label: "Order Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedRetentionEndDate",
          label: "Supplied Retention End Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = evidenceRetentionOrderDateGapTool.execute;
export default evidenceRetentionOrderDateGapTool;
