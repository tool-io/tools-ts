import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly recallDays: number;
  readonly respondentRole: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    recallDays: { type: "integer", minimum: 1 },
    respondentRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reportId", "recallDays", "respondentRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit caregiver-report respondent and recall-duration fields without selecting a questionnaire or interpreting answers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, recallDays, respondentRole } = request;
  const compute = (): Output => {
    H.domain(reportId.length > 0 && respondentRole.length > 0, "reportId");
    (H.domain(
      Number.isSafeInteger(recallDays) &&
        recallDays >= 1 &&
        recallDays <= Number.MAX_SAFE_INTEGER,
      "recallDays",
    ),
      recallDays);
    return {
      label:
        reportId +
        "; respondent=" +
        respondentRole +
        "; recall=" +
        recallDays +
        " days",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportId: "R17", recallDays: 7, respondentRole: "parent" },
  output: { label: "R17; respondent=parent; recall=7 days" },
} satisfies ToolExample<Input, Output>;
export const caregiverReportRecallPeriodLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/caregiver-report-recall-period-label",
    title: "Caregiver Report Recall Period Label",
    description:
      "Label explicit caregiver-report respondent and recall-duration fields without selecting a questionnaire or interpreting answers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        recallDays: { type: "integer", minimum: 1 },
        respondentRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reportId", "recallDays", "respondentRole"],
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
          id: "reportId",
          label: "Report Id",
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
          id: "respondentRole",
          label: "Respondent Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caregiverReportRecallPeriodLabelTool.execute;
export default caregiverReportRecallPeriodLabelTool;
