import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedDayText: string;
  readonly suppliedMonthText: string;
  readonly suppliedYearText: string;
  readonly separator: string;
};
export type Output = { readonly dateLabel: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedDayText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMonthText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedYearText: { type: "string", maxLength: 8192, minLength: 1 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: [
    "suppliedDayText",
    "suppliedMonthText",
    "suppliedYearText",
    "separator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dateLabel: { type: "string", maxLength: 8192 } },
  required: ["dateLabel"],
} as const;
/** Join explicit Brazilian diary date-transcription fields without parsing ambiguous dates or converting calendars. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedDayText, suppliedMonthText, suppliedYearText, separator } =
    request;
  const compute = (): Output => {
    H.domain(
      suppliedDayText.length > 0 &&
        suppliedMonthText.length > 0 &&
        suppliedYearText.length > 0 &&
        separator.length > 0,
      "suppliedDayText",
    );
    return {
      dateLabel: [suppliedDayText, suppliedMonthText, suppliedYearText].join(
        separator,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedDayText: "03",
    suppliedMonthText: "04",
    suppliedYearText: "1950",
    separator: "/",
  },
  output: { dateLabel: "03/04/1950" },
} satisfies ToolExample<Input, Output>;
export const brazilianDiaryDateSeparatorTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "latin-american-studies",
        "latin american studies",
        "humanities",
      ],
      keywords: ["latin american studies", "humanities"],
    },
    id: "latin-american-studies/brazilian-diary-date-separator-token",
    title: "Brazilian Diary Date Separator Token",
    description:
      "Join explicit Brazilian diary date-transcription fields without parsing ambiguous dates or converting calendars.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedDayText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedMonthText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedYearText: { type: "string", maxLength: 8192, minLength: 1 },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: [
        "suppliedDayText",
        "suppliedMonthText",
        "suppliedYearText",
        "separator",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dateLabel: { type: "string", maxLength: 8192 } },
      required: ["dateLabel"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedDayText",
          label: "Supplied Day Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedMonthText",
          label: "Supplied Month Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedYearText",
          label: "Supplied Year Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "dateLabel", label: "Date Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = brazilianDiaryDateSeparatorTokenTool.execute;
export default brazilianDiaryDateSeparatorTokenTool;
