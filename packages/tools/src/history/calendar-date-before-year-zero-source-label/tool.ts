import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedDateText: string;
  readonly yearNumberingConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
    yearNumberingConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedDateText", "yearNumberingConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit early-date text and supplied year-numbering convention without inserting year zero or converting calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedDateText, yearNumberingConvention } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedDateText.length > 0, "suppliedDateText");
    H.domain(yearNumberingConvention.length > 0, "yearNumberingConvention");
    return {
      token: JSON.stringify([
        recordId,
        suppliedDateText,
        yearNumberingConvention,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedDateText: "44 BCE",
    yearNumberingConvention: "historical BCE/CE",
  },
  output: { token: '["R17","44 BCE","historical BCE/CE"]' },
} satisfies ToolExample<Input, Output>;
export const calendarDateBeforeYearZeroSourceLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["history", "humanities"],
        keywords: ["history", "humanities"],
      },
      id: "history/calendar-date-before-year-zero-source-label",
      title: "Calendar Date Before Year Zero Source Label",
      description:
        "Preserve explicit early-date text and supplied year-numbering convention without inserting year zero or converting calendars.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDateText: { type: "string", maxLength: 8192, minLength: 1 },
          yearNumberingConvention: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["recordId", "suppliedDateText", "yearNumberingConvention"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      ports: {
        inputs: [
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDateText",
            label: "Supplied Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "yearNumberingConvention",
            label: "Year Numbering Convention",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = calendarDateBeforeYearZeroSourceLabelTool.execute;
export default calendarDateBeforeYearZeroSourceLabelTool;
