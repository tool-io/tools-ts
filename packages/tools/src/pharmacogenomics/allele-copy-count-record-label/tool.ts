import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly alleleLabel: string;
  readonly reportedCopies: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    alleleLabel: { type: "string", maxLength: 8192, minLength: 1 },
    reportedCopies: { type: "integer", minimum: 0 },
  },
  required: ["recordId", "alleleLabel", "reportedCopies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied allele copy count without estimating copy number or phenotype. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, alleleLabel, reportedCopies } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && alleleLabel.length > 0, "recordId");
    (H.domain(
      Number.isSafeInteger(reportedCopies) &&
        reportedCopies >= 0 &&
        reportedCopies <= Number.MAX_SAFE_INTEGER,
      "reportedCopies",
    ),
      reportedCopies);
    return {
      label: recordId + "; " + alleleLabel + "; copies=" + reportedCopies,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", alleleLabel: "*2", reportedCopies: 3 },
  output: { label: "R17; *2; copies=3" },
} satisfies ToolExample<Input, Output>;
export const alleleCopyCountRecordLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacogenomics", "pharmacy"],
      keywords: ["pharmacogenomics", "pharmacy"],
    },
    id: "pharmacogenomics/allele-copy-count-record-label",
    title: "Allele Copy Count Record Label",
    description:
      "Label an explicitly supplied allele copy count without estimating copy number or phenotype.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        alleleLabel: { type: "string", maxLength: 8192, minLength: 1 },
        reportedCopies: { type: "integer", minimum: 0 },
      },
      required: ["recordId", "alleleLabel", "reportedCopies"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alleleLabel",
          label: "Allele Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedCopies",
          label: "Reported Copies",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = alleleCopyCountRecordLabelTool.execute;
export default alleleCopyCountRecordLabelTool;
