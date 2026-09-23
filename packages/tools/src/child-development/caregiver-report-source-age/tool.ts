import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationDate: string;
  readonly reportDate: string;
  readonly extractionDate: string;
};
export type Output = {
  readonly reportLagDays: number;
  readonly extractionLagDays: number;
  readonly observationAgeDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationDate: { type: "string", maxLength: 8192 },
    reportDate: { type: "string", maxLength: 8192 },
    extractionDate: { type: "string", maxLength: 8192 },
  },
  required: ["observationDate", "reportDate", "extractionDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportLagDays: { type: "integer" },
    extractionLagDays: { type: "integer" },
    observationAgeDays: { type: "integer" },
  },
  required: ["reportLagDays", "extractionLagDays", "observationAgeDays"],
} as const;
/** Calculate caregiver report source age from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationDate, reportDate, extractionDate } = request;
  const compute = (): Output => {
    return (() => {
      const a = H.dateOnly(observationDate).getTime(),
        b = H.dateOnly(reportDate).getTime(),
        c = H.dateOnly(extractionDate).getTime();
      H.domain(a <= b && b <= c);
      return {
        reportLagDays: (b - a) / 86400000,
        extractionLagDays: (c - b) / 86400000,
        observationAgeDays: (c - a) / 86400000,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationDate: "2024-01-01",
    reportDate: "2024-01-03",
    extractionDate: "2024-01-08",
  },
  output: { reportLagDays: 2, extractionLagDays: 5, observationAgeDays: 7 },
} satisfies ToolExample<Input, Output>;
export const caregiverReportSourceAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/caregiver-report-source-age",
    title: "Caregiver Report Source Age Tool",
    description:
      "Calculate caregiver report source age from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationDate: { type: "string", maxLength: 8192 },
        reportDate: { type: "string", maxLength: 8192 },
        extractionDate: { type: "string", maxLength: 8192 },
      },
      required: ["observationDate", "reportDate", "extractionDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportLagDays: { type: "integer" },
        extractionLagDays: { type: "integer" },
        observationAgeDays: { type: "integer" },
      },
      required: ["reportLagDays", "extractionLagDays", "observationAgeDays"],
    },
    ports: {
      inputs: [
        {
          id: "observationDate",
          label: "Observation Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportDate",
          label: "Report Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "extractionDate",
          label: "Extraction Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "reportLagDays",
          label: "Report Lag Days",
          valueType: { type: "integer" },
        },
        {
          id: "extractionLagDays",
          label: "Extraction Lag Days",
          valueType: { type: "integer" },
        },
        {
          id: "observationAgeDays",
          label: "Observation Age Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = caregiverReportSourceAgeTool.execute;
export default caregiverReportSourceAgeTool;
