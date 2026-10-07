import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly relationshipCode: string;
  readonly authoritySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    relationshipCode: { type: "string", maxLength: 8192, minLength: 1 },
    authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "relationshipCode", "authoritySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit proxy relationship code by supplied source without deciding proxy authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, relationshipCode, authoritySource } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(relationshipCode.length > 0, "relationshipCode");
    H.domain(authoritySource.length > 0, "authoritySource");
    return {
      token: JSON.stringify([participantId, relationshipCode, authoritySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    relationshipCode: "REL2",
    authoritySource: "Recorded source A",
  },
  output: { token: '["P17","REL2","Recorded source A"]' },
} satisfies ToolExample<Input, Output>;
export const proxyConsentRelationshipSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bioethics", "research and quality management"],
      keywords: ["bioethics", "research and quality management"],
    },
    id: "bioethics/proxy-consent-relationship-source-code",
    title: "Proxy Consent Relationship Source Code",
    description:
      "Qualify an explicit proxy relationship code by supplied source without deciding proxy authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        relationshipCode: { type: "string", maxLength: 8192, minLength: 1 },
        authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "relationshipCode", "authoritySource"],
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
          id: "relationshipCode",
          label: "Relationship Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authoritySource",
          label: "Authority Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = proxyConsentRelationshipSourceCodeTool.execute;
export default proxyConsentRelationshipSourceCodeTool;
