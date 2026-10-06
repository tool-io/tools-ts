import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly evidenceId: string;
  readonly assessorId: string;
  readonly assessmentCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
    assessorId: { type: "string", maxLength: 8192, minLength: 1 },
    assessmentCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["evidenceId", "assessorId", "assessmentCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit prior-learning evidence item, assessor and supplied assessment code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { evidenceId, assessorId, assessmentCode } = request;
  const compute = (): Output => {
    H.domain(evidenceId.length > 0, "evidenceId");
    H.domain(assessorId.length > 0, "assessorId");
    H.domain(assessmentCode.length > 0, "assessmentCode");
    return { token: JSON.stringify([evidenceId, assessorId, assessmentCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { evidenceId: "E17", assessorId: "A4", assessmentCode: "reviewed" },
  output: { token: '["E17","A4","reviewed"]' },
} satisfies ToolExample<Input, Output>;
export const priorLearningEvidenceAssessorCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/prior-learning-evidence-assessor-code",
    title: "Prior Learning Evidence Assessor Code",
    description:
      "Record an explicit prior-learning evidence item, assessor and supplied assessment code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        evidenceId: { type: "string", maxLength: 8192, minLength: 1 },
        assessorId: { type: "string", maxLength: 8192, minLength: 1 },
        assessmentCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["evidenceId", "assessorId", "assessmentCode"],
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
          id: "evidenceId",
          label: "Evidence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessorId",
          label: "Assessor Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assessmentCode",
          label: "Assessment Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = priorLearningEvidenceAssessorCodeTool.execute;
export default priorLearningEvidenceAssessorCodeTool;
