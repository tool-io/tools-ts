import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly queryId: string; readonly documentId: string };
export type Output = { readonly pairKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    queryId: { type: "string", maxLength: 8192, minLength: 1 },
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["queryId", "documentId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { pairKey: { type: "string", maxLength: 8192 } },
  required: ["pairKey"],
} as const;
/** Construct an unambiguous ordered retrieval query-document identifier pair. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { queryId, documentId } = request;
  const compute = (): Output => {
    H.domain(queryId.length > 0 && documentId.length > 0, "queryId");
    return { pairKey: JSON.stringify([queryId, documentId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { queryId: "Q17", documentId: "D3" },
  output: { pairKey: '["Q17","D3"]' },
} satisfies ToolExample<Input, Output>;
export const retrievalQueryDocumentPairLabelTool = H.defineSchemaCalculation<
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
    id: "information-science/retrieval-query-document-pair-label",
    title: "Retrieval Query Document Pair Label",
    description:
      "Construct an unambiguous ordered retrieval query-document identifier pair.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        queryId: { type: "string", maxLength: 8192, minLength: 1 },
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["queryId", "documentId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { pairKey: { type: "string", maxLength: 8192 } },
      required: ["pairKey"],
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
      ],
      outputs: [
        { id: "pairKey", label: "Pair Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = retrievalQueryDocumentPairLabelTool.execute;
export default retrievalQueryDocumentPairLabelTool;
