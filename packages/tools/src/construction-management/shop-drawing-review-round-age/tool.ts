import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roundSubmissionDate: string;
  readonly evaluationDate: string;
};
export type Output = { readonly signedCalendarDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundSubmissionDate: { type: "string", maxLength: 8192 },
    evaluationDate: { type: "string", maxLength: 8192 },
  },
  required: ["roundSubmissionDate", "evaluationDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalendarDays: { type: "integer" } },
  required: ["signedCalendarDays"],
} as const;
/** Calculate signed calendar age of one explicit shop-drawing review round without selecting turnaround targets. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roundSubmissionDate, evaluationDate } = request;
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
        (namedDate(evaluationDate, "evaluationDate").getTime() -
          namedDate(roundSubmissionDate, "roundSubmissionDate").getTime()) /
        86400000,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roundSubmissionDate: "2026-10-28", evaluationDate: "2026-11-01" },
  output: { signedCalendarDays: 4 },
} satisfies ToolExample<Input, Output>;
export const shopDrawingReviewRoundAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/shop-drawing-review-round-age",
    title: "Shop Drawing Review Round Age",
    description:
      "Calculate signed calendar age of one explicit shop-drawing review round without selecting turnaround targets.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundSubmissionDate: { type: "string", maxLength: 8192 },
        evaluationDate: { type: "string", maxLength: 8192 },
      },
      required: ["roundSubmissionDate", "evaluationDate"],
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
          id: "roundSubmissionDate",
          label: "Round Submission Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evaluationDate",
          label: "Evaluation Date",
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
export const run = shopDrawingReviewRoundAgeTool.execute;
export default shopDrawingReviewRoundAgeTool;
