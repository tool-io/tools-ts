import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly queryId: string;
  readonly documentId: string;
  readonly recordedGrade: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryId: { type: "string", maxLength: 8192, minLength: 1 },
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedGrade: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["queryId", "documentId", "recordedGrade"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied query-document relevance judgment without computing relevance or enforcing a grading scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryId, documentId, recordedGrade } = request;
  const compute = (): Output => {
    H.domain(queryId.length > 0, "queryId");
    H.domain(documentId.length > 0, "documentId");
    H.domain(recordedGrade.length > 0, "recordedGrade");
    return { token: JSON.stringify([queryId, documentId, recordedGrade]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queryId: "Q17", documentId: "D3", recordedGrade: "high" },
  output: { token: '["Q17","D3","high"]' },
} satisfies ToolExample<Input, Output>;
export const searchResultRelevanceGradeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/search-result-relevance-grade-token",
    title: "Search Result Relevance Grade Token",
    description:
      "Record a supplied query-document relevance judgment without computing relevance or enforcing a grading scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryId: { type: "string", maxLength: 8192, minLength: 1 },
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedGrade: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["queryId", "documentId", "recordedGrade"],
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
          id: "queryId",
          label: "Query Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedGrade",
          label: "Recorded Grade",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = searchResultRelevanceGradeTokenTool.execute;
export default searchResultRelevanceGradeTokenTool;
