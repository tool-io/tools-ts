import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly page: number;
  readonly firstLine: number;
  readonly lastLine: number;
  readonly claimId: string;
};
export type Output = { readonly lineCount: number; readonly locator: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192 },
    page: { type: "integer", minimum: 1 },
    firstLine: { type: "integer", minimum: 1 },
    lastLine: { type: "integer" },
    claimId: { type: "string", maxLength: 8192 },
  },
  required: ["documentId", "page", "firstLine", "lastLine", "claimId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineCount: { type: "integer" },
    locator: { type: "string", maxLength: 8192 },
  },
  required: ["lineCount", "locator"],
} as const;
/** Locate an explicit claim/citation span without verifying the claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, page, firstLine, lastLine, claimId } = request;
  const compute = (): Output => {
    H.integer(page, 1);
    H.integer(firstLine, 1);
    H.integer(lastLine, firstLine);
    H.domain(documentId.length > 0 && claimId.length > 0);
    return {
      lineCount: lastLine - firstLine + 1,
      locator: JSON.stringify([documentId, page, firstLine, lastLine, claimId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    documentId: "doc-A",
    page: 12,
    firstLine: 3,
    lastLine: 6,
    claimId: "claim-1",
  },
  output: { lineCount: 4, locator: '["doc-A",12,3,6,"claim-1"]' },
} satisfies ToolExample<Input, Output>;
export const chiropracticDocumentClaimCitationLocatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "chiropractic/chiropractic-document-claim-citation-locator",
      title: "Chiropractic Document Claim Citation Locator Tool",
      description:
        "Locate an explicit claim/citation span without verifying the claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          documentId: { type: "string", maxLength: 8192 },
          page: { type: "integer", minimum: 1 },
          firstLine: { type: "integer", minimum: 1 },
          lastLine: { type: "integer" },
          claimId: { type: "string", maxLength: 8192 },
        },
        required: ["documentId", "page", "firstLine", "lastLine", "claimId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lineCount: { type: "integer" },
          locator: { type: "string", maxLength: 8192 },
        },
        required: ["lineCount", "locator"],
      },
      ports: {
        inputs: [
          {
            id: "documentId",
            label: "Document Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "page",
            label: "Page",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "firstLine",
            label: "First Line",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "lastLine",
            label: "Last Line",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "claimId",
            label: "Claim Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "lineCount",
            label: "Line Count",
            valueType: { type: "integer" },
          },
          { id: "locator", label: "Locator", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = chiropracticDocumentClaimCitationLocatorTool.execute;
export default chiropracticDocumentClaimCitationLocatorTool;
