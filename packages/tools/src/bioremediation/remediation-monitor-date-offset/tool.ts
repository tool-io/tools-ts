import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceDate: string;
  readonly monitoringDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceDate: { type: "string", maxLength: 8192 },
    monitoringDate: { type: "string", maxLength: 8192 },
  },
  required: ["referenceDate", "monitoringDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days from an explicit reference date to a monitoring date without setting sampling schedules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceDate, monitoringDate } = request;
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
        (namedDate(monitoringDate, "monitoringDate").getTime() -
          namedDate(referenceDate, "referenceDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceDate: "2026-10-28", monitoringDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const remediationMonitorDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioremediation", "biology"],
      keywords: ["bioremediation", "biology"],
    },
    id: "bioremediation/remediation-monitor-date-offset",
    title: "Remediation Monitor Date Offset",
    description:
      "Count signed calendar days from an explicit reference date to a monitoring date without setting sampling schedules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceDate: { type: "string", maxLength: 8192 },
        monitoringDate: { type: "string", maxLength: 8192 },
      },
      required: ["referenceDate", "monitoringDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalendarDays: { type: "number" } },
      required: ["signedCalendarDays"],
    },
    ports: {
      inputs: [
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "monitoringDate",
          label: "Monitoring Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signedCalendarDays",
          label: "Signed Calendar Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = remediationMonitorDateOffsetTool.execute;
export default remediationMonitorDateOffsetTool;
