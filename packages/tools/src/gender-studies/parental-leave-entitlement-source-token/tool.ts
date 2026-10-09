import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedEntitlementText: string;
  readonly policySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEntitlementText: { type: "string", maxLength: 8192, minLength: 1 },
    policySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedEntitlementText", "policySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit parental-leave entitlement wording and policy source without determining legal eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedEntitlementText, policySource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedEntitlementText.length > 0, "suppliedEntitlementText");
    H.domain(policySource.length > 0, "policySource");
    return {
      token: JSON.stringify([recordId, suppliedEntitlementText, policySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedEntitlementText: "12 weeks recorded",
    policySource: "Policy v2",
  },
  output: { token: '["R17","12 weeks recorded","Policy v2"]' },
} satisfies ToolExample<Input, Output>;
export const parentalLeaveEntitlementSourceTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["gender-studies", "gender studies", "social sciences"],
        keywords: ["gender studies", "social sciences"],
      },
      id: "gender-studies/parental-leave-entitlement-source-token",
      title: "Parental Leave Entitlement Source Token",
      description:
        "Preserve explicit parental-leave entitlement wording and policy source without determining legal eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedEntitlementText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          policySource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedEntitlementText", "policySource"],
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
            id: "suppliedEntitlementText",
            label: "Supplied Entitlement Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "policySource",
            label: "Policy Source",
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
export const run = parentalLeaveEntitlementSourceTokenTool.execute;
export default parentalLeaveEntitlementSourceTokenTool;
