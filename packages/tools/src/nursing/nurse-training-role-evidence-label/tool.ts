import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly trainingRecordId: string;
  readonly roleWording: string;
  readonly evidenceReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trainingRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    roleWording: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["trainingRecordId", "roleWording", "evidenceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied training role and evidence references without verifying credentials or scope of practice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trainingRecordId, roleWording, evidenceReference } = request;
  const compute = (): Output => {
    H.domain(trainingRecordId.length > 0, "trainingRecordId");
    H.domain(roleWording.length > 0, "roleWording");
    H.domain(evidenceReference.length > 0, "evidenceReference");
    return {
      token: JSON.stringify([trainingRecordId, roleWording, evidenceReference]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    trainingRecordId: "TR17",
    roleWording: "role A",
    evidenceReference: "Certificate record 3",
  },
  output: { token: '["TR17","role A","Certificate record 3"]' },
} satisfies ToolExample<Input, Output>;
export const nurseTrainingRoleEvidenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nursing", "health and medicine"],
      keywords: ["nursing", "health and medicine"],
    },
    id: "nursing/nurse-training-role-evidence-label",
    title: "Nurse Training Role Evidence Label",
    description:
      "Record supplied training role and evidence references without verifying credentials or scope of practice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trainingRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        roleWording: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["trainingRecordId", "roleWording", "evidenceReference"],
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
          id: "trainingRecordId",
          label: "Training Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roleWording",
          label: "Role Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceReference",
          label: "Evidence Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = nurseTrainingRoleEvidenceLabelTool.execute;
export default nurseTrainingRoleEvidenceLabelTool;
