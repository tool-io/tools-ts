import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly recordedCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sampleId", "recordedCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record an explicit respiratory-sample validity code without deciding sample acceptability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, recordedCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(
      sampleId.length > 0 &&
        recordedCode.length > 0 &&
        codebookSource.length > 0,
      "sampleId",
    );
    return { label: JSON.stringify([sampleId, recordedCode, codebookSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleId: "S17",
    recordedCode: "ACCEPTED",
    codebookSource: "Protocol A",
  },
  output: { label: '["S17","ACCEPTED","Protocol A"]' },
} satisfies ToolExample<Input, Output>;
export const respiratorySampleValidityCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/respiratory-sample-validity-code",
    title: "Respiratory Sample Validity Code",
    description:
      "Record an explicit respiratory-sample validity code without deciding sample acceptability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sampleId", "recordedCode", "codebookSource"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookSource",
          label: "Codebook Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = respiratorySampleValidityCodeTool.execute;
export default respiratorySampleValidityCodeTool;
