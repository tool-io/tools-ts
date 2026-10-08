import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interviewCode: string;
  readonly codebookVersion: string;
  readonly coderCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interviewCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
    coderCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["interviewCode", "codebookVersion", "coderCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicit codebook-version and coder metadata to an interview code without recoding interview content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interviewCode, codebookVersion, coderCode } = request;
  const compute = (): Output => {
    H.domain(
      interviewCode.length > 0 &&
        codebookVersion.length > 0 &&
        coderCode.length > 0,
      "interviewCode",
    );
    return {
      label:
        interviewCode +
        "; codebook=" +
        codebookVersion +
        "; coder=" +
        coderCode,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interviewCode: "I17", codebookVersion: "v3", coderCode: "A2" },
  output: { label: "I17; codebook=v3; coder=A2" },
} satisfies ToolExample<Input, Output>;
export const interviewCodeBookVersionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/interview-code-book-version-label",
    title: "Interview Code Book Version Label",
    description:
      "Attach explicit codebook-version and coder metadata to an interview code without recoding interview content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interviewCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
        coderCode: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["interviewCode", "codebookVersion", "coderCode"],
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
          id: "interviewCode",
          label: "Interview Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookVersion",
          label: "Codebook Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "coderCode",
          label: "Coder Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = interviewCodeBookVersionLabelTool.execute;
export default interviewCodeBookVersionLabelTool;
