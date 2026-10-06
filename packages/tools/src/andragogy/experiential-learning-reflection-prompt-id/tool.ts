import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly activityId: string;
  readonly promptId: string;
  readonly responseId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    activityId: { type: "string", maxLength: 8192, minLength: 1 },
    promptId: { type: "string", maxLength: 8192, minLength: 1 },
    responseId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["activityId", "promptId", "responseId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate supplied experiential-learning activity, reflection prompt and response identifiers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { activityId, promptId, responseId } = request;
  const compute = (): Output => {
    H.domain(activityId.length > 0, "activityId");
    H.domain(promptId.length > 0, "promptId");
    H.domain(responseId.length > 0, "responseId");
    return { token: JSON.stringify([activityId, promptId, responseId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { activityId: "A17", promptId: "P3", responseId: "R8" },
  output: { token: '["A17","P3","R8"]' },
} satisfies ToolExample<Input, Output>;
export const experientialLearningReflectionPromptIdTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["andragogy", "education"],
        keywords: ["andragogy", "education"],
      },
      id: "andragogy/experiential-learning-reflection-prompt-id",
      title: "Experiential Learning Reflection Prompt ID",
      description:
        "Associate supplied experiential-learning activity, reflection prompt and response identifiers.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          activityId: { type: "string", maxLength: 8192, minLength: 1 },
          promptId: { type: "string", maxLength: 8192, minLength: 1 },
          responseId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["activityId", "promptId", "responseId"],
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
            id: "activityId",
            label: "Activity Id",
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
            id: "responseId",
            label: "Response Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = experientialLearningReflectionPromptIdTool.execute;
export default experientialLearningReflectionPromptIdTool;
