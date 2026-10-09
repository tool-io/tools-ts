import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly exemptionCode: string;
  readonly authoritySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    exemptionCode: { type: "string", maxLength: 8192, minLength: 1 },
    authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "exemptionCode", "authoritySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly assigned exemption code and source without determining legal eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, exemptionCode, authoritySource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(exemptionCode.length > 0, "exemptionCode");
    H.domain(authoritySource.length > 0, "authoritySource");
    return {
      token: JSON.stringify([recordId, exemptionCode, authoritySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    exemptionCode: "EX-A",
    authoritySource: "Policy v2",
  },
  output: { token: '["R17","EX-A","Policy v2"]' },
} satisfies ToolExample<Input, Output>;
export const healthPolicyExemptionSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/health-policy-exemption-source-tag",
    title: "Health Policy Exemption Source Tag",
    description:
      "Record an explicitly assigned exemption code and source without determining legal eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        exemptionCode: { type: "string", maxLength: 8192, minLength: 1 },
        authoritySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "exemptionCode", "authoritySource"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exemptionCode",
          label: "Exemption Code",
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
export const run = healthPolicyExemptionSourceTagTool.execute;
export default healthPolicyExemptionSourceTagTool;
