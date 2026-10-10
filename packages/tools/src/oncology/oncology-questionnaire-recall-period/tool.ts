import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly questionnaireId: string;
  readonly recallDays: number;
  readonly assessmentDate: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    questionnaireId: { type: "string", maxLength: 8192, minLength: 1 },
    recallDays: { type: "integer", minimum: 0 },
    assessmentDate: { type: "string", maxLength: 8192 },
  },
  required: ["questionnaireId", "recallDays", "assessmentDate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit oncology questionnaire recall length and assessment date without choosing a validated recall period. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { questionnaireId, recallDays, assessmentDate } = request;
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
    H.domain(questionnaireId.length > 0, "questionnaireId");
    (H.domain(
      Number.isSafeInteger(recallDays) &&
        recallDays >= 0 &&
        recallDays <= Number.MAX_SAFE_INTEGER,
      "recallDays",
    ),
      recallDays);
    namedDate(assessmentDate, "assessmentDate");
    return {
      label:
        questionnaireId +
        "; recall=" +
        recallDays +
        " days as of " +
        assessmentDate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    questionnaireId: "Q17",
    recallDays: 7,
    assessmentDate: "2026-11-01",
  },
  output: { label: "Q17; recall=7 days as of 2026-11-01" },
} satisfies ToolExample<Input, Output>;
export const oncologyQuestionnaireRecallPeriodTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oncology", "health and medicine"],
      keywords: ["oncology", "health and medicine"],
    },
    id: "oncology/oncology-questionnaire-recall-period",
    title: "Oncology Questionnaire Recall Period",
    description:
      "Label an explicit oncology questionnaire recall length and assessment date without choosing a validated recall period.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        questionnaireId: { type: "string", maxLength: 8192, minLength: 1 },
        recallDays: { type: "integer", minimum: 0 },
        assessmentDate: { type: "string", maxLength: 8192 },
      },
      required: ["questionnaireId", "recallDays", "assessmentDate"],
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
          id: "questionnaireId",
          label: "Questionnaire Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recallDays",
          label: "Recall Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "assessmentDate",
          label: "Assessment Date",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oncologyQuestionnaireRecallPeriodTool.execute;
export default oncologyQuestionnaireRecallPeriodTool;
