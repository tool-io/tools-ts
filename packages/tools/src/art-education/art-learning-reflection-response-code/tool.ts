import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerId: string;
  readonly promptId: string;
  readonly responseCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerId: { type: "string", maxLength: 8192, minLength: 1 },
    promptId: { type: "string", maxLength: 8192, minLength: 1 },
    responseCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["learnerId", "promptId", "responseCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode supplied learner, reflection-prompt and response-code metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerId, promptId, responseCode } = request;
  const compute = (): Output => {
    H.domain(learnerId.length > 0, "learnerId");
    H.domain(promptId.length > 0, "promptId");
    H.domain(responseCode.length > 0, "responseCode");
    return { token: JSON.stringify([learnerId, promptId, responseCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { learnerId: "L17", promptId: "P4", responseCode: "revised" },
  output: { token: '["L17","P4","revised"]' },
} satisfies ToolExample<Input, Output>;
export const artLearningReflectionResponseCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-learning-reflection-response-code",
    title: "Art Learning Reflection Response Code",
    description:
      "Encode supplied learner, reflection-prompt and response-code metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        learnerId: { type: "string", maxLength: 8192, minLength: 1 },
        promptId: { type: "string", maxLength: 8192, minLength: 1 },
        responseCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["learnerId", "promptId", "responseCode"],
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
          id: "learnerId",
          label: "Learner Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "promptId",
          label: "Prompt Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "responseCode",
          label: "Response Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artLearningReflectionResponseCodeTool.execute;
export default artLearningReflectionResponseCodeTool;
