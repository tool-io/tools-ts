import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestId: string;
  readonly suppliedRightsNote: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedRightsNote: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["requestId", "suppliedRightsNote", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit interlibrary-loan rights note and source without determining copyright permission. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestId, suppliedRightsNote, source } = request;
  const compute = (): Output => {
    H.domain(requestId.length > 0, "requestId");
    H.domain(suppliedRightsNote.length > 0, "suppliedRightsNote");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([requestId, suppliedRightsNote, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestId: "REQ17",
    suppliedRightsNote: "permission recorded",
    source: "Source A",
  },
  output: { token: '["REQ17","permission recorded","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const interlibraryLoanCopyrightSourceNoteTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "library-science",
          "library science",
          "information and language sciences",
        ],
        keywords: ["library science", "information and language sciences"],
      },
      id: "library-science/interlibrary-loan-copyright-source-note-tag",
      title: "Interlibrary Loan Copyright Source Note Tag",
      description:
        "Preserve an explicit interlibrary-loan rights note and source without determining copyright permission.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requestId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedRightsNote: { type: "string", maxLength: 8192, minLength: 1 },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["requestId", "suppliedRightsNote", "source"],
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
            id: "requestId",
            label: "Request Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedRightsNote",
            label: "Supplied Rights Note",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
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
export const run = interlibraryLoanCopyrightSourceNoteTagTool.execute;
export default interlibraryLoanCopyrightSourceNoteTagTool;
