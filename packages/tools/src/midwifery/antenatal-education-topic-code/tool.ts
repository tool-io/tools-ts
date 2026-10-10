import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly topicCode: string;
  readonly curriculumSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    topicCode: { type: "string", maxLength: 8192, minLength: 1 },
    curriculumSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "topicCode", "curriculumSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly recorded antenatal education topic code by its curriculum source without prescribing educational content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, topicCode, curriculumSource } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(topicCode.length > 0, "topicCode");
    H.domain(curriculumSource.length > 0, "curriculumSource");
    return { token: JSON.stringify([sessionId, topicCode, curriculumSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionId: "S17",
    topicCode: "TOPIC-A",
    curriculumSource: "Curriculum v2",
  },
  output: { token: '["S17","TOPIC-A","Curriculum v2"]' },
} satisfies ToolExample<Input, Output>;
export const antenatalEducationTopicCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/antenatal-education-topic-code",
    title: "Antenatal Education Topic Code",
    description:
      "Qualify an explicitly recorded antenatal education topic code by its curriculum source without prescribing educational content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
        topicCode: { type: "string", maxLength: 8192, minLength: 1 },
        curriculumSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionId", "topicCode", "curriculumSource"],
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
          id: "topicCode",
          label: "Topic Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "curriculumSource",
          label: "Curriculum Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = antenatalEducationTopicCodeTool.execute;
export default antenatalEducationTopicCodeTool;
