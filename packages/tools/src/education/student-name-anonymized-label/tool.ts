import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studentCode: string;
  readonly assignmentCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentCode: { type: "string", maxLength: 8192 },
    assignmentCode: { type: "string", maxLength: 8192 },
  },
  required: ["studentCode", "assignmentCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Build a code-only assignment label from caller-supplied pseudonymous identifiers; this does not anonymize a real name or guarantee unlinkability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studentCode, assignmentCode } = request;
  const compute = (): Output => {
    H.domain(
      studentCode.trim().length > 0 && assignmentCode.trim().length > 0,
      "studentCode",
    );
    return { label: JSON.stringify([studentCode, assignmentCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studentCode: "S-017", assignmentCode: "Essay-2" },
  output: { label: '["S-017","Essay-2"]' },
} satisfies ToolExample<Input, Output>;
export const studentNameAnonymizedLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/student-name-anonymized-label",
    title: "Student Name Anonymized Label Tool",
    description:
      "Build a code-only assignment label from caller-supplied pseudonymous identifiers; this does not anonymize a real name or guarantee unlinkability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studentCode: { type: "string", maxLength: 8192 },
        assignmentCode: { type: "string", maxLength: 8192 },
      },
      required: ["studentCode", "assignmentCode"],
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
          id: "studentCode",
          label: "Student Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assignmentCode",
          label: "Assignment Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = studentNameAnonymizedLabelTool.execute;
export default studentNameAnonymizedLabelTool;
