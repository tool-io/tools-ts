import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly actionId: string;
  readonly sourceId: string;
  readonly suppliedDelegationStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    actionId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDelegationStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["actionId", "sourceId", "suppliedDelegationStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit action delegation-status assertion and its policy source without determining consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { actionId, sourceId, suppliedDelegationStatus } = request;
  const compute = (): Output => {
    H.domain(actionId.length > 0, "actionId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(suppliedDelegationStatus.length > 0, "suppliedDelegationStatus");
    return {
      token: JSON.stringify([actionId, sourceId, suppliedDelegationStatus]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    actionId: "A17",
    sourceId: "P4",
    suppliedDelegationStatus: "nondelegable",
  },
  output: { token: '["A17","P4","nondelegable"]' },
} satisfies ToolExample<Input, Output>;
export const consentNondelegableActionTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/consent-nondelegable-action-tag",
    title: "Consent Nondelegable Action Tag",
    description:
      "Record an explicit action delegation-status assertion and its policy source without determining consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        actionId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDelegationStatus: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["actionId", "sourceId", "suppliedDelegationStatus"],
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
          id: "actionId",
          label: "Action Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDelegationStatus",
          label: "Supplied Delegation Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = consentNondelegableActionTagTool.execute;
export default consentNondelegableActionTagTool;
