import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly termText: string;
  readonly sourceId: string;
  readonly validFromDate: string;
  readonly validToDate: string;
};
export type Output = { readonly token: string; readonly intervalDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    termText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    validFromDate: { type: "string", maxLength: 8192 },
    validToDate: { type: "string", maxLength: 8192 },
  },
  required: ["termText", "sourceId", "validFromDate", "validToDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    intervalDays: { type: "integer" },
  },
  required: ["token", "intervalDays"],
} as const;
/** Qualify supplied gender-term wording by source and explicit date range without asserting current terminology or identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { termText, sourceId, validFromDate, validToDate } = request;
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
    H.domain(termText.length > 0 && sourceId.length > 0, "termText");
    H.domain(
      namedDate(validToDate, "validToDate") >=
        namedDate(validFromDate, "validFromDate"),
      "validToDate",
    );
    return {
      token: JSON.stringify([termText, sourceId, validFromDate, validToDate]),
      intervalDays:
        (namedDate(validToDate, "validToDate").getTime() -
          namedDate(validFromDate, "validFromDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    termText: "Term A",
    sourceId: "SRC2",
    validFromDate: "2026-10-28",
    validToDate: "2026-11-01",
  },
  output: {
    token: '["Term A","SRC2","2026-10-28","2026-11-01"]',
    intervalDays: 4,
  },
} satisfies ToolExample<Input, Output>;
export const genderTermSourceDateRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["gender-studies", "gender studies", "social sciences"],
      keywords: ["gender studies", "social sciences"],
    },
    id: "gender-studies/gender-term-source-date-range",
    title: "Gender Term Source Date Range",
    description:
      "Qualify supplied gender-term wording by source and explicit date range without asserting current terminology or identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        termText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        validFromDate: { type: "string", maxLength: 8192 },
        validToDate: { type: "string", maxLength: 8192 },
      },
      required: ["termText", "sourceId", "validFromDate", "validToDate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        intervalDays: { type: "integer" },
      },
      required: ["token", "intervalDays"],
    },
    ports: {
      inputs: [
        {
          id: "termText",
          label: "Term Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "validFromDate",
          label: "Valid From Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "validToDate",
          label: "Valid To Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "token", label: "Token", valueType: { type: "string" } },
        {
          id: "intervalDays",
          label: "Interval Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = genderTermSourceDateRangeTool.execute;
export default genderTermSourceDateRangeTool;
