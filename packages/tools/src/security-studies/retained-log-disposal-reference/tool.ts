import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logRecordId: string;
  readonly dispositionReference: string;
  readonly policyVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    dispositionReference: { type: "string", maxLength: 8192, minLength: 1 },
    policyVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["logRecordId", "dispositionReference", "policyVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit retained-log disposition reference by policy version without deleting records or deciding retention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logRecordId, dispositionReference, policyVersion } = request;
  const compute = (): Output => {
    H.domain(logRecordId.length > 0, "logRecordId");
    H.domain(dispositionReference.length > 0, "dispositionReference");
    H.domain(policyVersion.length > 0, "policyVersion");
    return {
      token: JSON.stringify([logRecordId, dispositionReference, policyVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    logRecordId: "LOG17",
    dispositionReference: "DIS2",
    policyVersion: "v2",
  },
  output: { token: '["LOG17","DIS2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const retainedLogDisposalReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/retained-log-disposal-reference",
    title: "Retained Log Disposal Reference",
    description:
      "Qualify an explicit retained-log disposition reference by policy version without deleting records or deciding retention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        dispositionReference: { type: "string", maxLength: 8192, minLength: 1 },
        policyVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["logRecordId", "dispositionReference", "policyVersion"],
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
          id: "logRecordId",
          label: "Log Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dispositionReference",
          label: "Disposition Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "policyVersion",
          label: "Policy Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = retainedLogDisposalReferenceTool.execute;
export default retainedLogDisposalReferenceTool;
