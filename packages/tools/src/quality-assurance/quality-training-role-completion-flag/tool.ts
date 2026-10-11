import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleId: string;
  readonly required: boolean;
  readonly completionRecorded: boolean;
};
export type Output = { readonly outstandingRequiredTraining: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleId: { type: "string", maxLength: 8192, minLength: 1 },
    required: { type: "boolean" },
    completionRecorded: { type: "boolean" },
  },
  required: ["roleId", "required", "completionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outstandingRequiredTraining: { type: "boolean" } },
  required: ["outstandingRequiredTraining"],
} as const;
/** Combine explicit role-training requirement and completion flags without certifying training adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleId, required, completionRecorded } = request;
  const compute = (): Output => {
    H.domain(roleId.length > 0, "roleId");
    return { outstandingRequiredTraining: required && !completionRecorded };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roleId: "ROLE17", required: true, completionRecorded: false },
  output: { outstandingRequiredTraining: true },
} satisfies ToolExample<Input, Output>;
export const qualityTrainingRoleCompletionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "quality-assurance",
        "quality assurance",
        "research and quality management",
      ],
      keywords: ["quality assurance", "research and quality management"],
    },
    id: "quality-assurance/quality-training-role-completion-flag",
    title: "Quality Training Role Completion Flag",
    description:
      "Combine explicit role-training requirement and completion flags without certifying training adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleId: { type: "string", maxLength: 8192, minLength: 1 },
        required: { type: "boolean" },
        completionRecorded: { type: "boolean" },
      },
      required: ["roleId", "required", "completionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outstandingRequiredTraining: { type: "boolean" } },
      required: ["outstandingRequiredTraining"],
    },
    ports: {
      inputs: [
        {
          id: "roleId",
          label: "Role Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "completionRecorded",
          label: "Completion Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "outstandingRequiredTraining",
          label: "Outstanding Required Training",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qualityTrainingRoleCompletionFlagTool.execute;
export default qualityTrainingRoleCompletionFlagTool;
