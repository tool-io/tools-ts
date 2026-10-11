import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseRecordId: string;
  readonly suppliedPriorityCode: string;
  readonly policySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPriorityCode: { type: "string", maxLength: 8192, minLength: 1 },
    policySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseRecordId", "suppliedPriorityCode", "policySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit housing waitlist priority code and source without assigning priority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseRecordId, suppliedPriorityCode, policySource } = request;
  const compute = (): Output => {
    H.domain(caseRecordId.length > 0, "caseRecordId");
    H.domain(suppliedPriorityCode.length > 0, "suppliedPriorityCode");
    H.domain(policySource.length > 0, "policySource");
    return {
      token: JSON.stringify([caseRecordId, suppliedPriorityCode, policySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseRecordId: "CASE17",
    suppliedPriorityCode: "P2",
    policySource: "Policy A",
  },
  output: { token: '["CASE17","P2","Policy A"]' },
} satisfies ToolExample<Input, Output>;
export const housingWaitlistPrioritySourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/housing-waitlist-priority-source-tag",
    title: "Housing Waitlist Priority Source Tag",
    description:
      "Preserve an explicit housing waitlist priority code and source without assigning priority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPriorityCode: { type: "string", maxLength: 8192, minLength: 1 },
        policySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseRecordId", "suppliedPriorityCode", "policySource"],
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
          id: "caseRecordId",
          label: "Case Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPriorityCode",
          label: "Supplied Priority Code",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = housingWaitlistPrioritySourceTagTool.execute;
export default housingWaitlistPrioritySourceTagTool;
