import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occasionId: string;
  readonly respondentCode: string;
  readonly reportedRole: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occasionId: { type: "string", maxLength: 8192, minLength: 1 },
    respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
    reportedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["occasionId", "respondentCode", "reportedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Record an explicitly reported household role for a purchase occasion without inferring gender, identity or decision power. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occasionId, respondentCode, reportedRole } = request;
  const compute = (): Output => {
    H.domain(
      occasionId.length > 0 &&
        respondentCode.length > 0 &&
        reportedRole.length > 0,
      "occasionId",
    );
    return { tag: JSON.stringify([occasionId, respondentCode, reportedRole]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { occasionId: "O17", respondentCode: "P3", reportedRole: "purchaser" },
  output: { tag: '["O17","P3","purchaser"]' },
} satisfies ToolExample<Input, Output>;
export const purchaseOccasionHouseholdRoleTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/purchase-occasion-household-role-tag",
    title: "Purchase Occasion Household Role Tag",
    description:
      "Record an explicitly reported household role for a purchase occasion without inferring gender, identity or decision power.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occasionId: { type: "string", maxLength: 8192, minLength: 1 },
        respondentCode: { type: "string", maxLength: 8192, minLength: 1 },
        reportedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["occasionId", "respondentCode", "reportedRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "occasionId",
          label: "Occasion Id",
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
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = purchaseOccasionHouseholdRoleTagTool.execute;
export default purchaseOccasionHouseholdRoleTagTool;
