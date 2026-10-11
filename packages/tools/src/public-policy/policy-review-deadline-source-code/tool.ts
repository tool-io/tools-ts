import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly policyId: string;
  readonly suppliedDeadlineText: string;
  readonly sourceCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    policyId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDeadlineText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["policyId", "suppliedDeadlineText", "sourceCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit policy-review deadline transcription by source without deciding legal due dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { policyId, suppliedDeadlineText, sourceCode } = request;
  const compute = (): Output => {
    H.domain(policyId.length > 0, "policyId");
    H.domain(suppliedDeadlineText.length > 0, "suppliedDeadlineText");
    H.domain(sourceCode.length > 0, "sourceCode");
    return {
      token: JSON.stringify([policyId, suppliedDeadlineText, sourceCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    policyId: "POL17",
    suppliedDeadlineText: "2026-11-01",
    sourceCode: "SRC2",
  },
  output: { token: '["POL17","2026-11-01","SRC2"]' },
} satisfies ToolExample<Input, Output>;
export const policyReviewDeadlineSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/policy-review-deadline-source-code",
    title: "Policy Review Deadline Source Code",
    description:
      "Qualify an explicit policy-review deadline transcription by source without deciding legal due dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        policyId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedDeadlineText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["policyId", "suppliedDeadlineText", "sourceCode"],
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
          id: "policyId",
          label: "Policy Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedDeadlineText",
          label: "Supplied Deadline Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceCode",
          label: "Source Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = policyReviewDeadlineSourceCodeTool.execute;
export default policyReviewDeadlineSourceCodeTool;
