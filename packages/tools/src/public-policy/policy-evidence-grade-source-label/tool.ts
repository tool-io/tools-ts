import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grade: string;
  readonly gradingFramework: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grade: { type: "string", maxLength: 8192 },
    gradingFramework: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["grade", "gradingFramework", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied evidence grade with its framework and source without grading evidence automatically. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grade, gradingFramework, source } = request;
  const compute = (): Output => {
    H.domain(
      grade.length > 0 && gradingFramework.length > 0 && source.length > 0,
      "grade",
    );
    return { label: grade + " [" + gradingFramework + "; " + source + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grade: "B",
    gradingFramework: "Local evidence rubric",
    source: "Review 2026",
  },
  output: { label: "B [Local evidence rubric; Review 2026]" },
} satisfies ToolExample<Input, Output>;
export const policyEvidenceGradeSourceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-evidence-grade-source-label",
    title: "Policy Evidence Grade Source Label Tool",
    description:
      "Label a supplied evidence grade with its framework and source without grading evidence automatically.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grade: { type: "string", maxLength: 8192 },
        gradingFramework: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["grade", "gradingFramework", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "grade",
          label: "Grade",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "gradingFramework",
          label: "Grading Framework",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = policyEvidenceGradeSourceLabelTool.execute;
export default policyEvidenceGradeSourceLabelTool;
