import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly questionId: string;
  readonly suppliedTopicCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    questionId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTopicCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "questionId", "suppliedTopicCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit farmer-question topic code by session without classifying question content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, questionId, suppliedTopicCode } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(questionId.length > 0, "questionId");
    H.domain(suppliedTopicCode.length > 0, "suppliedTopicCode");
    return {
      token: JSON.stringify([sessionId, questionId, suppliedTopicCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionId: "SES17", questionId: "Q2", suppliedTopicCode: "TOP2" },
  output: { token: '["SES17","Q2","TOP2"]' },
} satisfies ToolExample<Input, Output>;
export const farmerQuestionTopicKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-extension",
        "agricultural extension",
        "agriculture",
      ],
      keywords: ["agricultural extension", "agriculture"],
    },
    id: "agricultural-extension/farmer-question-topic-key",
    title: "Farmer Question Topic Key",
    description:
      "Qualify an explicit farmer-question topic code by session without classifying question content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
        questionId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTopicCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionId", "questionId", "suppliedTopicCode"],
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
          id: "sessionId",
          label: "Session Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "questionId",
          label: "Question Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedTopicCode",
          label: "Supplied Topic Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmerQuestionTopicKeyTool.execute;
export default farmerQuestionTopicKeyTool;
