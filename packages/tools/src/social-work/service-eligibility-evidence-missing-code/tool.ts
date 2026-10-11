import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedMissingCode: string;
  readonly ruleSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedMissingCode: { type: "string", maxLength: 8192, minLength: 1 },
    ruleSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedMissingCode", "ruleSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit missing eligibility-evidence code by source without deciding service entitlement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedMissingCode, ruleSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedMissingCode.length > 0, "suppliedMissingCode");
    H.domain(ruleSource.length > 0, "ruleSource");
    return {
      token: JSON.stringify([recordId, suppliedMissingCode, ruleSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedMissingCode: "EVID2",
    ruleSource: "Policy A",
  },
  output: { token: '["R17","EVID2","Policy A"]' },
} satisfies ToolExample<Input, Output>;
export const serviceEligibilityEvidenceMissingCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["social-work", "social work", "social sciences"],
        keywords: ["social work", "social sciences"],
      },
      id: "social-work/service-eligibility-evidence-missing-code",
      title: "Service Eligibility Evidence Missing Code",
      description:
        "Qualify an explicit missing eligibility-evidence code by source without deciding service entitlement.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedMissingCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          ruleSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedMissingCode", "ruleSource"],
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
            id: "suppliedMissingCode",
            label: "Supplied Missing Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "ruleSource",
            label: "Rule Source",
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
export const run = serviceEligibilityEvidenceMissingCodeTool.execute;
export default serviceEligibilityEvidenceMissingCodeTool;
