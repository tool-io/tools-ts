import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studentRecordCode: string;
  readonly institution: string;
  readonly year: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentRecordCode: { type: "string", maxLength: 8192 },
    institution: { type: "string", maxLength: 8192 },
    year: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["studentRecordCode", "institution", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a recorded matriculation year without inferring degree completion or a modern identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studentRecordCode, institution, year } = request;
  const compute = (): Output => {
    H.domain(
      studentRecordCode.length > 0 && institution.length > 0,
      "studentRecordCode",
    );
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    return {
      label: studentRecordCode + "; matriculation " + institution + ", " + year,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studentRecordCode: "S17", institution: "University A", year: 1850 },
  output: { label: "S17; matriculation University A, 1850" },
} satisfies ToolExample<Input, Output>;
export const europeanUniversityMatriculationYearLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "european-studies/european-university-matriculation-year-label",
      title: "European University Matriculation Year Label Tool",
      description:
        "Label a recorded matriculation year without inferring degree completion or a modern identity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          studentRecordCode: { type: "string", maxLength: 8192 },
          institution: { type: "string", maxLength: 8192 },
          year: { type: "integer", minimum: 1, maximum: 9999 },
        },
        required: ["studentRecordCode", "institution", "year"],
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
            id: "studentRecordCode",
            label: "Student Record Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "institution",
            label: "Institution",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "year",
            label: "Year",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = europeanUniversityMatriculationYearLabelTool.execute;
export default europeanUniversityMatriculationYearLabelTool;
