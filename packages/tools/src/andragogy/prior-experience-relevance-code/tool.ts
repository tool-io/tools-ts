import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly experienceId: string;
  readonly learningGoalId: string;
  readonly relevanceCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experienceId: { type: "string", maxLength: 8192, minLength: 1 },
    learningGoalId: { type: "string", maxLength: 8192, minLength: 1 },
    relevanceCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["experienceId", "learningGoalId", "relevanceCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied prior-experience relevance code for an explicit learning goal without assessing transferability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { experienceId, learningGoalId, relevanceCode } = request;
  const compute = (): Output => {
    H.domain(experienceId.length > 0, "experienceId");
    H.domain(learningGoalId.length > 0, "learningGoalId");
    H.domain(relevanceCode.length > 0, "relevanceCode");
    return {
      token: JSON.stringify([experienceId, learningGoalId, relevanceCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { experienceId: "E17", learningGoalId: "G4", relevanceCode: "direct" },
  output: { token: '["E17","G4","direct"]' },
} satisfies ToolExample<Input, Output>;
export const priorExperienceRelevanceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/prior-experience-relevance-code",
    title: "Prior Experience Relevance Code",
    description:
      "Record a supplied prior-experience relevance code for an explicit learning goal without assessing transferability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        experienceId: { type: "string", maxLength: 8192, minLength: 1 },
        learningGoalId: { type: "string", maxLength: 8192, minLength: 1 },
        relevanceCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["experienceId", "learningGoalId", "relevanceCode"],
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
          id: "experienceId",
          label: "Experience Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "learningGoalId",
          label: "Learning Goal Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relevanceCode",
          label: "Relevance Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = priorExperienceRelevanceCodeTool.execute;
export default priorExperienceRelevanceCodeTool;
