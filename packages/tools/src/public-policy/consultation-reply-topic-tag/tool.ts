import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consultationId: string;
  readonly replyId: string;
  readonly suppliedTopicCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consultationId: { type: "string", maxLength: 8192, minLength: 1 },
    replyId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedTopicCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["consultationId", "replyId", "suppliedTopicCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit consultation reply topic code without classifying content or inferring support. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consultationId, replyId, suppliedTopicCode } = request;
  const compute = (): Output => {
    H.domain(consultationId.length > 0, "consultationId");
    H.domain(replyId.length > 0, "replyId");
    H.domain(suppliedTopicCode.length > 0, "suppliedTopicCode");
    return {
      token: JSON.stringify([consultationId, replyId, suppliedTopicCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { consultationId: "CON17", replyId: "R2", suppliedTopicCode: "TOP2" },
  output: { token: '["CON17","R2","TOP2"]' },
} satisfies ToolExample<Input, Output>;
export const consultationReplyTopicTagTool = H.defineSchemaCalculation<
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
    id: "public-policy/consultation-reply-topic-tag",
    title: "Consultation Reply Topic Tag",
    description:
      "Qualify an explicit consultation reply topic code without classifying content or inferring support.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consultationId: { type: "string", maxLength: 8192, minLength: 1 },
        replyId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedTopicCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["consultationId", "replyId", "suppliedTopicCode"],
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
          id: "consultationId",
          label: "Consultation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "replyId",
          label: "Reply Id",
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
export const run = consultationReplyTopicTagTool.execute;
export default consultationReplyTopicTagTool;
