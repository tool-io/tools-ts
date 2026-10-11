import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly agencyId: string;
  readonly formId: string;
  readonly issueVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    agencyId: { type: "string", maxLength: 8192, minLength: 1 },
    formId: { type: "string", maxLength: 8192, minLength: 1 },
    issueVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["agencyId", "formId", "issueVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit agency-form issue reference by version without retrieving or validating the form. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { agencyId, formId, issueVersion } = request;
  const compute = (): Output => {
    H.domain(agencyId.length > 0, "agencyId");
    H.domain(formId.length > 0, "formId");
    H.domain(issueVersion.length > 0, "issueVersion");
    return { token: JSON.stringify([agencyId, formId, issueVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { agencyId: "AG17", formId: "FORM2", issueVersion: "v2" },
  output: { token: '["AG17","FORM2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const agencyFormVersionIssuePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/agency-form-version-issue-pair",
    title: "Agency Form Version Issue Pair",
    description:
      "Qualify an explicit agency-form issue reference by version without retrieving or validating the form.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        agencyId: { type: "string", maxLength: 8192, minLength: 1 },
        formId: { type: "string", maxLength: 8192, minLength: 1 },
        issueVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["agencyId", "formId", "issueVersion"],
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
          id: "agencyId",
          label: "Agency Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "formId",
          label: "Form Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "issueVersion",
          label: "Issue Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agencyFormVersionIssuePairTool.execute;
export default agencyFormVersionIssuePairTool;
