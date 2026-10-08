import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedbackId: string;
  readonly suppliedBarrierCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedbackId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBarrierCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["feedbackId", "suppliedBarrierCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly reported accessibility barrier code by source without assigning disability or evaluating compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedbackId, suppliedBarrierCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(feedbackId.length > 0, "feedbackId");
    H.domain(suppliedBarrierCode.length > 0, "suppliedBarrierCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([feedbackId, suppliedBarrierCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedbackId: "F17",
    suppliedBarrierCode: "BAR2",
    codeSource: "Community key A",
  },
  output: { token: '["F17","BAR2","Community key A"]' },
} satisfies ToolExample<Input, Output>;
export const accessibilityFeedbackBarrierCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["disability-studies", "disability studies", "social sciences"],
      keywords: ["disability studies", "social sciences"],
    },
    id: "disability-studies/accessibility-feedback-barrier-code",
    title: "Accessibility Feedback Barrier Code",
    description:
      "Qualify an explicitly reported accessibility barrier code by source without assigning disability or evaluating compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedbackId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedBarrierCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["feedbackId", "suppliedBarrierCode", "codeSource"],
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
          id: "feedbackId",
          label: "Feedback Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBarrierCode",
          label: "Supplied Barrier Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = accessibilityFeedbackBarrierCodeTool.execute;
export default accessibilityFeedbackBarrierCodeTool;
