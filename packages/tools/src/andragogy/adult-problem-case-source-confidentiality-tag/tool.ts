import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseId: string;
  readonly sourceId: string;
  readonly confidentialityCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    confidentialityCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseId", "sourceId", "confidentialityCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied learning-case source and confidentiality metadata without granting access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseId, sourceId, confidentialityCode } = request;
  const compute = (): Output => {
    H.domain(caseId.length > 0, "caseId");
    H.domain(sourceId.length > 0, "sourceId");
    H.domain(confidentialityCode.length > 0, "confidentialityCode");
    return { token: JSON.stringify([caseId, sourceId, confidentialityCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseId: "C17", sourceId: "S4", confidentialityCode: "public" },
  output: { token: '["C17","S4","public"]' },
} satisfies ToolExample<Input, Output>;
export const adultProblemCaseSourceConfidentialityTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["andragogy", "education"],
        keywords: ["andragogy", "education"],
      },
      id: "andragogy/adult-problem-case-source-confidentiality-tag",
      title: "Adult Problem Case Source Confidentiality Tag",
      description:
        "Preserve supplied learning-case source and confidentiality metadata without granting access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          caseId: { type: "string", maxLength: 8192, minLength: 1 },
          sourceId: { type: "string", maxLength: 8192, minLength: 1 },
          confidentialityCode: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["caseId", "sourceId", "confidentialityCode"],
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
            id: "caseId",
            label: "Case Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceId",
            label: "Source Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "confidentialityCode",
            label: "Confidentiality Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = adultProblemCaseSourceConfidentialityTagTool.execute;
export default adultProblemCaseSourceConfidentialityTagTool;
