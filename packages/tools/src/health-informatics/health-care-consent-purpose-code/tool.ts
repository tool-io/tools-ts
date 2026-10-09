import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consentRecord: string;
  readonly purposeCode: string;
  readonly purposeSystem: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consentRecord: { type: "string", maxLength: 8192, minLength: 1 },
    purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
    purposeSystem: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["consentRecord", "purposeCode", "purposeSystem"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a recorded health-consent purpose code without inferring permission, scope, or legal consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consentRecord, purposeCode, purposeSystem } = request;
  const compute = (): Output => {
    H.domain(consentRecord.length > 0, "consentRecord");
    H.domain(purposeCode.length > 0, "purposeCode");
    H.domain(purposeSystem.length > 0, "purposeSystem");
    return {
      token: JSON.stringify([consentRecord, purposeCode, purposeSystem]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consentRecord: "C17",
    purposeCode: "research",
    purposeSystem: "urn:local:purposes",
  },
  output: { token: '["C17","research","urn:local:purposes"]' },
} satisfies ToolExample<Input, Output>;
export const healthCareConsentPurposeCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "health-informatics",
        "health informatics",
        "research and quality management",
      ],
      keywords: ["health informatics", "research and quality management"],
    },
    id: "health-informatics/health-care-consent-purpose-code",
    title: "Health Care Consent Purpose Code",
    description:
      "Qualify a recorded health-consent purpose code without inferring permission, scope, or legal consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consentRecord: { type: "string", maxLength: 8192, minLength: 1 },
        purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
        purposeSystem: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["consentRecord", "purposeCode", "purposeSystem"],
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
          id: "consentRecord",
          label: "Consent Record",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "purposeCode",
          label: "Purpose Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "purposeSystem",
          label: "Purpose System",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = healthCareConsentPurposeCodeTool.execute;
export default healthCareConsentPurposeCodeTool;
