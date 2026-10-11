import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly noticeId: string;
  readonly suppliedAuthorCredit: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noticeId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAuthorCredit: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["noticeId", "suppliedAuthorCredit", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit administrative security-notice authorship reference without authenticating the notice. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noticeId, suppliedAuthorCredit, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(noticeId.length > 0, "noticeId");
    H.domain(suppliedAuthorCredit.length > 0, "suppliedAuthorCredit");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([noticeId, suppliedAuthorCredit, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    noticeId: "N17",
    suppliedAuthorCredit: "Author A",
    sourceVersion: "v2",
  },
  output: { token: '["N17","Author A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const securityNoticeAuthorshipReferenceTool = H.defineSchemaCalculation<
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
    id: "security-studies/security-notice-authorship-reference",
    title: "Security Notice Authorship Reference",
    description:
      "Qualify an explicit administrative security-notice authorship reference without authenticating the notice.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noticeId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAuthorCredit: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["noticeId", "suppliedAuthorCredit", "sourceVersion"],
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
          id: "noticeId",
          label: "Notice Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAuthorCredit",
          label: "Supplied Author Credit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = securityNoticeAuthorshipReferenceTool.execute;
export default securityNoticeAuthorshipReferenceTool;
