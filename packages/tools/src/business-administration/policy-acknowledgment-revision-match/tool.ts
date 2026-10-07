import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly acknowledgedRevision: string;
  readonly currentRevision: string;
};
export type Output = { readonly matchesCurrent: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acknowledgedRevision: { type: "string", maxLength: 8192, minLength: 1 },
    currentRevision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["acknowledgedRevision", "currentRevision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matchesCurrent: { type: "boolean" } },
  required: ["matchesCurrent"],
} as const;
/** Compare exact supplied acknowledged and current policy revision identifiers without establishing consent or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { acknowledgedRevision, currentRevision } = request;
  const compute = (): Output => {
    H.domain(acknowledgedRevision.length > 0, "acknowledgedRevision");
    H.domain(currentRevision.length > 0, "currentRevision");
    return { matchesCurrent: acknowledgedRevision === currentRevision };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { acknowledgedRevision: "v2", currentRevision: "v2" },
  output: { matchesCurrent: true },
} satisfies ToolExample<Input, Output>;
export const policyAcknowledgmentRevisionMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "business-administration",
        "business administration",
        "business and finance",
      ],
      keywords: ["business administration", "business and finance"],
    },
    id: "business-administration/policy-acknowledgment-revision-match",
    title: "Policy Acknowledgment Revision Match",
    description:
      "Compare exact supplied acknowledged and current policy revision identifiers without establishing consent or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        acknowledgedRevision: { type: "string", maxLength: 8192, minLength: 1 },
        currentRevision: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["acknowledgedRevision", "currentRevision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matchesCurrent: { type: "boolean" } },
      required: ["matchesCurrent"],
    },
    ports: {
      inputs: [
        {
          id: "acknowledgedRevision",
          label: "Acknowledged Revision",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentRevision",
          label: "Current Revision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "matchesCurrent",
          label: "Matches Current",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyAcknowledgmentRevisionMatchTool.execute;
export default policyAcknowledgmentRevisionMatchTool;
