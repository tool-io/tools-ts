import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caregiverId: string;
  readonly careRecipientId: string;
  readonly suppliedRelation: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caregiverId: { type: "string", maxLength: 8192, minLength: 1 },
    careRecipientId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caregiverId", "careRecipientId", "suppliedRelation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record ordered caregiver and recipient identifiers with a supplied relationship direction without inferring family structure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caregiverId, careRecipientId, suppliedRelation } = request;
  const compute = (): Output => {
    H.domain(caregiverId.length > 0, "caregiverId");
    H.domain(careRecipientId.length > 0, "careRecipientId");
    H.domain(suppliedRelation.length > 0, "suppliedRelation");
    return {
      token: JSON.stringify([caregiverId, careRecipientId, suppliedRelation]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caregiverId: "C17",
    careRecipientId: "P4",
    suppliedRelation: "daughter of recipient",
  },
  output: { token: '["C17","P4","daughter of recipient"]' },
} satisfies ToolExample<Input, Output>;
export const householdCaregiverRelationDirectionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gerontology/household-caregiver-relation-direction-tag",
      title: "Household Caregiver Relation Direction Tag Tool",
      description:
        "Record ordered caregiver and recipient identifiers with a supplied relationship direction without inferring family structure.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          caregiverId: { type: "string", maxLength: 8192, minLength: 1 },
          careRecipientId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRelation: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["caregiverId", "careRecipientId", "suppliedRelation"],
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
            id: "caregiverId",
            label: "Caregiver Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "careRecipientId",
            label: "Care Recipient Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRelation",
            label: "Supplied Relation",
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
export const run = householdCaregiverRelationDirectionTagTool.execute;
export default householdCaregiverRelationDirectionTagTool;
