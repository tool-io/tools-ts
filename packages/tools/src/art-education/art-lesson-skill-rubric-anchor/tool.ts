import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lessonId: string;
  readonly skillId: string;
  readonly suppliedAnchor: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lessonId: { type: "string", maxLength: 8192, minLength: 1 },
    skillId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAnchor: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["lessonId", "skillId", "suppliedAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit lesson skill and rubric anchor without assigning achievement levels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lessonId, skillId, suppliedAnchor } = request;
  const compute = (): Output => {
    H.domain(lessonId.length > 0, "lessonId");
    H.domain(skillId.length > 0, "skillId");
    H.domain(suppliedAnchor.length > 0, "suppliedAnchor");
    return { token: JSON.stringify([lessonId, skillId, suppliedAnchor]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lessonId: "L17",
    skillId: "S4",
    suppliedAnchor: "controlled contour",
  },
  output: { token: '["L17","S4","controlled contour"]' },
} satisfies ToolExample<Input, Output>;
export const artLessonSkillRubricAnchorTool = H.defineSchemaCalculation<
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
    id: "art-education/art-lesson-skill-rubric-anchor",
    title: "Art Lesson Skill Rubric Anchor",
    description:
      "Record an explicit lesson skill and rubric anchor without assigning achievement levels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lessonId: { type: "string", maxLength: 8192, minLength: 1 },
        skillId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAnchor: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["lessonId", "skillId", "suppliedAnchor"],
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
          id: "lessonId",
          label: "Lesson Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "skillId",
          label: "Skill Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAnchor",
          label: "Supplied Anchor",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = artLessonSkillRubricAnchorTool.execute;
export default artLessonSkillRubricAnchorTool;
