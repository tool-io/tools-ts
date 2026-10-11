import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agreementId: string;
  readonly partyId: string;
  readonly roleWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agreementId: { type: "string", maxLength: 8192, minLength: 1 },
    partyId: { type: "string", maxLength: 8192, minLength: 1 },
    roleWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agreementId", "partyId", "roleWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit agreement party-role record without assigning legal responsibilities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agreementId, partyId, roleWording } = request;
  const compute = (): Output => {
    H.domain(agreementId.length > 0, "agreementId");
    H.domain(partyId.length > 0, "partyId");
    H.domain(roleWording.length > 0, "roleWording");
    return { token: JSON.stringify([agreementId, partyId, roleWording]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { agreementId: "AGR17", partyId: "ORG2", roleWording: "supplier" },
  output: { token: '["AGR17","ORG2","supplier"]' },
} satisfies ToolExample<Input, Output>;
export const qualityAgreementPartyRoleTool = H.defineSchemaCalculation<
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
    id: "quality-assurance/quality-agreement-party-role",
    title: "Quality Agreement Party Role",
    description:
      "Preserve an explicit agreement party-role record without assigning legal responsibilities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agreementId: { type: "string", maxLength: 8192, minLength: 1 },
        partyId: { type: "string", maxLength: 8192, minLength: 1 },
        roleWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["agreementId", "partyId", "roleWording"],
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
          id: "agreementId",
          label: "Agreement Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "partyId",
          label: "Party Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "roleWording",
          label: "Role Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = qualityAgreementPartyRoleTool.execute;
export default qualityAgreementPartyRoleTool;
