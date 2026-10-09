import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportId: string;
  readonly conclusionCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportId: { type: "string", maxLength: 8192, minLength: 1 },
    conclusionCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["reportId", "conclusionCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied conclusion code and codebook source without generating or interpreting a forensic conclusion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportId, conclusionCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(reportId.length > 0, "reportId");
    H.domain(conclusionCode.length > 0, "conclusionCode");
    H.domain(codebookSource.length > 0, "codebookSource");
    return {
      token: JSON.stringify([reportId, conclusionCode, codebookSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reportId: "R17",
    conclusionCode: "C2",
    codebookSource: "Manual A v3",
  },
  output: { token: '["R17","C2","Manual A v3"]' },
} satisfies ToolExample<Input, Output>;
export const forensicReportConclusionSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "forensic-science",
        "forensic science",
        "research and quality management",
      ],
      keywords: ["forensic science", "research and quality management"],
    },
    id: "forensic-science/forensic-report-conclusion-source-code",
    title: "Forensic Report Conclusion Source Code",
    description:
      "Record a supplied conclusion code and codebook source without generating or interpreting a forensic conclusion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportId: { type: "string", maxLength: 8192, minLength: 1 },
        conclusionCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["reportId", "conclusionCode", "codebookSource"],
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
          id: "reportId",
          label: "Report Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "conclusionCode",
          label: "Conclusion Code",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = forensicReportConclusionSourceCodeTool.execute;
export default forensicReportConclusionSourceCodeTool;
