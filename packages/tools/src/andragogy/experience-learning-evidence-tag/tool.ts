import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly experienceId: string;
  readonly learningOutcomeCode: string;
  readonly evidenceReference: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    experienceId: { type: "string", maxLength: 8192, minLength: 1 },
    learningOutcomeCode: { type: "string", maxLength: 8192, minLength: 1 },
    evidenceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["experienceId", "learningOutcomeCode", "evidenceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Record an explicit experience/outcome/evidence association without assessing learning achievement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { experienceId, learningOutcomeCode, evidenceReference } = request;
  const compute = (): Output => {
    H.domain(
      experienceId.length > 0 &&
        learningOutcomeCode.length > 0 &&
        evidenceReference.length > 0,
      "experienceId",
    );
    return {
      tag: JSON.stringify([
        experienceId,
        learningOutcomeCode,
        evidenceReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    experienceId: "X17",
    learningOutcomeCode: "LO3",
    evidenceReference: "E12",
  },
  output: { tag: '["X17","LO3","E12"]' },
} satisfies ToolExample<Input, Output>;
export const experienceLearningEvidenceTagTool = H.defineSchemaCalculation<
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
    id: "andragogy/experience-learning-evidence-tag",
    title: "Experience Learning Evidence Tag",
    description:
      "Record an explicit experience/outcome/evidence association without assessing learning achievement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        experienceId: { type: "string", maxLength: 8192, minLength: 1 },
        learningOutcomeCode: { type: "string", maxLength: 8192, minLength: 1 },
        evidenceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["experienceId", "learningOutcomeCode", "evidenceReference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
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
          id: "learningOutcomeCode",
          label: "Learning Outcome Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "evidenceReference",
          label: "Evidence Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = experienceLearningEvidenceTagTool.execute;
export default experienceLearningEvidenceTagTool;
