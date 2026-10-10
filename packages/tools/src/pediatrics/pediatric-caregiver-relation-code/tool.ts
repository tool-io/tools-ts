import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly caregiverId: string;
  readonly relationCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    caregiverId: { type: "string", maxLength: 8192, minLength: 1 },
    relationCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "caregiverId", "relationCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicitly assigned caregiver relationship codes without verifying identity or legal authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, caregiverId, relationCode } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(caregiverId.length > 0, "caregiverId");
    H.domain(relationCode.length > 0, "relationCode");
    return {
      token: JSON.stringify([participantId, caregiverId, relationCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    caregiverId: "C2",
    relationCode: "recorded-parent",
  },
  output: { token: '["P17","C2","recorded-parent"]' },
} satisfies ToolExample<Input, Output>;
export const pediatricCaregiverRelationCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pediatrics", "health and medicine"],
      keywords: ["pediatrics", "health and medicine"],
    },
    id: "pediatrics/pediatric-caregiver-relation-code",
    title: "Pediatric Caregiver Relation Code",
    description:
      "Record explicitly assigned caregiver relationship codes without verifying identity or legal authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        caregiverId: { type: "string", maxLength: 8192, minLength: 1 },
        relationCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "caregiverId", "relationCode"],
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
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caregiverId",
          label: "Caregiver Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relationCode",
          label: "Relation Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pediatricCaregiverRelationCodeTool.execute;
export default pediatricCaregiverRelationCodeTool;
