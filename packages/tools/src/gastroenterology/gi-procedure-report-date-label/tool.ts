import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly procedureCode: string;
  readonly reportDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
    reportDate: { type: "string", maxLength: 8192 },
  },
  required: ["procedureCode", "reportDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit Gregorian report date to a procedure identifier without inferring when the procedure occurred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { procedureCode, reportDate } = request;
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
    H.domain(procedureCode.length > 0, "procedureCode");
    namedDate(reportDate, "reportDate");
    return { label: procedureCode + "; report=" + reportDate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { procedureCode: "GI17", reportDate: "2026-11-01" },
  output: { label: "GI17; report=2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const giProcedureReportDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gastroenterology", "health and medicine"],
      keywords: ["gastroenterology", "health and medicine"],
    },
    id: "gastroenterology/gi-procedure-report-date-label",
    title: "GI Procedure Report Date Label",
    description:
      "Attach an explicit Gregorian report date to a procedure identifier without inferring when the procedure occurred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        procedureCode: { type: "string", maxLength: 8192, minLength: 1 },
        reportDate: { type: "string", maxLength: 8192 },
      },
      required: ["procedureCode", "reportDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "procedureCode",
          label: "Procedure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportDate",
          label: "Report Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = giProcedureReportDateLabelTool.execute;
export default giProcedureReportDateLabelTool;
