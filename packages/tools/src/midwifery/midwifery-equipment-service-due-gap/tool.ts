import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDueDate: string;
  readonly asOfDate: string;
};
export type Output = {
  readonly signedDaysUntilDue: number;
  readonly pastRecordedDueDate: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDueDate: { type: "string", maxLength: 8192 },
    asOfDate: { type: "string", maxLength: 8192 },
  },
  required: ["recordedDueDate", "asOfDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDaysUntilDue: { type: "number" },
    pastRecordedDueDate: { type: "boolean" },
  },
  required: ["signedDaysUntilDue", "pastRecordedDueDate"],
} as const;
/** Compare explicit equipment-service due and as-of dates without choosing a service interval or certifying device safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDueDate, asOfDate } = request;
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
    return (() => {
      const signedDaysUntilDue =
        (namedDate(recordedDueDate, "recordedDueDate").getTime() -
          namedDate(asOfDate, "asOfDate").getTime()) /
        86400000;
      return {
        signedDaysUntilDue,
        pastRecordedDueDate: signedDaysUntilDue < 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDueDate: "2026-11-05", asOfDate: "2026-11-01" },
  output: { signedDaysUntilDue: 4, pastRecordedDueDate: false },
} satisfies ToolExample<Input, Output>;
export const midwiferyEquipmentServiceDueGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/midwifery-equipment-service-due-gap",
    title: "Midwifery Equipment Service Due Gap",
    description:
      "Compare explicit equipment-service due and as-of dates without choosing a service interval or certifying device safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDueDate: { type: "string", maxLength: 8192 },
        asOfDate: { type: "string", maxLength: 8192 },
      },
      required: ["recordedDueDate", "asOfDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDaysUntilDue: { type: "number" },
        pastRecordedDueDate: { type: "boolean" },
      },
      required: ["signedDaysUntilDue", "pastRecordedDueDate"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDueDate",
          label: "Recorded Due Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "asOfDate",
          label: "As Of Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedDaysUntilDue",
          label: "Signed Days Until Due",
          valueType: { type: "number" },
        },
        {
          id: "pastRecordedDueDate",
          label: "Past Recorded Due Date",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = midwiferyEquipmentServiceDueGapTool.execute;
export default midwiferyEquipmentServiceDueGapTool;
