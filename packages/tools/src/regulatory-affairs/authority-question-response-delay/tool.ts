import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly questionDate: string;
  readonly responseDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questionDate: { type: "string", maxLength: 8192 },
    responseDate: { type: "string", maxLength: 8192 },
  },
  required: ["questionDate", "responseDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "number" } },
  required: ["signedCalendarDays"],
} as const;
/** Count signed calendar days between explicit authority-question and response dates without applying regulatory deadlines. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { questionDate, responseDate } = request;
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
        (namedDate(responseDate, "responseDate").getTime() -
          namedDate(questionDate, "questionDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { questionDate: "2026-10-28", responseDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const authorityQuestionResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/authority-question-response-delay",
    title: "Authority Question Response Delay",
    description:
      "Count signed calendar days between explicit authority-question and response dates without applying regulatory deadlines.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        questionDate: { type: "string", maxLength: 8192 },
        responseDate: { type: "string", maxLength: 8192 },
      },
      required: ["questionDate", "responseDate"],
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
          id: "questionDate",
          label: "Question Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseDate",
          label: "Response Date",
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
export const run = authorityQuestionResponseDelayTool.execute;
export default authorityQuestionResponseDelayTool;
