import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly respondentCode: string;
  readonly reportedRole: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
    reportedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reportId", "respondentCode", "reportedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicit caregiver-report respondent and role fields without inferring a family relationship or legal authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, respondentCode, reportedRole } = request;
  const compute = (): Output => {
    H.domain(
      reportId.length > 0 &&
        respondentCode.length > 0 &&
        reportedRole.length > 0,
      "reportId",
    );
    return {
      label:
        reportId + "; respondent=" + respondentCode + "; role=" + reportedRole,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportId: "R17", respondentCode: "P3", reportedRole: "guardian" },
  output: { label: "R17; respondent=P3; role=guardian" },
} satisfies ToolExample<Input, Output>;
export const caregiverReportRoleLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/caregiver-report-role-label",
    title: "Caregiver Report Role Label",
    description:
      "Label explicit caregiver-report respondent and role fields without inferring a family relationship or legal authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
        reportedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reportId", "respondentCode", "reportedRole"],
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
          id: "respondentCode",
          label: "Respondent Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedRole",
          label: "Reported Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caregiverReportRoleLabelTool.execute;
export default caregiverReportRoleLabelTool;
